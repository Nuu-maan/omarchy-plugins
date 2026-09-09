import { BadgeCheck, CircleDashed } from 'lucide-react'
import type { Plugin } from '../lib/catalog'

export function StatusBadge({ status }: { status: Plugin['status'] }) {
  const Icon = status === 'verified' ? BadgeCheck : CircleDashed
  const labels = { verified: 'Verified', unverified: 'Unverified', 'review-required': 'Review required', revoked: 'Revoked' }
  return <span className={`status-badge ${status === 'verified' ? 'status-checked' : ''}`}><Icon size={14} aria-hidden="true" />{labels[status]}</span>
}
