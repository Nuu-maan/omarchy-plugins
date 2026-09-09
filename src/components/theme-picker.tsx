import { useEffect, useState } from 'react'
import { Palette } from 'lucide-react'

export function ThemePicker() {
  const [theme, setTheme] = useState('matte')
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme || 'matte')
  }, [])

  function changeTheme(value: string) {
    document.documentElement.dataset.theme = value
    setTheme(value)
    try { localStorage.setItem('registry-theme', value) } catch { /* Storage is optional in private browsing. */ }
  }

  return <label className="theme-picker">
    <Palette size={17} aria-hidden="true" />
    <span className="sr-only">Website theme</span>
    <select value={theme} onChange={event => changeTheme(event.target.value)}>
      <option value="matte">Matte Black</option>
      <option value="tokyo">Tokyo Night</option>
      <option value="jade">Osaka Jade</option>
      <option value="white">White</option>
    </select>
  </label>
}
