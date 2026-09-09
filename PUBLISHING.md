# Submission and review

Use the site's Submit Plugin form. Anyone can suggest a public repository; this does not claim repository ownership. The manifest is the source of metadata. An optional directory selects a plugin inside a larger repository.

Equivalent issue body, with the `publish` label:

```json
{"repository":"https://github.com/owner/plugin","path":""}
```

An optional full `commit` SHA selects a particular revision. Otherwise the scanner resolves the default branch. The original schema-1 manifest must declare ID, name, description, author, license, version, kinds and valid QML entry points. Include a README and license file. Symlinks, submodules, oversized trees and incomplete scans require changes.

## States

- **PENDING REVIEW:** received and awaiting human inspection; no verification.
- **APPROVED:** a configured reviewer approved this exact commit and scan.
- **REJECTED:** reviewer declined the submitted commit; see public reason.
- **CHANGES REQUESTED:** resolve validation errors or reviewer feedback and resubmit.
- **REVIEW REQUIRED:** code or trust signals changed; earlier approval does not cover the current state.
- **REVOKED:** the affected commit is withdrawn with a public reason; it remains in history.

Reviewer actions are prefilled by plugin pages, then submitted on GitHub. Approval requires every checklist item, a note and the current scan digest. Only numeric accounts in `data/reviewers.json` can moderate. Changes to that file require a PR.

Reports use the plugin page's report form. Reports are public; use GitHub private vulnerability reporting for details that should not be disclosed publicly. A single report never automatically revokes a plugin.

The request issue closes when its event is recorded, not when human verification is granted. The public queue shows review status independently of GitHub issue closure. Correct a validation failure and reopen the request to retry. No response-time guarantee is made for human review.
