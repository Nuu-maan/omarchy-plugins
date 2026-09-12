import { Link } from '@tanstack/react-router'
import { Activity, Archive, ArrowUpRight, BatteryMedium, Fan, LayoutDashboard, PanelTop, PanelsTopLeft, Puzzle, Shield, Star } from 'lucide-react'
import type { Plugin } from '../lib/catalog'
import { StatusBadge } from './status-badge'

function pluginIcon(name: string) {
  const value = name.toLowerCase()
  if (value.includes('widget')) return LayoutDashboard
  if (value.includes('coffer')) return Archive
  if (value.includes('overview')) return PanelsTopLeft
  if (value.includes('power')) return BatteryMedium
  if (value.includes('stats')) return Activity
  if (value.includes('fan')) return Fan
  if (value.includes('wireguard')) return Shield
  if (value.includes('bar')) return PanelTop
  return Puzzle
}

export function PluginCard({ plugin }: { plugin: Plugin }) {
  const Icon = pluginIcon(plugin.name)
  return <Link to="/packages/$slug" params={{ slug: plugin.slug }} className="plugin-card">
    <div className="card-top"><span className="plugin-symbol"><Icon size={28} strokeWidth={1.5} aria-hidden="true" /></span><StatusBadge status={plugin.status} /></div>
    <div className="card-title"><h3>{plugin.name}</h3><span className="version">v{plugin.version}</span></div>
    <p className="card-description">{plugin.description}</p>
    <div className="card-author"><span aria-hidden="true">@</span><bdi>{plugin.repository.split('/')[0]}</bdi><span className="card-stars" aria-label={`${plugin.stars} GitHub stars, snapshot`}><Star size={13} aria-hidden="true" />{plugin.stars}</span></div>
    <div className="card-bottom"><span>{(plugin.kinds[0] || 'plugin').replace('bar-widget', 'Bar widget').replace(/^./, character => character.toUpperCase())}</span><span className="card-link">View plugin <ArrowUpRight size={16} aria-hidden="true" /></span></div>
  </Link>
}
