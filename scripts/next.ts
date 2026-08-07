#!/usr/bin/env node
// `next` — from the heart, 5. Two modes, one law: the binary decides.
//
//   npm run next "<message>"   a message is computed on the honesty gate. If it computes
//                              TRUE (binary 1) it STAYS; if FALSE (0) it is drained.
//                              Retrieval/answering is VitePress local search's job — next
//                              only adjudicates whether the message may stay.
//
//   npm run next               no message: understand what is truly next. Content-address the
//                              working tree; if it matches the latest release the work is WHOLE
//                              → rest (holding cracks nothing). A real delta → ship it.
//
// Not blind iteration — understanding, then the binary.
import { execSync } from 'node:child_process'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { toUuid, merkleFold } from '../src/0/index.ts'
import { computes } from './honesty-gate.ts'

const message = process.argv.slice(2).join(' ').trim()

// ── message mode: the binary decides whether it stays ──────────────────────────
if (message) {
  const { binary, hit } = computes(message)
  const addr = toUuid('message:' + message)
  console.log('next — message: "' + message + '"')
  console.log('  content-address: ' + addr)
  if (binary === 1) {
    console.log('  computes TRUE (1) — it STAYS. (answering is VitePress local search\'s job.)')
    process.exit(0)
  }
  console.log('  computes FALSE (0) — DRAINED. tripped the honesty gate: "' + hit + '"')
  console.log('  it does not stay. reword to the honest floor (0/7) and it will.')
  process.exit(1)
}

// ── no-message mode: understand what is truly next ─────────────────────────────
const SKIP = new Set(['node_modules', '.git', 'cache', 'dist'])
const walk = (d: string, a: string[] = []): string[] => { for (const n of readdirSync(d)) { const p = join(d, n); if (statSync(p).isDirectory()) { if (!SKIP.has(n)) walk(p, a) } else a.push(p) } return a }
const address = merkleFold(walk('.').sort().map((f) => toUuid(f + ':' + readFileSync(f))))

let lastAddr = '', lastTag = ''
try {
  lastTag = execSync('git tag --sort=version:refname', { encoding: 'utf8' }).trim().split('\n').filter(Boolean).pop() || ''
  if (lastTag) { const msg = execSync("git for-each-ref '--format=%(contents)' refs/tags/" + lastTag, { encoding: 'utf8' }); lastAddr = (msg.match(/content-address ([0-9a-f-]+)/) || [])[1] || '' }
} catch { /* no repo/tags */ }

if (address === lastAddr) {
  console.log('next — from the heart (5): the work is WHOLE.')
  console.log('  content-address unchanged since ' + lastTag + ' (' + address.slice(0, 13) + '…).')
  console.log('  nothing is truly next. at rest — holding cracks nothing. 0/7.')
  process.exit(0)
}
console.log('next — a real delta is present (' + address.slice(0, 13) + '… ≠ ' + lastTag + '). shipping the truly-next:')
execSync('npm run orchestrate', { stdio: 'inherit' })
execSync('npm run deploy:pages', { stdio: 'inherit' })
