import argparse
import base64
import json
from datetime import datetime, timezone
from pathlib import Path

from github import GitHub
from registry import parse_submission


def collect(api, repository):
    metadata = api.request('/repos/' + repository)
    commit = api.request('/repos/' + repository + '/commits/HEAD')['sha']
    parse_submission(json.dumps({'repository': repository, 'commit': commit}))
    blob = api.request(f'/repos/{repository}/contents/manifest.json?ref={commit}')
    manifest = json.loads(base64.b64decode(blob['content']))
    return {'package': '@' + repository.lower(), 'repository': metadata['full_name'],
            'repositoryId': metadata['id'], 'path': '', 'commit': commit,
            **{k: manifest[k] for k in ('id', 'name', 'description', 'author', 'version', 'kinds')},
            'license': manifest.get('license', 'Not declared'),
            'stars': metadata['stargazers_count'], 'forks': metadata['forks_count'],
            'repositoryCreatedAt': metadata['created_at'], 'status': 'discovered',
            'publishedAt': None, 'importedAt': datetime.now(timezone.utc).isoformat(),
            'publisher': None, 'warnings': []}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Import discovery metadata, without granting registry verification.')
    parser.add_argument('repositories', nargs='+')
    args = parser.parse_args()
    api = GitHub()
    records = [collect(api, repo) for repo in args.repositories]
    Path('data/seed.json').write_text(json.dumps(records, indent=2) + '\n')
