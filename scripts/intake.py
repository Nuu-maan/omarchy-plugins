import json
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

from registry import REGISTRY, parse_submission, require, verify
from scan import scan_repository
from trust import REASONS, event_id, payload, review


def resolve(api, body):
    value = payload(body)
    repository = value.get('repository', '')
    if repository.startswith('https://'):
        url = urlparse(repository)
        require(url.netloc == 'github.com' and not url.query and not url.fragment, 'Use a public github.com repository URL')
        repository = url.path.strip('/').removesuffix('.git')
    submission = parse_submission(json.dumps({'repository': repository, 'commit': value.get('commit') or '0' * 40, 'path': value.get('path', '')}))
    if not value.get('commit'):
        metadata = api.request('/repos/' + repository)
        submission['commit'] = api.request(f'/repos/{repository}/commits/{metadata["default_branch"]}')['sha']
    return submission


def prepare(api, records, ledger):
    proposals = []
    reviewers = json.loads(Path('data/reviewers.json').read_text())
    seen = {e.get('requestId') for e in ledger}
    for issue in api.pages(f'/repos/{REGISTRY}/issues?state=open&sort=created&direction=asc'):
        labels = {label['name'] for label in issue['labels']}
        if 'pull_request' in issue or not labels.intersection({'publish', 'review', 'report'}):
            continue
        require(len(proposals) < 20, 'Queue batch exceeds 20; remaining requests will be retried')
        request_id = event_id({'issue': issue['number'], 'body': issue['body'], 'actor': issue['user']['id']})
        if request_id in seen:
            continue
        try:
            if 'review' in labels:
                event = review(payload(issue['body']), issue['user'], records, reviewers)
            elif 'report' in labels:
                value = payload(issue['body'])
                matches = [r for r in records if r['package'] == value.get('package')]
                require(matches and value.get('reason') in REASONS, 'Choose an existing plugin and a report reason')
                require(isinstance(value.get('notes', ''), str) and len(value.get('notes', '')) <= 4000, 'Explanation exceeds 4,000 characters')
                event = {'type': 'report', 'package': value['package'], 'reason': value['reason'],
                         'notes': value.get('notes', ''), 'reporter': issue['user']['login']}
                latest = matches[-1]
                try:
                    event['rescan'] = scan_repository(api, dict(latest))['scan']
                except (ValueError, KeyError) as error:
                    event['rescanError'] = str(error)[:1000]
            else:
                submission = resolve(api, issue['body'])
                record = scan_repository(api, verify(api, submission, issue['user']['login'], issue['number'], require_owner=False))
                event = {'type': 'submission', 'package': record['package'], 'record': record}
            event.update(requestId=request_id, timestamp=datetime.now(timezone.utc).isoformat())
            proposals.append({'issue': issue['number'], 'body': issue['body'], 'actorId': issue['user']['id'], 'event': event})
        except (ValueError, KeyError, TypeError, UnicodeError) as error:
            proposals.append({'issue': issue['number'], 'body': issue['body'], 'actorId': issue['user']['id'], 'error': str(error)[:1000]})
    return proposals
