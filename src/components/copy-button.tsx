import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')
  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setState('copied')
    } catch {
      setState('failed')
    }
  }
  return <div className="copy-control">
    <button className="button subtle" type="button" onClick={copy}>
      <span className="copy-icons" data-copied={state === 'copied'}><Copy size={16} aria-hidden="true" /><Check size={16} aria-hidden="true" /></span>
      {state === 'copied' ? 'Copied' : label}
    </button>
    <span className="copy-message" role="status">{state === 'failed' ? 'Select the text above and copy it manually.' : state === 'copied' ? 'Copied to clipboard.' : ''}</span>
  </div>
}
