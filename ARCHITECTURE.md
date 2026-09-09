# Architecture

TanStack Start prerenders discovery, package, activity, review and submission routes. The browser filters a generated JSON snapshot. There is no request-time catalogue database or GitHub API call on page load.

GitHub provides authenticated submission issues and a public event ledger. `intake.py` validates queued inputs; `registry.py` validates pinned repository structure; `scan.py` gathers bounded static evidence and runs qmllint. `trust.py` authorizes human actions and projects trust state. `publish.py` monitors numeric repository identities and records events. `build.py` exports seeds plus the ledger for prerendering.

The scanner has read-only GitHub permissions and passes bounded proposals through a same-run artifact. The writer rechecks issue content and identity, validates human authorization and scan digest, then appends bot event comments. Request IDs make repeated processing idempotent. Reviewer IDs are versioned in the repository. No human approval is inferred from legacy automated receipts.

New upstream commits get fresh scans, including unchanged version numbers. Earlier approvals remain tied to earlier SHAs. A changed commit conservatively requires review, including changes that might be harmless. Transfer, archive, deletion and report events also require review. This conservative rule avoids calling unknown changes safe.

Monitoring events live in issue #11. Scheduled runs occur every 15 minutes when GitHub schedules them; they are not a real-time service-level guarantee. Unchanged upstream state does not create new ledger events. Hosting rebuilds publish the resulting snapshot.

## Bounds

Repository trees: 5,000 entries and 50 MB plugin scope. Source scans: 100 relevant files, 2 MB total, 500 KB per file and 200 findings. Requests: 20 per run. QML parsing: 15 seconds per file. GitHub reads: bounded pagination, response sizes and timeouts. Oversized inputs fail visibly instead of receiving partial verification.

The ledger currently scans up to 10,000 comments. Before admission grows beyond this ceiling, add indexed persistence and quotas (issue #2). Full dependency and installed-Omarchy compatibility checks remain separate work (issue #3). Do not run submitted code in the registry writer.
