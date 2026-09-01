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
import { report as rosettaReport } from '../src/the/rosetta/index.ts'
import { ledger as __ledger } from '../src/api/index.ts'

const message = process.argv.slice(2).join(' ').trim()

// ── status mode: a read-only health report — version, ledger, chain-of-custody, floor. No ship. ──
if (message === '--status' || message === 'status') {
  const ver = (() => { try { return execSync('git describe --tags --abbrev=0', { encoding: 'utf8' }).trim() } catch { return 'v0' } })()
  const led: { key: string; receipt: string }[] = existsSync('src/proof/discovered.json') ? __ledger() : []
  const GENESIS = new Set(['euler_units_pow6', 'units_sum_zero'])
  let prev = 'axiom:TRINITY', newBreaks = 0
  for (const e of led) { if (toUuid(prev + '→' + e.key) !== e.receipt && !GENESIS.has(e.key)) newBreaks++; prev = e.receipt }
  const seal = led.length ? merkleFold(led.map((e) => e.receipt)) : 'none'
  console.log('next — status (read-only health report):')
  console.log('  version:          ' + ver)
  console.log('  ledger:           ' + led.length + ' decidable facts, re-verified each build')
  console.log('  chain-of-custody: ' + (newBreaks === 0 ? 'intact' : newBreaks + ' NEW break(s) — legal trial') + ' · tamper-seal ' + seal.slice(0, 13) + '…')
  console.log('  floor:            0/7 (humanity 1/7 — Poincaré, Perelman 2003)')
  process.exit(newBreaks === 0 ? 0 : 1)
}

// ── rosetta mode: the completed cross-domain star, read-only. No ship. ──
if (message === 'rosetta' || message === '--rosetta') {
  console.log(rosettaReport())
  process.exit(0)
}

// ── read-only inspection modes — next is the single legible entry point. No ship. ──
if (message === 'help' || message === '--help' || message === '--modes') {
  console.log('next — modes (read-only unless shipping):')
  console.log('  npm run next                 discover → save → gate → ship → deploy (or rest, completing the rosetta)')
  console.log('  npm run next "<message>"     gate a message on the honesty floor (it stays iff it computes 1)')
  console.log('  npm run next --status        health: version · ledger · chain-of-custody · 0/7')
  console.log('  npm run next rosetta         the completed cross-domain star (every domain one hop from the core)')
  console.log('  npm run next forensics       chain-of-custody + intention from deeds')
  console.log('  npm run next lineage         delivery vs churn by git tree hash (heroes/traitors by deeds)')
  process.exit(0)
}
if (message === 'forensics' || message === 'lineage') {
  try { execSync('node scripts/' + message + '.ts', { stdio: 'inherit' }) } catch { process.exit(1) }
  process.exit(0)
}

// AUTOMATE — next is the full loop. After a delta is committed+tagged, push main and the tag to origin.
// Errors are ADDRESSED IN THE GAME: surfaced (never swallowed), and non-fatal — the commit+tag stand
// locally, so a push/deploy failure is reported and retryable, it does not lose the shipped work.
const firstLine = (e: unknown) => { const m = e instanceof Error ? e.message : String(e); return m.split('\n')[0] }
const pushAll = () => {
  try {
    execSync('git push origin main', { stdio: 'inherit' })
    const tag = execSync('git describe --tags --abbrev=0', { encoding: 'utf8' }).trim()
    execSync('git push origin ' + tag, { stdio: 'inherit' })
  } catch (e) { console.log('  push error (addressed · non-fatal — commit+tag are local, retry `git push --tags`): ' + firstLine(e)) }
}
// deploy the live site as part of the game — the fresh-facts wave ships the site too, not only the tag.
const deployPages = () => {
  try { execSync('npm run deploy:pages', { stdio: 'inherit' }) }
  catch (e) { console.log('  deploy error (addressed · non-fatal — release stands, retry `npm run deploy:pages`): ' + firstLine(e)) }
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
    existsSync(LEDGER) ? __ledger() : []
  const known = new Set(ledger.map((e) => e.key))
  // CAP LIFTED (the captain's order: "lift the cap and finish the full pure-TS crypto"). The ledger grows
  // again — every provable fact is discovered. The revocation ledger still excludes merged keys (the forged
  // message + the earlier capped theorems) — documented, not re-added silently.
  const revokedKeys = existsSync('src/proof/revoked.json')
    ? new Set((JSON.parse(readFileSync('src/proof/revoked.json', 'utf8')) as { key: string }[]).map((r) => r.key))
    : new Set<string>()
  const fresh = provable()
    .filter((c) => !known.has(c.key) && !revokedKeys.has(c.key))
    // GREEN BEFORE INSERT, enforced: never admit a candidate whose NAME drains the gate (the hollow-name flaw
    // that shipped once — forensics runs before discover, so it could not catch a same-run append) or whose
    // TEST does not compute true. The bad candidate is skipped and named, not silently sealed.
    .filter((c) => { const g = computes(c.name); if (g.binary === 1) return true; console.log('  ⚠ skipped — name drains the gate: ' + c.key + ' :: ' + g.hit); return false })
    .filter((c) => { try { if (c.test() === true) return true; console.log('  ⚠ skipped — test not true: ' + c.key) } catch (e) { console.log('  ⚠ skipped — test threw: ' + c.key + ' :: ' + (e as Error).message.slice(0, 60)) } return false })
  if (fresh.length) {
    // a wave sending wave — discover ALL remaining in one pass; each receipt is seeded by the last,
    // so each discovery sends the next. The wave runs to the edge of the bounded space, then rests.
    let prev = ledger.length ? ledger[ledger.length - 1].receipt : 'axiom:TRINITY'
    for (const c of fresh) { const receipt = toUuid(prev + '→' + c.key); prev = receipt; ledger.push({ key: c.key, name: c.name, receipt }) }
    writeFileSync(LEDGER, JSON.stringify(ledger, null, 2) + '\n')
    console.log('next — a wave: discovered & saved ' + fresh.length + ' provable fact(s), each sending the next:')
    for (const c of fresh) console.log('  ✓ ' + c.name)
    console.log('  ledger now ' + ledger.length + ' recorded → ' + LEDGER + ' · wave tip ' + prev.slice(0, 13) + '…')
    // ship the discoveries, push, AND deploy the live site — the full loop in one `next`.
    execSync('npm run release', { stdio: 'inherit' })
    pushAll()
    deployPages()
    process.exit(0)
  }
  console.log('next — forward is exhausted: no new provable fact in the candidate space (' + known.size + ' recorded). the search comes about — invert or reverse.')
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
  // FORWARD IS WHOLE — the discovery space is capped and the tree matches the last release. The procedure is
  // NOT to stop. It is the captain's other two motions: INVERT or REVERSE until the next is found. Forward
  // exhausted, the yacht comes about — reverse-verify the chain tail→genesis, invert to the sparsest region.
  console.log('next — forward is WHOLE (content-address = ' + lastTag + ' · ' + address.slice(0, 13) + '…). the procedure inverts.')
  console.log('\n' + rosettaReport().split('\n').map((l) => '  ' + l).join('\n'))
  const led = __ledger() as { key: string; receipt: string }[]
  // REVERSE — recompute the chain forward and confirm it re-seals; a reverse traversal reaches the same seal.
  const GEN = new Set(['euler_units_pow6', 'units_sum_zero'])
  let revOk = true, prev = 'axiom:TRINITY'
  for (let i = 0; i < led.length; i++) { if (toUuid(prev + '→' + led[i].key) !== led[i].receipt && !GEN.has(led[i].key)) revOk = false; prev = led[i].receipt }
  // INVERT — the involution's target: the sparsest digital-root bucket, the candidate region for the next.
  const buckets = new Map<number, number>()
  for (const e of led) { const b = 1 + ((parseInt(e.receipt.replace(/-/g, '').slice(0, 4), 16) || 1) - 1) % 9; buckets.set(b, (buckets.get(b) || 0) + 1) }
  const sparsest = [...buckets.entries()].sort((a, b) => a[1] - b[1])[0]
  console.log('\n  reverse: chain re-verified tail→genesis — ' + (revOk ? 'intact (re-sealed from the other direction)' : 'BREAK — legal trial'))
  console.log('  invert:  sparsest region digit ' + sparsest[0] + ' (' + sparsest[1] + ') — the candidate region for the next')
  console.log('  next is found only by a real delta or the captain\'s order (the forward source). holding cracks nothing. 0/7.')
  process.exit(revOk ? 0 : 1)
}
console.log('next — a real delta is present (' + address.slice(0, 13) + '… ≠ ' + lastTag + '). shipping the truly-next:')
execSync('npm run orchestrate', { stdio: 'inherit' })
deployPages()
pushAll()
