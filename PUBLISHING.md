# Publishing

Open [a publication request](https://github.com/Nuu-maan/omarchy-plugins/issues/new?template=publish.yml) from your GitHub account. Use the same process for new plugins and updates.

```json
{"repository":"owner/repository","commit":"0123456789012345678901234567890123456789","path":""}
```

`commit` is a complete lowercase Git SHA. `path` is an optional plugin directory within the repository. Root plugins use an empty string. Each package is scoped as `@owner/repository[/path]`; display names and manifest IDs are not registry ownership claims.

## Requirements

- Public, active GitHub repository with at most 5,000 tree entries.
- Plugin subtree of at most 50 MB, with no symlinks or submodules.
- Schema version 1 manifest, namespaced non-reserved ID, name, description, author, license, and version.
- Version format `major.minor.patch` or `major.minor.patch-prerelease`.
- Supported kinds: `bar-widget`, `panel`, `overlay`, `menu`, `service`, `bar`.
- Every declared entry point is an existing QML file of at most 500 KB.
- README and license files in the selected plugin directory.

Suites without an individual plugin manifest are not supported. Submit each plugin subdirectory separately.

## Ownership

If you own the personal GitHub repository, open the request from that account. Other contributors and organization maintainers must first open an issue, then commit this file at the repository root as `.omarchy-registry.json`:

```json
{
  "registry": "Nuu-maan/omarchy-plugins",
  "publisher": "your-github-login",
  "issue": "https://github.com/Nuu-maan/omarchy-plugins/issues/123"
}
```

Use the exact login of the issue author and the actual submission issue URL. Update the issue body to the new commit containing the proof, then reopen it. A fork does not inherit the original repository's package namespace. Repository identity changes require administrator review.

## Updates and retries

Increase the manifest version, commit, and submit again. An accepted version cannot point to a different commit. Identical repeated requests are idempotent. Publishing an older version does not change the highest accepted version shown on the site.

Rejected submissions receive a reason. Correct the request and reopen it. API outages and rate limits leave requests open for retry. The workflow drains open submissions on new requests and on a 15-minute recovery schedule; GitHub can delay scheduled runs.

An acceptance receipt means checks passed. The catalogue changes after successful deployment. See [workflow runs](https://github.com/Nuu-maan/omarchy-plugins/actions) if the site has not updated.

## Command line

With Python and the GitHub CLI installed and authenticated:

```sh
python scripts/submit.py owner/repository FULL_COMMIT_SHA
python scripts/submit.py owner/repository FULL_COMMIT_SHA --path plugins/clock
```

The command opens a public submission under the authenticated account. It never pushes plugin code. Publication still runs the same server-side checks.
