# Security policy

Report malicious plugins, compromised maintainers, or registry vulnerabilities through [private vulnerability reporting](https://github.com/Nuu-maan/omarchy-plugins/security/advisories/new). Do not post exploit details in a publication issue.

## Verification boundary

A checked record means structural validation and repository ownership/write-access proof passed at one Git commit. It does not mean code is safe or runtime-compatible. The registry never executes submitted code, installs dependencies, loads QML, follows arbitrary URLs, or extracts submitted archives.

GitHub API requests use a fixed origin. Inputs are constrained before URL construction. Responses, file sizes, tree size, and pagination are bounded. Plugin paths cannot traverse directories. The source commit is pinned; manifest content is additionally SHA-256 hashed. Repository IDs prevent silently replacing a deleted repository at the same name. The owner/repository/path namespace limits name squatting.

Limited pattern hints examine declared QML entry points only. They are not a security scanner. Transitive imports, shell commands, binary dependencies, and network-fetched code require independent review. GitHub advisories and dependency graphs are linked where available; absence of published advisories is not evidence of safety. npm audit only applies to supported npm dependency trees, not arbitrary plugin code.

## Privileges and ledger

Pull-request checks have read-only permissions and do not receive publishing privileges. Only the default-branch publication job can write receipt comments. Deployments use a separate Pages/OIDC job. Actions are pinned to commit SHAs and updated through dependency pull requests. No submitted repository is checked out.

The ledger accepts only comments posted by GitHub Actions' numeric bot identity in this registry. It is a public operational record, not a cryptographic transparency log. Registry administrators and compromised privileged workflows can mutate or remove comments. Version-to-commit immutability is enforced by the publisher while ledger records exist; it is not a tamper-proof external guarantee.

## Suspension

Add a lowercase `owner/repository` key and a public reason to `data/blocked.json` through a pull request. Deployment removes matching listings and rejects further submissions. Existing receipts remain in GitHub. This does not uninstall code from users' systems. Registry administrators should use private reports for sensitive details and the public reason only for disclosure-safe information.

## Installation and telemetry

This registry does not execute installations. The normal upstream Omarchy install command is mutable and may differ from a checked commit. Users must inspect source and installation instructions. No download, install, or user-tracking telemetry is collected by this project; GitHub processes its ordinary hosting and account request data.
