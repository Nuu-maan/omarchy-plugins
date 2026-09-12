# Omachest

**Community plugins for Omarchy. Submit once. Keep building.**

[Browse plugins](https://omachests.com) · [Submit a plugin](https://omachests.com/publish) · [Review queue](https://omachests.com/review) · [Trust policy](SECURITY.md)

Omachest is an independent plugin directory with fast, prerendered pages and a public review history. It uses the existing Omarchy plugin format and GitHub repositories as the source of truth.

## Submit a plugin

1. Push your plugin to a public GitHub repository with a valid `manifest.json`, README, license and declared QML entry points.
2. Open **Submit a plugin** and paste the repository URL. If your plugin lives in a subdirectory, expand the optional directory field.
3. Continue to GitHub, sign in and submit the prefilled issue.

That is all the author needs to submit. You do not upload a ZIP, fork this registry, or open a pull request. The scanner resolves the exact commit and reads the plugin's name, author, description, version and kinds from its manifest.

The request receives automated validation results and enters **Pending review**. A successful scan is not human approval. Follow the request issue for errors and the plugin page for review status. A closed request means processing finished; it does not mean the plugin was verified.

## Update a plugin

Push changes to the same repository. For a release, bump the version in `manifest.json` and include release notes in GitHub Releases.

The monitor checks listed repositories every 15 minutes, subject to GitHub Actions scheduling delays. It detects new commits, scans the new source, and refreshes the directory. You do not need a registry PR. To request a scan sooner, submit the same repository link again.

**Verification belongs to an exact commit.** A new commit is unverified until reviewed. Previous approvals and version history remain available. Omachest updates its directory; it does not update software already installed on your computer.

## Who does what?

| Work | Responsible |
| --- | --- |
| Resolve repository and commit; validate manifest and QML | Automated scanner |
| Show capability evidence, changed files and upstream changes | Automated scanner and site |
| Detect updates and refresh the directory | Scheduled workflow and Vercel |
| Inspect actual code and grant verification | A configured human reviewer |
| Investigate reports; request changes or revoke a commit | A configured human reviewer |
| Change the registry code or reviewer list | Maintainer, through a pull request |

**Nuu-maan is the initial reviewer.** To approve a plugin, open its page from the review queue, inspect the source and scan findings, select **Review this plugin** near the top of the page, complete the checklist and enter a review note. Submit the prefilled review request on GitHub. The writer verifies your numeric GitHub identity and records your decision automatically. There is no plugin PR to merge.

Additional trusted reviewers can be added to `data/reviewers.json` through a PR. Until someone performs a human review, the plugin remains unverified. Automated scans are not a guarantee of safety, and neither popularity nor repository age grants verification.

## Reports and revocations

Every plugin page has a **Report this plugin** form. Reports trigger a rescan and moderation review; they do not automatically remove a plugin. Use private GitHub vulnerability reporting for sensitive security details.

Reviewers can approve, reject, request changes, flag or revoke an exact commit. Revocations retain their reason, reviewer, date, affected version and optional advisory recommendation. Past review records remain visible.

## Run locally

Requirements: Node.js 24+, Python 3.12+, and Qt 6 `qmllint`. On Ubuntu, install `qt6-declarative-dev-tools`.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:3000`. The discovery catalogue builds without credentials. To include the public live ledger, run `python3 scripts/publish.py` first; an optional read-only `GH_TOKEN` increases the GitHub rate allowance.

```sh
npm run build
npm test
```

## Architecture and deployment

TanStack Start and React prerender the catalogue; Vercel serves `dist/client`. Search and filters run locally in the browser. GitHub provides authenticated requests and the public event ledger. The scanner runs with read-only permissions; a separate job rechecks identity before writing decisions. Submitted plugins and installation scripts are never executed.

Vercel builds with `python3 scripts/publish.py && npm run build`. A main-branch deploy hook stored as `REGISTRY_DEPLOY_HOOK` publishes ledger changes. Human review remains separate from deployment.

See [submission details](PUBLISHING.md), [security limits](SECURITY.md), and [architecture and capacity bounds](ARCHITECTURE.md). Known follow-ups are tracked in GitHub issues. Static scans do not establish runtime compatibility or cover every dependency and language.

Omachest is not affiliated with the official Omarchy project. Plugin authors retain their credit and licenses.

## Search visibility

Every public page is prerendered with its own title, description, canonical URL and social sharing metadata. `scripts/og.mjs` renders a 1200×630 social image per page at build time from the catalogue snapshot, so link previews show the plugin's name, description, author, kind and review status. The build generates [sitemap.xml](https://omachests.com/sitemap.xml) from the current catalogue; [robots.txt](https://omachests.com/robots.txt) points crawlers to it. Canonicals use the primary Omachest domain, including for filtered URLs and the older domain alias.

For indexing reports, verify the production URL in Google Search Console and submit the sitemap. Search engines decide when to crawl and index pages; a sitemap does not guarantee placement.
