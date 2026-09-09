import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, ArrowUpRight, BadgeCheck, Search, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { PluginCard } from '../components/plugin-card'
import { filterPlugins, kinds, registry } from '../lib/catalog'

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === 'string' ? search.q.slice(0, 200) : '',
    kind: typeof search.kind === 'string' && kinds.some(kind => kind.value === search.kind) ? search.kind : '',
    checked: search.checked === true,
    sort: search.sort === 'stars' || search.sort === 'recent' ? search.sort : 'name',
  }),
  component: Discover,
})

function Discover() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const input = useRef<HTMLInputElement>(null)
  const plugins = filterPlugins(registry.plugins, search.q, search.kind, search.checked, search.sort)
  const checkedCount = registry.plugins.filter(plugin => plugin.status === 'checked').length

  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      const target = event.target as HTMLElement
      if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey && !target.closest('input, textarea, select, [contenteditable]')) {
        event.preventDefault()
        input.current?.focus()
      }
    }
    window.addEventListener('keydown', shortcut)
    return () => window.removeEventListener('keydown', shortcut)
  }, [])

  function update(values: Partial<typeof search>) {
    void navigate({ search: previous => ({ ...previous, ...values }), replace: true, resetScroll: false })
  }

  function reset() {
    update({ q: '', kind: '', checked: false, sort: 'name' })
    input.current?.focus()
  }

  return <>
    <section className="hero" aria-labelledby="hero-title">
      <div className="pixel-field" aria-hidden="true">{Array.from({ length: 24 }, (_, index) => <i key={index} style={{ insetInlineStart: `${(index * 37) % 100}%`, top: `${(index * 23) % 95}%`, opacity: (index % 3 + 1) * 0.09 }} />)}</div>
      <p className="hero-kicker"><span className="status-dot" />An open registry for Omarchy</p>
      <h1 id="hero-title"><span className="sr-only">Omarchy </span><span className="pixel-title">Plugins</span></h1>
      <p className="hero-description">A little more possibility.<br className="mobile-break" /> A shell that feels like yours.</p>
      <div className="hero-links"><a href="#catalogue">Find your next plugin <ArrowRight size={16} aria-hidden="true" /></a><Link to="/publish">Share something you built <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
    </section>
    <section id="catalogue" className="catalogue" aria-labelledby="catalogue-title">
      <div className="catalogue-heading"><div><p className="eyebrow">The community toolbox</p><h2 id="catalogue-title">Small additions. Big difference.</h2></div><span className="catalogue-total">{registry.plugins.length} plugins <span>/</span> {checkedCount} checked</span></div>
      <form role="search" className="search-form" onSubmit={event => event.preventDefault()}>
        <label htmlFor="plugin-search" className="sr-only">Search plugins</label><Search size={20} aria-hidden="true" />
        <input ref={input} id="plugin-search" type="search" name="q" maxLength={200} autoComplete="off" placeholder="Search plugins, names, or maintainers…" value={search.q} onChange={event => update({ q: event.target.value })} />
        {search.q ? <button type="button" className="icon-button" aria-label="Clear search" onClick={() => { update({ q: '' }); input.current?.focus() }}><X size={17} aria-hidden="true" /></button> : <kbd aria-hidden="true">/</kbd>}
      </form>
      <div className="catalogue-controls"><div className="type-filters" role="group" aria-label="Plugin type">{kinds.map(kind => <button type="button" key={kind.value} aria-pressed={search.kind === kind.value} onClick={() => update({ kind: kind.value })}>{kind.label}</button>)}</div><label className="sort-control"><span className="sr-only">Sort plugins</span><select value={search.sort} onChange={event => update({ sort: event.target.value })}><option value="name">Name: A–Z</option><option value="recent">Recently listed</option><option value="stars">GitHub stars</option></select></label></div>
      <div className="results-summary"><p role="status">{plugins.length} {plugins.length === 1 ? 'plugin' : 'plugins'}{search.q ? ` matching “${search.q}”` : ' to make your own'}</p><label className="checked-filter"><input type="checkbox" checked={search.checked} onChange={event => update({ checked: event.target.checked })} /><BadgeCheck size={15} aria-hidden="true" />Checks passed only</label></div>
      {plugins.length ? <div className="plugin-grid">{plugins.map(plugin => <PluginCard key={plugin.package} plugin={plugin} />)}</div> : <div className="empty-state"><Search size={30} aria-hidden="true" /><h3>No plugins match{search.q ? ` “${search.q}”` : ' these filters'}.</h3><p>Try a different name or clear the filters.</p><button className="button" type="button" onClick={reset}>Clear filters</button></div>}
    </section>
    <section className="publishing-banner"><div><p className="eyebrow">Made something useful?</p><h2>Publish it. Keep it moving.</h2><p>Your code stays in your repository. New versions go through automated checks, with a public record of what changed.</p></div><Link to="/publish" className="button">Publish a plugin <ArrowUpRight size={17} aria-hidden="true" /></Link></section>
    <div className="trust-note"><BadgeCheck size={19} aria-hidden="true" /><p>Checks confirm ownership and structure. They aren’t a security audit. <Link to="/security">Know what you install <ArrowUpRight size={13} aria-hidden="true" /></Link></p></div>
  </>
}
