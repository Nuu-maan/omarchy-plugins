import json
import os
from urllib.request import Request, urlopen


class GitHub:
    def __init__(self):
        self.token = os.environ.get('GH_TOKEN', '')

    def request(self, path, method='GET', data=None):
        if not path.startswith('/') or path.startswith('//'):
            raise ValueError('Expected a GitHub API path')
        headers = {'Accept': 'application/vnd.github+json', 'User-Agent': 'omarchy-plugins-registry',
                   'X-GitHub-Api-Version': '2022-11-28'}
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'
        body = None if data is None else json.dumps(data).encode()
        request = Request('https://api.github.com' + path, data=body, headers=headers, method=method)
        with urlopen(request, timeout=30) as response:
            raw = response.read(8_000_001)
        if len(raw) > 8_000_000:
            raise ValueError('GitHub response exceeds the 8 MB limit')
        return json.loads(raw) if raw else None

    def pages(self, path):
        separator = '&' if '?' in path else '?'
        for page in range(1, 101):
            rows = self.request(f'{path}{separator}per_page=100&page={page}')
            yield from rows
            if len(rows) < 100:
                return
        raise ValueError('Pagination limit reached; refusing a partial registry')
