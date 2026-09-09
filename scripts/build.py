import hashlib
import html
import json
import os
import shutil
from collections import defaultdict
from pathlib import Path
from urllib.parse import quote

from registry import REGISTRY, parse_submission

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / '_site'
BASE = os.environ.get('BASE_PATH', '/omarchy-plugins/').rstrip('/') + '/'
REPO = 'https://github.com/' + REGISTRY


def esc(value):
    return html.escape(str(value), quote=True)


def url(path=''):
    return BASE + path


def slug(record):
    return hashlib.sha256(record['package'].encode()).hexdigest()[:20]


def version_key(record):
    core, _, prerelease = record['version'].partition('-')
    return (tuple(int(v) for v in core.split('.')), not prerelease,
            tuple((0, int(p)) if p.isdigit() else (1, p) for p in prerelease.split('.')))


def badge(record):
    checked = record['status'] == 'checked'
    return f'<span class="badge {"checked" if checked else "discovered"}">{"✓ Checks passed" if checked else "○ Unverified listing"}</span>'


def shell(title, content, active='browse', depth=''):
    navigation = [('browse', '', 'Browse plugins'), ('publish', 'publish/', 'Publish a plugin'),
                  ('activity', 'activity/', 'Release activity'), ('security', 'security/', 'Trust & security')]
    links = ''.join(f'<a {"aria-current=page" if key == active else ""} href="{url(path)}">{text}</a>' for key, path, text in navigation)
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(title)} · Omarchy Plugins</title><meta name="description" content="An independent Omarchy plugin registry. Discover plugins, inspect exact commits, and publish updates with automated checks.">
<link rel="icon" href="{url('favicon.svg')}" type="image/svg+xml"><link rel="stylesheet" href="{url('style.css')}"><script src="{url('app.js')}" defer></script></head>
<body><a class="skip" href="#main">Skip to content</a><header><a class="brand" href="{url()}"><span class="brand-icon">o<span>p</span></span><span>omarchy<span class="muted"> / plugins</span></span></a><div class="header-right"><span class="community">INDEPENDENT REGISTRY</span><a href="{REPO}">GitHub ↗</a></div></header>
<div class="layout"><aside><div class="nav-label">REGISTRY</div><nav>{links}</nav><div class="sidebar-note"><span class="live-dot"></span> Open to everyone<p>Your repository.<br>Your release schedule.</p><a href="{url('publish/')}">How publishing works ↗</a></div><a class="data-link" href="{url('registry.json')}">↓ Registry JSON</a></aside>
<main id="main">{content}</main></div><footer><span>Built for the way you use your shell.</span><span>Independent community project · <a href="{REPO}/blob/main/LICENSE">MIT</a></span></footer></body></html>'''


def write(path, content):
    target = OUT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content)


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
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir()
    for path in (ROOT / 'site').iterdir():
        if path.is_file():
            shutil.copy2(path, OUT / path.name)
    records = load_records()
    grouped = defaultdict(list)
    for record in records:
        grouped[record['package']].append(record)
    latest = []
    for history in grouped.values():
        checked = [r for r in history if r['status'] == 'checked']
        latest.append(max(checked or history, key=version_key))
    latest.sort(key=lambda r: (r['status'] != 'checked', r['name'].lower()))
    rows = []
    for index, record in enumerate(latest):
        tags = ' '.join(record['kinds'])
        rows.append(f'''<a class="plugin-row" data-search="{esc(' '.join(str(record[k]) for k in ('name', 'description', 'repository', 'id', 'kinds')).lower())}" data-kinds="{esc(tags)}" data-status="{record['status']}" href="{url('packages/' + slug(record) + '/')}">
<span class="plugin-icon color-{index % 4}">{esc(record['name'][:2].upper())}</span><div class="plugin-main"><div class="plugin-title"><h2>{esc(record['name'])}</h2><span class="version">v{esc(record['version'])}</span></div><p>{esc(record['description'])}</p><div class="plugin-meta"><span>{esc(record['repository'])}</span><span>{esc(tags)}</span></div><div class="mobile-status">{badge(record)}</div></div><div class="plugin-status">{badge(record)}<span>★ {record['stars']} <span class="muted">GitHub stars</span></span></div><span class="row-arrow">↗</span></a>''')
    checked_count = sum(r['status'] == 'checked' for r in latest)
    content = f'''<div class="eyebrow">THE COMMUNITY TOOLBOX <span>/ 01</span></div><div class="page-heading"><div><h1>Make your shell<br><span class="accent">feel like yours.</span></h1><p>Discover Omarchy plugins. Inspect the source. Make it your own.</p></div><a class="button primary" href="{url('publish/')}">Publish a plugin <span>↗</span></a></div>
<div class="registry-strip"><span><b>{len(latest):02}</b> plugins</span><span><b>{checked_count:02}</b> with registry checks</span><span><i class="live-dot"></i> Maintainer-owned releases</span></div>
<form class="searchbar" role="search"><span aria-hidden="true">⌕</span><label class="sr-only" for="search">Search plugins</label><input id="search" type="search" placeholder="Search plugins, maintainers, or keywords…" autocomplete="off"><kbd>/</kbd></form>
<div class="filters"><div class="filter-buttons" role="group" aria-label="Plugin type"><button type="button" data-filter="" aria-pressed="true">All plugins</button><button type="button" data-filter="bar-widget" aria-pressed="false">Bar widgets</button><button type="button" data-filter="panel" aria-pressed="false">Panels</button><button type="button" data-filter="service" aria-pressed="false">Services</button></div><label class="check-filter"><input id="checked-only" type="checkbox"> Checks passed only</label></div>
<div class="list-heading"><span>EXPLORE THE REGISTRY</span><span id="result-count" aria-live="polite">{len(latest)} plugins</span></div><section id="plugins" aria-label="Plugins">{''.join(rows)}</section><div id="empty" hidden><h2>No plugins match.</h2><p>Try a different search or clear the filters.</p><button id="reset" class="button">Clear filters</button></div>
<div class="bottom-note"><span>01 / KNOW WHAT YOU INSTALL</span><p>Checks verify structure and ownership. Plugins run with your user permissions. Review the code before you install.</p><a href="{url('security/')}">Understand the checks ↗</a></div>'''
    write('index.html', shell('Browse', content))
    for record in latest:
        history = sorted([r for r in grouped[record['package']] if r['status'] == 'checked'], key=version_key, reverse=True)
        source = 'https://github.com/' + record['repository']
        revision_url = source + '/tree/' + record['commit'] + ('/' + quote(record['path']) if record['path'] else '')
        release_rows = ''.join(f'<tr><td>v{esc(r["version"])}</td><td><a href="{source}/commit/{r["commit"]}"><code>{r["commit"][:12]}</code></a></td><td>{esc(r["publisher"])}</td><td><a href="{esc(r["receipt"])}">Receipt ↗</a></td></tr>' for r in history)
        warnings = ''.join(f'<li>{esc(w)}</li>' for w in record['warnings'])
        details = f'''<a class="back" href="{url()}">← All plugins</a><div class="detail-heading"><div><div class="eyebrow">{esc(record['package'])}</div><h1>{esc(record['name'])}</h1><p>{esc(record['description'])}</p></div>{badge(record)}</div><div class="detail-grid"><section><div class="section-heading"><h2>Inspect this version</h2><span>v{esc(record['version'])}</span></div><p>This link opens the exact source snapshot listed here.</p><a class="button primary" href="{esc(revision_url)}">Review source at {record['commit'][:7]} ↗</a><div class="commit-box"><label for="commit">COMMIT SHA</label><code id="commit">{record['commit']}</code><button type="button" data-copy="{record['commit']}">Copy SHA</button></div><p class="muted">Installation is not pinned by the standard marketplace command. Review the source and upstream installation instructions before running anything.</p><div class="section-heading"><h2>Release history</h2><span>{len(history)} registry releases</span></div>{'<div class="table-wrap"><table><thead><tr><th>Version</th><th>Commit</th><th>Publisher</th><th>Evidence</th></tr></thead><tbody>' + release_rows + '</tbody></table></div>' if history else '<p>This is a discovery listing. Its maintainer has not published a release to this registry yet.</p>'}<div class="section-heading"><h2>Check details</h2></div><p>{'Ownership, manifest, declared entry points, repository identity, size limits, symlinks, and version immutability checked at this commit.' if record['status'] == 'checked' else 'Imported from the public repository manifest. No registry verification or security review is claimed.'}</p>{'<ul class="warnings">' + warnings + '</ul>' if warnings else ''}<p class="muted">No runtime tests or full dependency audit have been performed. Entry-point risk hints cannot detect every dangerous behavior.</p></section><aside class="package-facts"><h2>Package information</h2><dl><dt>Author</dt><dd>{esc(record['author'])}</dd><dt>Repository owner</dt><dd>{esc(record['repository'].split('/')[0])}</dd><dt>License</dt><dd>{esc(record['license'])}</dd><dt>Plugin ID</dt><dd>{esc(record['id'])}</dd><dt>GitHub stars · snapshot</dt><dd>{record['stars']}</dd><dt>Repository created</dt><dd>{esc(record['repositoryCreatedAt'][:10])}</dd><dt>Downloads / installations</dt><dd>Not measured</dd></dl><a href="{source}">Repository & maintainer history ↗</a><a href="{source}/security/advisories">Upstream security advisories ↗</a><a href="{source}/network/dependencies">Dependency graph ↗</a><a href="{url('publish/')}">Publish an update ↗</a></aside></div>'''
        write('packages/' + slug(record) + '/index.html', shell(record['name'], details))
    activity = sorted([r for r in records if r['status'] == 'checked'], key=lambda r: r['publishedAt'], reverse=True)
    items = ''.join(f'<a class="activity-row" href="{esc(r["receipt"])}"><div><h2>{esc(r["name"])} <span class="version">v{esc(r["version"])}</span></h2><p>{esc(r["publisher"])} · {esc(r["publishedAt"][:10])} · <code>{r["commit"][:12]}</code></p></div><span>View receipt ↗</span></a>' for r in activity)
    write('activity/index.html', shell('Release activity', '<div class="eyebrow">THE PUBLIC RECORD / 02</div><h1>Releases, in the open.</h1><p>Every accepted version has a source commit and a public publication receipt.</p><div class="activity-list">' + (items or '<div class="empty-card"><h2>No registry releases yet.</h2><p>Discovery listings are available to browse. The first accepted publication will appear here.</p><a class="button" href="' + url('publish/') + '">Publish a plugin ↗</a></div>') + '</div>', 'activity'))
    for page in ('publish', 'security'):
        content = (ROOT / 'site' / (page + '.html')).read_text().replace('{{BASE}}', BASE)
        write(page + '/index.html', shell(page.title(), content, page))
        (OUT / (page + '.html')).unlink(missing_ok=True)
    write('registry.json', json.dumps({'schemaVersion': 1, 'plugins': latest, 'releases': activity}, separators=(',', ':')))
    write('404.html', shell('Not found', '<h1>Plugin not found.</h1><p>This address may have moved or the listing may have been suspended.</p><a href="' + url() + '">Browse plugins →</a>'))
    print(f'Built {len(latest)} plugin pages and {len(activity)} release receipts.')


if __name__ == '__main__':
    build()
