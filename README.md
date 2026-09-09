# Omarchy Plugins

An independent community directory for Omarchy plugins. Built with TanStack Start, React, and a public GitHub review ledger. Catalogue pages are prerendered and served from a CDN; searching and filtering do not call an API.

## Develop

Use Node.js 24+, Python 3.12+, and Qt 6 `qmllint` (`qt6-declarative-dev-tools` on Ubuntu).

```sh
npm ci
npm run dev
npm run build
npm test
```

The checked-in discovery catalogue lets the site build without credentials. `python3 scripts/publish.py` reads public live records before building. `GH_TOKEN` is optional for reads and increases the GitHub rate allowance.

## Submit and review

Paste a public GitHub repository URL on `/publish`, then confirm the prefilled request on GitHub. The scanner resolves the commit, validates its manifest and referenced entry points, parses QML, and records capability evidence. A new submission is **PENDING REVIEW**, never automatically verified.

The public `/review` queue prioritizes changed trust signals. Configured reviewers inspect source, manifest and evidence on plugin pages, complete the checklist, and submit a decision through their GitHub account. Numeric reviewer IDs are checked again in the writer job. Review records bind the exact SHA, version, scan, reviewer, timestamp and notes.

Updates are monitored on a 15-minute schedule, subject to GitHub Actions scheduling delays. A new commit never inherits verification. Reports request a rescan and human moderation; revocation remains visible with a reason and optional advisory recommendation.

See [PUBLISHING.md](PUBLISHING.md), [SECURITY.md](SECURITY.md), and [ARCHITECTURE.md](ARCHITECTURE.md).

## Deployment

Vercel builds with `python3 scripts/publish.py && npm run build` and serves `dist/client`. Connect the repository and configure a main-branch deploy hook as the GitHub secret `REGISTRY_DEPLOY_HOOK`. The publication workflow requests a deployment after processing the queue. No hosting token is exposed to submitted code.

This project is not affiliated with the official Omarchy project. Original plugin authors retain credit and their own licenses.
