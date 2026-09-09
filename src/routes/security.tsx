import { createFileRoute } from '@tanstack/react-router'
import { Shield } from 'lucide-react'
import { StatusBadge } from '../components/status-badge'
import { repositoryUrl } from '../lib/catalog'

export const Route = createFileRoute('/security')({
  head: () => ({ meta: [{ title: 'Trust & security — Omachest' }] }),
  component: Security,
})

function Security() {
  return <>
    <section className="page-intro"><p className="eyebrow">Trust & security</p><h1>Trust starts with evidence.</h1><p>A check should tell you exactly what it checked. Here’s what the labels mean, what they miss, and how to inspect a plugin yourself.</p></section>
    <div className="prose"><div className="notice"><Shield size={22} aria-hidden="true" /><p>Omarchy plugins run unsandboxed with your user permissions. Automated checks do not establish that code is safe.</p></div>
      <h2>Separate checks from human judgment.</h2><p><StatusBadge status="unverified" /></p><p>This exact commit has not received human approval. Automated scan results, where available, are separate.</p><p><StatusBadge status="verified" /></p><p>A configured reviewer approved this exact commit after inspecting its source, manifest, capability evidence, and checklist. Future commits do not inherit this approval.</p>
      <h2>What a check can’t tell you</h2><p>The registry does not execute submitted code or test it against your installed shell. Static source patterns flag process execution, network access, file access, downloads and other capabilities with file and line evidence. They cannot detect every dangerous behavior.</p><p>Dependencies, shell scripts, downloaded code, and QML imports need separate review. A passing npm audit applies to its npm dependency tree, not the rest of a plugin.</p>
      <h2>Inspect the supply chain</h2><ul><li>Read the exact commit and compare it with the version you use.</li><li>Check upstream security advisories and the dependency graph.</li><li>Review maintainer history and unexpected ownership changes.</li><li>Check ecosystem-specific dependency audits where they apply.</li></ul><p>Stars and repository age provide context. They are not safety scores. Downloads and installations are not measured; copying a command is not a download.</p>
      <h2>Versions stay tied to their commits</h2><p>Every scan records its version and exact SHA. Every human decision records the reviewer, timestamp, checklist, notes and scan. Changes remain separate snapshots even if upstream did not bump the version.</p><p>GitHub comments form the public ledger. They are not a cryptographically immutable log: privileged administrators can remove them. Keep copies of receipts you rely on.</p>
      <h2>Know what you install</h2><p>The standard Omarchy marketplace command follows upstream code and may not install the commit shown here. This registry links to the recorded snapshot. Inspect that source and the upstream installation instructions before proceeding.</p>
      <h2>Report a concern</h2><p><a href={`${repositoryUrl}/security/advisories/new`}>Report privately on GitHub ↗</a>. Use the report form on any plugin page for public reports. Reviewers can revoke affected commits with a reason and advisory recommendation. Revoked snapshots remain visible; the registry cannot remove software already installed on your computer.</p>
    </div>
  </>
}
