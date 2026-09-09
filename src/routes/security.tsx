import { createFileRoute } from '@tanstack/react-router'
import { Shield } from 'lucide-react'
import { StatusBadge } from '../components/status-badge'
import { repositoryUrl } from '../lib/catalog'

export const Route = createFileRoute('/security')({
  head: () => ({ meta: [{ title: 'Trust & security — Omarchy Plugins' }] }),
  component: Security,
})

function Security() {
  return <>
    <section className="page-intro"><p className="eyebrow">Trust & security</p><h1>Trust starts with evidence.</h1><p>A check should tell you exactly what it checked. Here’s what the labels mean, what they miss, and how to inspect a plugin yourself.</p></section>
    <div className="prose"><div className="notice"><Shield size={22} aria-hidden="true" /><p>Omarchy plugins run unsandboxed with your user permissions. Automated checks do not establish that code is safe.</p></div>
      <h2>Two labels. Different meanings.</h2><p><StatusBadge status="discovered" /></p><p>Metadata read from a public repository. Its maintainer has not published a checked release here.</p><p><StatusBadge status="checked" /></p><p>Ownership or write-access proof, manifest structure, declared entry-point files, size limits, symlink and submodule restrictions, repository identity, and version integrity passed at the listed commit.</p>
      <h2>What a check can’t tell you</h2><p>The registry does not execute submitted code or test it against your installed shell. Limited entry-point hints can flag process execution and network access; they cannot detect every dangerous behavior.</p><p>Dependencies, shell scripts, downloaded code, and QML imports need separate review. A passing npm audit applies to its npm dependency tree, not the rest of a plugin.</p>
      <h2>Inspect the supply chain</h2><ul><li>Read the exact commit and compare it with the version you use.</li><li>Check upstream security advisories and the dependency graph.</li><li>Review maintainer history and unexpected ownership changes.</li><li>Check ecosystem-specific dependency audits where they apply.</li></ul><p>Stars and repository age provide context. They are not safety scores. Downloads and installations are not measured; copying a command is not a download.</p>
      <h2>Versions stay tied to their commits</h2><p>A published version cannot be reassigned to another SHA. Its receipt records the publisher, repository identity, commit, manifest digest, warnings, and publication time.</p><p>GitHub comments form the public ledger. They are not a cryptographically immutable log: privileged administrators can remove them. Keep copies of receipts you rely on.</p>
      <h2>Know what you install</h2><p>The standard Omarchy marketplace command follows upstream code and may not install the commit shown here. This registry links to the recorded snapshot. Inspect that source and the upstream installation instructions before proceeding.</p>
      <h2>Report a concern</h2><p><a href={`${repositoryUrl}/security/advisories/new`}>Report privately on GitHub ↗</a>. Administrators can suspend a repository through a reviewed blocklist change. The next deployment removes its listings; it cannot remove software already installed on your computer.</p>
    </div>
  </>
}
