import argparse
import json
import subprocess

from registry import REGISTRY, parse_submission


def main():
    parser = argparse.ArgumentParser(description='Submit a plugin release through your authenticated GitHub account.')
    parser.add_argument('repository')
    parser.add_argument('commit')
    parser.add_argument('--path', default='')
    args = parser.parse_args()
    submission = parse_submission(json.dumps(vars(args)))
    body = '### Release\n```json\n' + json.dumps(submission, indent=2) + '\n```'
    subprocess.run(['gh', 'issue', 'create', '--repo', REGISTRY, '--title',
                    'Publish: ' + submission['repository'], '--label', 'publish', '--body', body], check=True)


if __name__ == '__main__':
    main()
