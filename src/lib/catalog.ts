import snapshot from '../../public/registry.json' with { type: 'json' }

export type Plugin = {
  package: string
  repository: string
  repositoryId: number
  path: string
  commit: string
  id: string
  name: string
  description: string
  author: string
  license: string
  version: string
  kinds: string[]
  stars: number
  forks: number
  repositoryCreatedAt: string
  status: 'checked' | 'discovered'
  publishedAt: string | null
  importedAt?: string
  publisher: string | null
  warnings: string[]
  slug: string
  receipt?: string
  manifestSha256?: string
}

export const registry = snapshot as { schemaVersion: number; plugins: Plugin[]; releases: Plugin[] }
export const repositoryUrl = 'https://github.com/Nuu-maan/omarchy-plugins'
export const kinds = [
  { value: '', label: 'All plugins' },
  { value: 'bar-widget', label: 'Bar widgets' },
  { value: 'panel', label: 'Panels' },
  { value: 'service', label: 'Services' },
] as const

export function filterPlugins(plugins: Plugin[], query: string, kind: string, checked: boolean, sort: string): Plugin[] {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  return plugins.filter(plugin => {
    const text = [plugin.name, plugin.description, plugin.repository, plugin.id, ...plugin.kinds].join(' ').toLowerCase()
    return words.every(word => text.includes(word)) && (!kind || plugin.kinds.includes(kind)) && (!checked || plugin.status === 'checked')
  }).sort((a, b) => {
    if (sort === 'stars') return b.stars - a.stars || a.name.localeCompare(b.name)
    if (sort === 'recent') return (b.publishedAt || b.importedAt || '').localeCompare(a.publishedAt || a.importedAt || '')
    return a.name.localeCompare(b.name)
  })
}

export function sourceUrl(plugin: Plugin): string {
  return `https://github.com/${plugin.repository}/tree/${plugin.commit}${plugin.path ? '/' + plugin.path.split('/').map(encodeURIComponent).join('/') : ''}`
}

export function displayDate(value: string | null | undefined): string {
  if (!value) return 'Not published'
  return new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(value))
}

export function submissionUrl(repository: string, commit: string, path: string): string {
  if (!/^[A-Za-z0-9][A-Za-z0-9-]{0,38}\/[A-Za-z0-9_.-]{1,100}$/.test(repository) || ['.', '..'].includes(repository.split('/')[1])) {
    throw new Error('Use owner/repository without a URL.')
  }
  if (!/^[a-f0-9]{40}$/.test(commit)) throw new Error('Use the full 40-character lowercase commit SHA.')
  if (path.length > 200 || (path && (!/^[A-Za-z0-9_. /-]+$/.test(path) || path.split('/').some(part => ['', '.', '..'].includes(part))))) {
    throw new Error('Use a relative directory without . or .. segments.')
  }
  const body = '### Release\n```json\n' + JSON.stringify({ repository, commit, path }, null, 2) + '\n```'
  return `${repositoryUrl}/issues/new?${new URLSearchParams({ title: `Publish: ${repository}`, labels: 'publish', body })}`
}
