import { test } from 'node:test'
import assert from 'node:assert/strict'
import { submissionUrl, filterPlugins, registry } from '../src/lib/catalog.ts'

test('submissions use fixed GitHub origin and filters return matching records', () => {
  assert.throws(() => submissionUrl('https://evil.example/owner/repo'))
  assert.throws(() => submissionUrl('https://github.com/owner/repo?token=secret'))
  assert.match(submissionUrl('https://github.com/owner/repo'), /labels=publish/)
  assert.equal(filterPlugins(registry.plugins, 'impossible-search-000', '', false, 'name').length, 0)
  assert.ok(filterPlugins(registry.plugins, '', '', true, 'name').every(plugin => plugin.status === 'verified'))
})
