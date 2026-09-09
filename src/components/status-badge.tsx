import { BadgeCheck, CircleDashed } from 'lucide-react'
import type { Plugin } from '../lib/catalog'

export function StatusBadge({ status }: { status: Plugin['status'] }) {
  const checked = status === 'checked'
  const Icon = checked ? BadgeCheck : CircleDashed
  return <span className={`status-badge ${checked ? 'status-checked' : ''}`}>
    <Icon size={14} aria-hidden="true" />{checked ? 'Checks passed' : 'Unverified'}
  </span>
}
