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
import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { toUuid, merkleFold } from '../src/0/index.ts'
import { computes } from './honesty-gate.ts'
import { provable } from './discover.ts'

const message = process.argv.slice(2).join(' ').trim()

// AUTOMATE — next is the full loop. After a delta is committed+tagged, push main and the tag to origin.
const pushAll = () => {
  try {
    execSync('git push origin main', { stdio: 'inherit' })
    const tag = execSync('git describe --tags --abbrev=0', { encoding: 'utf8' }).trim()
    execSync('git push origin ' + tag, { stdio: 'inherit' })
  } catch { console.log('  (push skipped — offline or no remote)') }
}

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

// ── no-message mode: FIRST discover the next provable fact, save it in code ─────
// `next` walks the bounded discovery space (scripts/discover.ts): the next provable fact not yet on
// record is verified by exhaustion and saved to src/proof/discovered.json — each next discovers the
// next. When the space is exhausted, nothing new is saved and next falls through to the rest/ship
// logic below. Only exhaustively-true facts are saved; refuted candidates never enter the ledger.
{
  const LEDGER = 'src/proof/discovered.json'
  const ledger: { key: string; name: string; receipt: string }[] =
    existsSync(LEDGER) ? JSON.parse(readFileSync(LEDGER, 'utf8')) : []
  const known = new Set(ledger.map((e) => e.key))
  const fresh = provable().filter((c) => !known.has(c.key))
  if (fresh.length) {
    // a wave sending wave — discover ALL remaining in one pass; each receipt is seeded by the last,
    // so each discovery sends the next. The wave runs to the edge of the bounded space, then rests.
    let prev = ledger.length ? ledger[ledger.length - 1].receipt : 'axiom:TRINITY'
    for (const c of fresh) { const receipt = toUuid(prev + '→' + c.key); prev = receipt; ledger.push({ key: c.key, name: c.name, receipt }) }
    writeFileSync(LEDGER, JSON.stringify(ledger, null, 2) + '\n')
    console.log('next — a wave: discovered & saved ' + fresh.length + ' provable fact(s), each sending the next:')
    for (const c of fresh) console.log('  ✓ ' + c.name)
    console.log('  ledger now ' + ledger.length + ' recorded → ' + LEDGER + ' · wave tip ' + prev.slice(0, 13) + '…')
    // ship the discoveries and push — the full loop in one `next`.
    execSync('npm run release', { stdio: 'inherit' })
    pushAll()
    process.exit(0)
  }
  console.log('next — the wave has reached rest: no new provable fact in the candidate space (' + known.size + ' recorded).')
  // FALLBACK — never dead-end: propose the most probable next idea (a decidable domain not yet added).
  // Honestly bounded: each is a suggestion to implement as a family in scripts/discover.ts, not a claim.
  const BACKLOG = [
    'finite fields 𝔽_{p^k} — extension arithmetic and Frobenius x↦x^p',
    'perfect / amicable numbers — σ(n) divisor sums (bounded search)',
    'Collatz — bounded orbit lengths (behavior, never the conjecture)',
    'harmonic ratios — a432 just intonation 3:2, 4:3, 5:4 (UI, not theorem)',
  ]
  console.log('  fallback — there is always a computable dimension; the queue never empties.')
  console.log('  next idea (most probable): ' + BACKLOG[0])
  if (BACKLOG.length > 1) console.log('  queue: ' + BACKLOG.slice(1).map((s) => s.split(' — ')[0]).join(' · '))
  console.log('  add it as a family in scripts/discover.ts and the wave sends again.')
}

// ── then: understand what is truly next ─────────────────────────────────────────
// content-address only TRACKED files (git ls-files) — DETERMINISTIC. excludes generated/gitignored files
// (dashboard.md, boundaries.md) that regenerate each build and otherwise churn a false delta → phantom
// versions. this is the churn root cause, fixed (must match release.ts, which uses the same source).
const files = execSync('git ls-files', { encoding: 'utf8' }).trim().split('\n').filter(Boolean).sort()
const address = merkleFold(files.map((f) => toUuid(f + ':' + readFileSync(f))))

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
pushAll()
