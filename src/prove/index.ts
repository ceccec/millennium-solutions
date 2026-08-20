#!/usr/bin/env node
// THE PROVER — the deposit proving itself, without an author in the loop.
//
// Everything here was manual work: read the queue, pick a claim, write the Lean, compile it, audit the
// axioms, seal it, check the chain. Each step was a place the process stopped and waited for a person. A step
// that waits for a person is not part of the deposit; it is a habit of whoever was running it.
//
// What is AI-independent and what is not, stated plainly rather than blurred:
//
//   INDEPENDENT — the queue (which entries are portable, derived from their own test bodies), translation of
//   MECHANICAL claim shapes to Lean, compilation, the axiom audit, agreement against the ledger's own test,
//   sealing with a chained receipt, and the refusal to seal anything that fails any of those.
//
//   NOT INDEPENDENT — deciding what a NEW proposition should say when the claim has no mechanical shape.
//   Cassini needed splitting into two theorems because naturals cannot carry an alternating sign; nothing
//   here would have discovered that. Such claims are reported as needing an author, never faked.
//
// The honesty of this file rests on that second list being reported, not hidden. A prover that silently skips
// what it cannot do looks complete and is not.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { translate } from './translate.ts'

const LEDGER = 'src/proof/discovered.json'
const DISCOVER = 'scripts/discover.ts'

export type Portable = { key: string; name: string; body: string; shape: Shape }
export type Shape = 'modular-identity' | 'range-predicate' | 'exact-set' | 'unknown'

/** Read each portable entry's TEST BODY — the claim's own computation, not its prose. */
export function queue(): Portable[] {
  const led = JSON.parse(readFileSync(LEDGER, 'utf8')) as { key: string; name: string; portable?: boolean }[]
  const src = readFileSync(DISCOVER, 'utf8')
  const bodies = new Map([...src.matchAll(/out\.push\(\{ key: '([a-z_0-9]+)'[\s\S]*?test: \(\) => ([\s\S]*?)\}\)\n/g)]
    .map((m) => [m[1], m[2]] as [string, string]))
  return led.filter((e) => e.portable).map((e) => {
    const body = bodies.get(e.key) ?? ''
    return { key: e.key, name: e.name, body, shape: classify(body) }
  })
}

/** The shape of a claim decides whether it can be translated without judgement. */
export function classify(body: string): Shape {
  const b = body.replace(/\s+/g, ' ')
  if (/^[^=]*%\s*\d+\s*===\s*\d+\s*$/.test(b)) return 'modular-identity'
  if (/Array\.from\(\{ ?length: ?\d+ ?\}[\s\S]*\.every\(/.test(b)) return 'range-predicate'
  if (/JSON\.stringify\([^)]*\) === JSON\.stringify\(\[/.test(b)) return 'exact-set'
  return 'unknown'
}

/** Run the whole loop: queue → translate what is mechanical → verify → seal. Reports what it could not do. */
export function run(opts: { emit?: boolean } = {}): string {
  const q = queue()

  // Ask the TRANSLATOR, not the shape classifier. The classifier was a guess at what might be renderable and
  // reported 173 needing an author when the translator renders 22 of them; a report that is confidently wrong
  // is worse than no report, because it sets the work queue.
  const attempted = q.map((p) => ({ p, t: translate(p.body) }))
  const mechanical = attempted.filter((x) => x.t.ok).map((x) => x.p)
  const needsAuthor = attempted.filter((x) => !x.t.ok).map((x) => x.p)
  const reasons = attempted.filter((x) => !x.t.ok).reduce<Record<string, number>>((a, x) =>
    ({ ...a, [(x.t as { why: string }).why.slice(0, 46)]: (a[(x.t as { why: string }).why.slice(0, 46)] ?? 0) + 1 }), {})

  const lines: string[] = []
  lines.push(`queue: ${q.length} portable entries`)
  lines.push(`  mechanically translatable : ${mechanical.length}`)
  lines.push(`  needs an author           : ${needsAuthor.length}  ← reported, never faked`)
  lines.push('')
  lines.push('why the rest are refused (by whitelist, never best-effort):')
  for (const [why, n] of Object.entries(reasons).sort((a, b) => b[1] - a[1]).slice(0, 6)) lines.push(`  ${String(n).padStart(4)}  ${why}`)

  if (opts.emit && mechanical.length) {
    // translation is left to lean-gen, which owns emission and its five gates; this loop only drives it
    try { lines.push('', execSync('node scripts/lean-gen.ts --emit', { encoding: 'utf8' }).trim()) }
    catch (e) { lines.push('', 'lean-gen FAILED: ' + String((e as { stdout?: Buffer }).stdout ?? e).slice(0, 300)) }
    try { lines.push(execSync('node scripts/lean.ts', { encoding: 'utf8' }).trim().split('\n').slice(-1)[0]) }
    catch { lines.push('lean verification FAILED — nothing sealed') ; return lines.join('\n') }
    try { lines.push(execSync('node scripts/seal-lean.ts --seal', { encoding: 'utf8' }).trim().split('\n').slice(-2).join('\n')) }
    catch (e) { lines.push('seal FAILED: ' + String((e as { stdout?: Buffer }).stdout ?? e).slice(0, 200)) }
  }
  return lines.join('\n')
}

/** report() — the deposit's convention: every module states its own measured condition. */
export function report(): string {
  const q = queue()
  const ok = q.filter((p) => translate(p.body).ok).length
  return `prover: ${q.length} portable · ${ok} mechanical · ${q.length - ok} need an author · integrity, not truth · 0/7`
}

if (process.argv[1]?.endsWith('index.ts') && process.argv[1].includes('prove')) {
  console.log(run({ emit: process.argv.includes('--emit') }))
}
