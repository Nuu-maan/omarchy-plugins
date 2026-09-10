import { seo } from '../lib/seo'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowUpRight, GitCommitHorizontal } from 'lucide-react'
import { displayDate, registry } from '../lib/catalog'

export const Route = createFileRoute('/activity')({
  head: () => seo("/activity", "Omarchy plugin releases \u2014 Omachest", "Browse scanned Omarchy plugin releases, exact source commits and public publication receipts. Follow community plugin updates on Omachest."),
  component: Activity,
})

function Activity() {
  return <>
    <section className="page-intro"><p className="eyebrow">The public record</p><h1>Every release leaves a trail.</h1><p>Inspect scanned commits and their public records. Automated scans do not grant human verification.</p></section>
    <section className="release-list" aria-label="Published releases">
      {registry.releases.length ? registry.releases.map(release => <article className="release-row" key={`${release.package}@${release.commit}`}><time dateTime={release.publishedAt || undefined}>{displayDate(release.publishedAt)}</time><div><h2>{release.name} <span className="version">v{release.version}</span></h2><p><bdi>{release.publisher || 'Upstream monitor'}</bdi> · <code>{release.commit.slice(0, 12)}</code></p></div><a href={release.receipt} aria-label={`View ${release.name} ${release.version} publication receipt`}>View receipt <ArrowUpRight size={15} aria-hidden="true" /></a></article>) : <div className="empty-state"><GitCommitHorizontal size={32} aria-hidden="true" /><h2>The first release starts here.</h2><p>Publish a plugin to add its version and source commit to the public record.</p><Link to="/publish" search={{ repository: '', path: '' }} className="button">Publish a plugin <ArrowUpRight size={16} aria-hidden="true" /></Link></div>}
    </section>
  </>
}
