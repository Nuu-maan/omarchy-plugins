import { createRootRoute, HeadContent, Link, Outlet, Scripts } from '@tanstack/react-router'
import { ArrowUpRight, Blocks, SquareTerminal } from 'lucide-react'
import '@fontsource-variable/jetbrains-mono'
import '@fontsource/silkscreen/700.css'
import { ThemePicker } from '../components/theme-picker'
import { repositoryUrl } from '../lib/catalog'
import '../styles.css'

const themeScript = `try{const t=localStorage.getItem('registry-theme');if(['matte','tokyo','jade','white'].includes(t))document.documentElement.dataset.theme=t}catch{}`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Omarchy Plugins — Community registry' },
      { name: 'description', content: 'Find your next Omarchy plugin. Inspect exact source commits and publish updates with automated checks.' },
    ],
    links: [{ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
  }),
  component: Root,
  notFoundComponent: () => <section className="page-intro"><p className="eyebrow">404 / not found</p><h1>Nothing at this address.</h1><p>The plugin may have moved or been suspended.</p><Link className="button primary" to="/" search={{ q: '', kind: '', checked: false, sort: 'name' }}>Browse plugins</Link></section>,
  errorComponent: ({ reset }) => <section className="page-intro"><h1>Unable to load this page.</h1><p>Try again, or return to the catalogue.</p><button className="button" onClick={reset}>Try again</button><a className="text-link" href="/">Browse plugins</a></section>,
})

function Root() {
  return <html lang="en" data-theme="matte" suppressHydrationWarning>
    <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /><HeadContent /></head>
    <body>
      <a href="#main" className="skip-link">Skip to content</a>
      <header className="site-header"><div className="header-inner">
        <Link to="/" search={{ q: '', kind: '', checked: false, sort: 'name' }} className="brand" aria-label="Omarchy Plugins home"><Blocks size={23} aria-hidden="true" /><span>omarchy<span className="brand-suffix"> / plugins</span></span></Link>
        <nav aria-label="Main navigation">
          <Link to="/" search={{ q: '', kind: '', checked: false, sort: 'name' }} activeOptions={{ exact: true }} activeProps={{ 'aria-current': 'page' }}>Discover</Link>
          <Link to="/activity" activeProps={{ 'aria-current': 'page' }}>Releases</Link>
          <Link to="/review">Review queue</Link><Link to="/security" activeProps={{ 'aria-current': 'page' }}>Trust</Link>
        </nav>
        <div className="header-actions"><ThemePicker /><a href={repositoryUrl} className="icon-button github-link" aria-label="Registry on GitHub"><SquareTerminal size={19} aria-hidden="true" /></a><Link to="/publish" search={{ repository: '', path: '' }} className="button primary header-publish">Publish <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
      </div></header>
      <main id="main" className="site-main" tabIndex={-1}><Outlet /></main>
      <footer className="site-footer"><div className="footer-top"><Link to="/" search={{ q: '', kind: '', checked: false, sort: 'name' }} className="brand"><Blocks size={21} aria-hidden="true" />omarchy / plugins</Link><span>Built by the community. Open to everyone.</span></div><div className="footer-bottom"><p>Independent registry. Not affiliated with Omarchy.</p><div><a href="/registry.json">Registry JSON</a><a href={repositoryUrl}>Source</a><Link to="/security">Security</Link><a href="https://omarchy.org/">Omarchy ↗</a></div></div></footer>
      <Scripts />
    </body>
  </html>
}
