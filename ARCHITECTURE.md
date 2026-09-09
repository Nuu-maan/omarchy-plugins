# Architecture

The browser reads prebuilt HTML, CSS, and a small script from GitHub Pages. It makes no GitHub API requests for browsing or filtering. Each plugin has a static detail page, and `registry.json` exposes the current catalogue and accepted release history.

Publishing uses GitHub as the identity provider, queue, and public data store:

1. An issue with the `publish` label contains a repository, commit SHA, and optional path.
2. A default-branch workflow drains open requests in creation order.
3. The validator reads bounded Git objects over the GitHub API. It does not execute repository content.
4. Accepted releases get structured bot receipts; failures get actionable explanations.
5. The builder reads accepted receipts, applies the reviewed suspension list, and combines them with explicitly unverified discovery metadata.
6. An artifact deployment publishes the complete static catalogue. Failed deployments leave the previous site intact; later runs rebuild accepted releases from the ledger.

A workflow concurrency group serializes publishers. GitHub may replace a pending run, so each run drains the queue instead of relying on its triggering issue. A recovery schedule picks up missed requests and failed deployments. Scheduled execution is best effort, not a latency guarantee. There are no promises of second-level publication.

The package key is `@owner/repository[/path]`. Version identity is scoped to that key and pinned to a commit. GitHub repository IDs prevent deleted-name takeover. The highest accepted semantic version is the default; rejected versions cannot replace it. Historical receipts are exposed independently of the default version.

Discovery metadata is a dated snapshot, not a live star counter or a verification claim. Imports preserve actual manifest authors, including on forks. No code is copied from imported plugins.

## Operation

Enable GitHub Pages with the Actions build source and private vulnerability reporting. Create the `publish` issue label. Require the `test` pull-request check on `main`, disallow force pushes and deletion, and make changes through pull requests.

The workflow uses the built-in repository token. There is no application database, OAuth client secret, package installation, external backend deployment, or billing integration to provision.

Build locally with `BASE_PATH=/ python scripts/build.py` for a root-mounted preview. Production defaults to `/omarchy-plugins/`. `GH_TOKEN=... python scripts/publish.py` reads the live ledger; set `PROCESS_SUBMISSIONS=true` only when intending to publish and close requests. The generated `_records.json` is ignored by Git.

## Known scaling limits

Receipt collection is an O(n) scan with a hard limit of 10,000 comments. It fails rather than silently producing a partial catalogue. A publication batch handles at most 20 requests; overflow stays open for later runs. GitHub Actions minutes, API rate limits, and spam controls apply. At sustained volume, migrate the ledger and queue to a durable service with indexed reads and admission quotas. Preserve repository identity and immutable version constraints during that migration.

There is no artifact mirror, malware sandbox, automated transitive dependency audit, or installation telemetry. These are separate capabilities, not implied by a structural check badge. The initial implementation supports individual Quattro plugins, including subdirectories; it does not support suite-only manifests.
