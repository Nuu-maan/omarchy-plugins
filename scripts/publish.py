import json
import os
from pathlib import Path
from urllib.error import HTTPError, URLError

from github import GitHub
from registry import MARKER, REGISTRY, check_release, parse_submission, receipts, verify


def process(api):
    records = receipts(api)
    blocked = json.loads(Path('data/blocked.json').read_text())
    issues = api.pages(f'/repos/{REGISTRY}/issues?state=open&labels=publish&sort=created&direction=asc')
    for issue in issues:
        if 'pull_request' in issue:
            continue
        endpoint = f'/repos/{REGISTRY}/issues/{issue["number"]}'
        try:
            submission = parse_submission(issue['body'])
            if submission['repository'].lower() in blocked:
                raise ValueError('Repository is suspended; see the registry security policy')
            record = verify(api, submission, issue['user']['login'], issue['number'])
            fresh = api.request(endpoint)
            if fresh['body'] != issue['body'] or fresh['state'] != 'open':
                continue
            if check_release(records, record):
                result = api.request(endpoint + '/comments', 'POST', {
                    'body': MARKER + json.dumps(record, indent=2) + '\n```\n\nAutomated structural checks passed. This is not a security audit. Publication follows a successful site deployment.'})
                record['receipt'] = result['html_url']
                records.append(record)
            api.request(endpoint, 'PATCH', {'state': 'closed', 'state_reason': 'completed'})
        except (ValueError, KeyError, TypeError, UnicodeError) as error:
            api.request(endpoint + '/comments', 'POST', {'body': 'Publication rejected.\n\n' + str(error)[:1000] + '\n\nCorrect the request, then reopen this issue to retry.'})
            api.request(endpoint, 'PATCH', {'state': 'closed', 'state_reason': 'not_planned'})
        except HTTPError as error:
            if error.code in (404, 422):
                api.request(endpoint + '/comments', 'POST', {'body': 'Repository, commit, or file could not be read. Check that it is public and the SHA exists, then reopen this issue.'})
                api.request(endpoint, 'PATCH', {'state': 'closed', 'state_reason': 'not_planned'})
            else:
                raise
    return records


if __name__ == '__main__':
    api = GitHub()
    records = process(api) if os.environ.get('PROCESS_SUBMISSIONS') == 'true' else receipts(api)
    Path('_records.json').write_text(json.dumps(records))
