import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowLeft, ArrowUpRight, BadgeCheck, ExternalLink } from 'lucide-react'
import { CopyButton } from '../components/copy-button'
import { StatusBadge } from '../components/status-badge'
import { displayDate, registry, sourceUrl } from '../lib/catalog'

export const Route = createFileRoute('/packages/$slug')({
  loader: ({ params }) => {
    const plugin = registry.plugins.find(plugin => plugin.slug === params.slug)
    if (!plugin) throw notFound()
    return { plugin, history: registry.releases.filter(release => release.package === plugin.package) }
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.plugin.name || 'Plugin'} — Omarchy Plugins` }, { name: 'description', content: loaderData?.plugin.description || 'Omarchy plugin details' }] }),
  component: Package,
})

function Package() {
  const { plugin, history } = Route.useLoaderData()
  const repository = `https://github.com/${plugin.repository}`
  return <>
    <Link to="/" className="back-link"><ArrowLeft size={15} aria-hidden="true" />All plugins</Link>
    <div className="package-heading"><div><p className="eyebrow"><bdi>{plugin.package}</bdi></p><h1>{plugin.name} <span className="version">v{plugin.version}</span></h1><p>{plugin.description}</p></div><StatusBadge status={plugin.status} /></div>
    <div className="package-columns"><div className="package-content">
      <div className="section-title"><h2>Start with the source</h2><span>Version {plugin.version}</span></div>
      <p>Read the code and installation instructions at this exact commit.</p>
      <a href={sourceUrl(plugin)} className="button primary">Inspect source <ArrowUpRight size={17} aria-hidden="true" /></a>
      <div className="commit-box"><span className="eyebrow">Source commit</span><code>{plugin.commit}</code><CopyButton value={plugin.commit} label="Copy commit SHA" /></div>
      <p>The standard Omarchy install command follows upstream code and may install a different commit. Check the repository’s instructions before installing.</p>
      <div className="section-title"><h2>Release history</h2><span>{history.length} {history.length === 1 ? 'release' : 'releases'}</span></div>
      {history.length ? <div className="table-scroll"><table><caption className="sr-only">Published versions of {plugin.name}</caption><thead><tr><th scope="col">Version</th><th scope="col">Published</th><th scope="col">Publisher</th><th scope="col">Record</th></tr></thead><tbody>{history.map(release => <tr key={release.version}><td>v{release.version}</td><td>{displayDate(release.publishedAt)}</td><td><bdi>{release.publisher}</bdi></td><td><a href={release.receipt} aria-label={`View receipt for version ${release.version}`}>Receipt ↗</a></td></tr>)}</tbody></table></div> : <p>This plugin is listed for discovery. Its maintainer hasn’t published a checked release to this registry yet.</p>}
      <div className="section-title"><h2>What was checked</h2></div>
      <div className="notice"><BadgeCheck size={20} aria-hidden="true" /><p>{plugin.status === 'checked' ? 'Ownership, manifest structure, declared files, repository identity, size limits, and version integrity passed at this commit.' : 'This listing comes from a public repository manifest. It has not passed this registry’s publication checks.'}</p></div>
      {plugin.warnings.length ? <ul className="warnings">{plugin.warnings.map(warning => <li key={warning}>{warning}</li>)}</ul> : null}
      <p>These checks do not include runtime testing or a full dependency audit. Plugins run with your user permissions. <Link to="/security" className="text-link">Read the verification policy</Link>.</p>
      {plugin.manifestSha256 ? <details className="digest-details"><summary>Manifest SHA-256 digest</summary><pre>{plugin.manifestSha256}</pre></details> : null}
    </div><aside className="package-facts"><h2>Package details</h2><dl><dt>Author</dt><dd><bdi>{plugin.author}</bdi></dd><dt>Repository owner</dt><dd><bdi>{plugin.repository.split('/')[0]}</bdi></dd><dt>Plugin ID</dt><dd><bdi>{plugin.id}</bdi></dd><dt>License</dt><dd>{plugin.license}</dd><dt>GitHub stars · snapshot</dt><dd>{plugin.stars}</dd><dt>Repository created</dt><dd>{displayDate(plugin.repositoryCreatedAt)}</dd><dt>Downloads / installations</dt><dd>Not measured</dd></dl>
      <a href={repository}>Repository & history <ExternalLink size={13} aria-hidden="true" /></a><a href={`${repository}/security/advisories`}>Security advisories <ExternalLink size={13} aria-hidden="true" /></a><a href={`${repository}/network/dependencies`}>Dependency graph <ExternalLink size={13} aria-hidden="true" /></a><Link to="/publish" search={{ repository: plugin.repository, path: plugin.path }}>Publish an update <ArrowUpRight size={14} aria-hidden="true" /></Link>
    </aside></div>
  </>
}
