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
import { ledger as loadLedger } from '../api/index.ts'
import { execSync } from 'node:child_process'
import { translate } from './translate.ts'

const LEDGER = 'src/proof/discovered.json'
const DISCOVER = 'scripts/discover.ts'

export type Portable = { key: string; name: string; body: string; shape: Shape }
export type Shape = 'modular-identity' | 'range-predicate' | 'exact-set' | 'unknown'

/** Read each candidate entry's TEST BODY — the claim's own computation, not its prose.
 *
 *  THE QUEUE IS NOT A FLAG. It used to be `led.filter(e => e.portable)`, and that flag was written once and
 *  never recomputed: 176 entries carried it while 1688 withdrawn claims with perfectly runnable tests were
 *  never asked. A stale marker had become the thing deciding what could be proved, so a claim was outside the
 *  prover's reach for no reason anyone had checked — the same fault as revoking before folding, one level up.
 *
 *  Every entry with a test body is queued now, and the translator's refusal list does the filtering WITH A
 *  REASON. That is the only honest place for the decision: a refusal that names what it cannot read is a work
 *  list, where a missing flag is silence. Entries already superseded by a Lean theorem are skipped because
 *  they are done, not because they were filtered.
 */
export function queue(): Portable[] {
  const led = loadLedger()
  const src = readFileSync(DISCOVER, 'utf8')
  const bodies = new Map([...src.matchAll(/out\.push\(\{ key: '([a-z_0-9]+)'[\s\S]*?test: \(\) => ([\s\S]*?)\}\)\n/g)]
    .map((m) => [m[1], m[2]] as [string, string]))
  // A SUPERSEDED CLAIM STAYS IN THE QUEUE, and skipping it was circular. `supersededBy` means "a Lean
  // theorem now carries this" — and for the mechanically rendered ones, that theorem IS the one emit writes
  // into mechanical.lean. Filtering them out stopped emit rendering them, mechanical.lean shrank from 75
  // theorems to 2, and 75 sealed keys instantly had no source: the successors were orphaned by the very
  // link that recorded their success. Being done is not a reason to stop regenerating the artefact that
  // makes it true.
  return led
    .filter((e) => bodies.has(e.key))
    .map((e) => {
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
  // SHAPE REFUSALS, BUCKETED. "not a chain of simple bindings" was reported as one number, and a single
  // number is not a work list — it hides whether the blocker is one tractable pattern or a hundred different
  // programs. Twice I read that number as a shape problem and was wrong both times: the early-return
  // validation loop was hiding in it and needed no judgement at all. Bucketing is what surfaced it, so the
  // buckets stay, and each names an example so the next reader can check rather than trust the label.
  const shapes: Record<string, { n: number; eg: string }> = {}
  for (const p of q) {
    const t = translate(p.body)
    const why = 'why' in t ? t.why : null
    if (!why || !why.includes('simple bindings')) continue
    const b = p.body.replace(/\s+/g, ' ').replace(/^\{\s*|\s*\}$/g, '')
    const k =
      /\w+\s*\[\s*\w+\s*\]\s*=/.test(b) ? 'builds a table by index assignment (a recurrence — needs the recurrence named)'
      : /\bnew Map\b|\bmemo\b/.test(b) ? 'memoised closure (state across calls)'
      : /const\s*\[/.test(b) ? 'array destructuring'
      : /=>\s*\{/.test(b) ? 'binds a function with a statement body'
      : /\bfor\s*\(\s*const\b/.test(b) ? 'for-of over a computed list'
      : /\bwhile\b|\bdo\s*\{/.test(b) ? 'unbounded while/do'
      : 'other'
    shapes[k] = shapes[k] ?? { n: 0, eg: b.slice(0, 96) }
    shapes[k].n++
  }
  const shapeTotal = Object.values(shapes).reduce((a, x) => a + x.n, 0)
  if (shapeTotal) {
    lines.push('')
    lines.push(`the ${shapeTotal} refused on SHAPE, by what the body actually is:`)
    for (const [k, v] of Object.entries(shapes).sort((a, b) => b[1].n - a[1].n))
      lines.push(`  ${String(v.n).padStart(4)}  ${k}\n        e.g. ${v.eg}`)
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
