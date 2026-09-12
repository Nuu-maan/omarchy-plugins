import { seo } from '../lib/seo'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { submissionUrl } from '../lib/catalog'

export const Route = createFileRoute('/publish')({
  validateSearch: (search: Record<string, unknown>) => ({ repository: typeof search.repository === 'string' ? search.repository : '', path: typeof search.path === 'string' ? search.path : '' }),
  head: () => seo("/publish", "Submit an Omarchy plugin \u2014 Omachest", "Submit a public GitHub repository to Omachest. Get automated source checks, public review notes and automatic monitoring for plugin updates."),
  component: Publish,
})

function Publish() {
  const initial = Route.useSearch()
  const [repository, setRepository] = useState(initial.repository ? `https://github.com/${initial.repository}` : '')
  const [path, setPath] = useState(initial.path)
  const [error, setError] = useState('')
  return <><section className="page-intro"><p className="eyebrow">Built something useful?</p><h1>Submit your plugin.</h1><p>One repository link. We read the manifest, inspect the source, and put the exact commit in the review queue.</p></section>
    <div className="package-columns"><form className="submission-form" onSubmit={event => {
      event.preventDefault()
      try { window.location.assign(submissionUrl(repository.trim(), '', path.trim())) } catch (reason) { setError(reason instanceof Error ? reason.message : 'Check the repository URL.'); document.getElementById('repository')?.focus() }
    }}>
      <label htmlFor="repository">GitHub repository URL</label><input id="repository" type="url" required value={repository} placeholder="https://github.com/you/your-plugin" autoComplete="url" aria-invalid={Boolean(error)} aria-describedby={error ? 'submission-error' : 'submission-help'} onChange={event => { setRepository(event.target.value); setError('') }} />
      <p id="submission-help">Use a public repository with an Omarchy manifest.json. <a href="https://github.com/Nuu-maan/omarchy-plugins/blob/main/PUBLISHING.md#manifestjson">See an example manifest ↗</a></p>
      <details><summary>Plugin in a subdirectory?</summary><label htmlFor="path">Plugin directory</label><input id="path" value={path} onChange={event => setPath(event.target.value)} placeholder="plugins/weather" /></details>
      {error && <p id="submission-error" role="alert">{error}</p>}
      <button className="button primary" type="submit">Continue on GitHub <ArrowUpRight size={17} aria-hidden="true" /></button><p>Sign in and submit the prefilled issue on GitHub. This page does not submit until you confirm there.</p>
      <div className="notice"><p>Already listed? Push changes to your plugin repository. We check for new commits every 15 minutes, subject to GitHub scheduling delays. You can submit the same link again to request an earlier scan.</p></div>
      <p><a href="https://github.com/Nuu-maan/omarchy-plugins/issues?q=is%3Aissue+author%3A%40me">Track your submissions on GitHub ↗</a></p>
    </form><aside className="package-facts"><h2>What happens next</h2><ol><li>Repository and manifest checks</li><li>QML and capability analysis</li><li>Pending human review</li><li>Decision with public review notes</li></ol><p>Future commits get a new scan. Verification stays attached to the commit a reviewer approved.</p><p>Automated security analysis is not a guarantee that a plugin is safe.</p></aside></div></>
}
