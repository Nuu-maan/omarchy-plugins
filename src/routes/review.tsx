import { createFileRoute, Link } from '@tanstack/react-router'
import { registry } from '../lib/catalog'
import { StatusBadge } from '../components/status-badge'

export const Route = createFileRoute('/review')({ head: () => ({ meta: [{ title: 'Review queue — Omachest' }] }), component: Queue })
function Queue() {
  const plugins = registry.plugins.filter(plugin => plugin.status !== 'verified').sort((a, b) => (b.reports?.length || 0) - (a.reports?.length || 0) || Number(b.status === 'review-required') - Number(a.status === 'review-required') || (b.capabilityChanges?.length || 0) - (a.capabilityChanges?.length || 0))
  return <><section className="page-intro"><p className="eyebrow">Community review</p><h1>A clear path to verification.</h1><p>Inspect a plugin’s source and scan, then record your decision. Reports and plugins needing attention come first.</p></section>
    <div className="steps"><article><p className="eyebrow">01 / Inspect</p><h2>Read the exact source.</h2><p>Check the commit, capability evidence and any reported problems. A passing scan is not human approval.</p></article><article><p className="eyebrow">02 / Decide</p><h2>Review this plugin.</h2><p>Use the visible review form on its page. Approve, request changes, reject, flag or revoke with a reason.</p></article><article><p className="eyebrow">03 / Submit</p><h2>Finish on GitHub.</h2><p>Submit the prepared issue using an authorized reviewer account. The site updates automatically; no PR to merge.</p></article></div>
    <p>{plugins.length} plugins without current verification. Anyone can inspect them; only configured reviewers can record decisions.</p>
    <div className="queue-list">{plugins.length ? plugins.map(plugin => <article className="queue-item" key={plugin.slug}><div><h2><Link to="/packages/$slug" params={{ slug: plugin.slug }}>{plugin.name}</Link></h2><StatusBadge status={plugin.status} /><p>{plugin.reports?.length || 0} open reports · {plugin.scan?.validation === 'passed' ? 'Scan passed' : 'Passing scan needed'}</p>{Boolean(plugin.capabilityChanges?.length) && <p>New capabilities: {plugin.capabilityChanges?.join(', ')}</p>}</div><Link className="button" to="/packages/$slug" params={{ slug: plugin.slug }}>Inspect & review →</Link></article>) : <div className="empty-state"><h2>No reviews waiting.</h2><p>New submissions, updates and reports will appear here.</p></div>}</div>
  </>
}
