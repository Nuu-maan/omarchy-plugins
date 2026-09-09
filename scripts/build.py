import hashlib
import json
from collections import defaultdict
from pathlib import Path

from registry import parse_submission

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public'


def version_key(record):
    core, _, prerelease = record['version'].partition('-')
    return (tuple(int(v) for v in core.split('.')), not prerelease,
            tuple((0, int(p)) if p.isdigit() else (1, p) for p in prerelease.split('.')))


def load_records():
    seeds = json.loads((ROOT / 'data/seed.json').read_text())
    live_path = ROOT / '_records.json'
    live = json.loads(live_path.read_text()) if live_path.exists() else []
    blocked = json.loads((ROOT / 'data/blocked.json').read_text())
    records = []
    for record in seeds + live:
        parse_submission(json.dumps({k: record[k] for k in ('repository', 'commit', 'path')}))
        if record['repository'].lower() not in blocked:
            records.append(record)
    return records


def build():
    records = load_records()
    grouped = defaultdict(list)
    for record in records:
        grouped[record['package']].append(record)
    latest = []
    for history in grouped.values():
        checked = [r for r in history if r['status'] == 'checked']
        record = max(checked or history, key=version_key)
        latest.append({**record, 'slug': hashlib.sha256(record['package'].encode()).hexdigest()[:20]})
    latest.sort(key=lambda r: (r['status'] != 'checked', r['name'].lower()))
    activity = sorted([r for r in records if r['status'] == 'checked'], key=lambda r: r['publishedAt'], reverse=True)
    OUT.mkdir(exist_ok=True, parents=True)
    (OUT / 'registry.json').write_text(json.dumps({'schemaVersion': 1, 'plugins': latest, 'releases': activity}, separators=(',', ':')))
    print(f'Exported {len(latest)} plugins and {len(activity)} releases.')


if __name__ == '__main__':
    build()
