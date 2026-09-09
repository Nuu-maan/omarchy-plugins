import { createFileRoute, Link } from '@tanstack/react-router'
import { registry } from '../lib/catalog'
import { StatusBadge } from '../components/status-badge'

export const Route = createFileRoute('/review')({ head: () => ({ meta: [{ title: 'Review queue — Omarchy Plugins' }] }), component: Queue })
function Queue() {
  const plugins = registry.plugins.filter(plugin => plugin.status !== 'verified').sort((a, b) => Number(b.status === 'review-required') - Number(a.status === 'review-required') || (b.capabilityChanges?.length || 0) - (a.capabilityChanges?.length || 0))
  return <><section className="page-intro"><p className="eyebrow">Community review</p><h1>Every decision, in the open.</h1><p>Review-required plugins come first. Anyone can inspect the evidence; only configured reviewers can approve or moderate.</p></section><div className="table-scroll"><table><caption>Review and moderation queue</caption><thead><tr><th>Plugin</th><th>Status</th><th>Reports</th><th>New capabilities</th></tr></thead><tbody>{plugins.map(plugin => <tr key={plugin.slug}><td><Link to="/packages/$slug" params={{ slug: plugin.slug }}>{plugin.name}</Link></td><td><StatusBadge status={plugin.status} /></td><td>{plugin.reports?.length || 0}</td><td>{plugin.capabilityChanges?.join(', ') || 'None recorded'}</td></tr>)}</tbody></table></div></>
}
