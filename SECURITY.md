# Security and trust

Verified means the specified commit was reviewed according to this registry's checklist. It does not guarantee safety or apply to future code. Omarchy plugins run with the user's permissions.

Automated security analysis is not a guarantee that a plugin is safe. Static patterns inspect bounded QML, JavaScript, TypeScript, shell, Python and JSON sources, reporting file/line evidence for network, process, shell, filesystem, environment, download, credential and obfuscation signals. Patterns can miss indirect behavior and flag harmless text. “No match” is not proof that a capability is absent. Dependencies and unsupported languages require manual inspection.

QML is parsed with the system Qt tool in a temporary directory containing only source text. No submitted plugin, script, build step, dependency installer or native module is executed. Missing Omarchy imports produce diagnostic counts, not false claims of runtime compatibility. Scans run in a read-only job without publication or deployment credentials. The writer runs separately and checks current issue identity and reviewer authorization before recording decisions.

Reports trigger rescanning and moderation. Reviewers can revoke a recorded commit with a reason and advisory recommendation to disable/remove it. Historical decisions and revoked snapshots remain visible. Registry revocation does not uninstall software.

Report registry vulnerabilities using GitHub private vulnerability reporting. Do not put credentials or exploit details in a public issue. Repository popularity, stars, author age and download counts are not verification signals. Downloads are not measured here.

GitHub bot comments form a public append-only application ledger; the application never edits its past decisions. GitHub administrators can still delete comments, so this is not a cryptographically immutable log. Preserve records you rely on.
