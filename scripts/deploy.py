import os
import json
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen


def main():
    proposals = Path('_proposals.json')
    if proposals.exists() and not json.loads(proposals.read_text()):
        print('No registry changes; deployment skipped.')
        return
    hook = os.environ.get('DEPLOY_HOOK', '')
    parsed = urlparse(hook)
    if parsed.scheme != 'https' or parsed.netloc != 'api.vercel.com' or not parsed.path.startswith('/v1/integrations/deploy/'):
        raise SystemExit('A valid REGISTRY_DEPLOY_HOOK secret is required')
    try:
        with urlopen(Request(hook, data=b'', method='POST'), timeout=30) as response:
            if not 200 <= response.status < 300:
                raise RuntimeError('Deployment hook did not accept the request')
    except Exception:
        raise SystemExit('Deployment request failed; check hosting status and retry the workflow') from None
    print('Catalogue deployment requested.')


if __name__ == '__main__':
    main()
