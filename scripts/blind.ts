#!/usr/bin/env node
/** ── A BLINDED TRIAL OF THE GATES, BECAUSE EVERY CONTROL HERE IS DOWSING ON A KNOWN WELL ──────────────────
 *
 *  Radiesthesia — dowsing — is the standing example of an instrument that performs beautifully until the
 *  operator stops knowing where the target is. Practitioners report a strong, unmistakable signal; under a
 *  protocol where nobody at the rod knows which pipe carries water, the hit rate falls to what guessing
 *  produces. The rod was never the instrument. The operator was.
 *
 *  Every negative control in scripts/gates-fire.ts has that shape. I choose a defect, I write the mutation
 *  that produces it, I check that the gate I had in mind refuses it, and I record a pass. Fifty-three of
 *  those tell me fifty-three specific defects are caught. They tell me NOTHING about the defect nobody
 *  thought of, which is the only kind that ever ships — and they are scored by the person holding the rod.
 *
 *  So this picks the target instead. It mutates the record at random — a digit in a published figure, a
 *  citation, a flag in a decided table — runs the gate chain, and records whether ANYTHING caught it. The
 *  number it reports is a DETECTION RATE over perturbations nobody chose, and the misses are the finding.
 *
 *  IT IS BLIND IN THE ONLY SENSE THAT MATTERS HERE: the mutation is drawn from a seeded generator before
 *  any gate runs, and the verdict is the chain's exit code, not my reading of its output. What it cannot do
 *  is blind ME to the result afterwards, and it does not pretend to — a miss is written down as a miss.
 *
 *      node scripts/blind.ts [--trials N] [--seed S]
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { arg, num } from '../src/cli/index.ts'
const run = promisify(execFile)


const TRIALS = num('--trials', 12)
const SEED = num('--seed', 7)

// A seeded generator, so a run is reproducible and a miss can be reproduced by whoever doubts it.
let state = SEED >>> 0
const rnd = (): number => { state = (state * 1664525 + 1013904223) >>> 0; return state / 4294967296 }
const pick = <A>(xs: A[]): A => xs[Math.floor(rnd() * xs.length)]

/** Where a perturbation would be a real defect: a published figure, a decided table, a generated page. */
const TARGETS = [
  'README.md', 'index.md', 'paper.md', 'dashboard.md', 'AXIOMS.md', 'CHALLENGES.md',
  'PRIOR-ART.md', 'ACCOUNTING.md', 'llms.txt', 'rights.md', 'metrics.json',
  'src/proof/rights.lean', 'src/proof/priorart.lean', 'src/proof/discovered.json',
]

/** The line a mutation lands on, with the change shown. "A figure moved by one" without saying WHICH is a
 *  dowser's report: unfalsifiable, unactionable, and impossible to tell from a lucky guess. */
const lineAt = (src: string, at: string | number, from: string, to: string): string => {
  const i = typeof at === 'number' ? at : 0
  const start = src.lastIndexOf('\n', i) + 1
  const end = src.indexOf('\n', i)
  const line = src.slice(start, end < 0 ? src.length : end).trim()
  const n = src.slice(0, i).split('\n').length
  return `line ${n}: ${line.slice(0, 100)}   [${from} → ${to}]`
}

type Trial = { file: string; kind: string; before: string; after: string; where?: string; regenerated?: boolean }
const mutate = (file: string, src: string): Trial | null => {
  const kinds: (() => Trial | null)[] = [
    // a figure moves by one — the class stale-figures and the metrics face exist to catch
    () => {
      const lits = [...src.matchAll(/(?<![\w.])(\d{2,7})(?![\w.])/g)]
      if (!lits.length) return null
      const l = pick(lits)
      const at = l.index ?? 0
      return { file, kind: 'a published figure moved by one', before: src, where: lineAt(src, at, l[1], String(Number(l[1]) + 1)),
        after: src.slice(0, at) + String(Number(l[1]) + 1) + src.slice(at + l[1].length) }
    },
    // a citation points somewhere else — the class the seal gate and the audit exist to catch
    () => {
      const cites = [...src.matchAll(/\/theorem\/([a-z0-9_]+)/g)]
      if (!cites.length) return null
      const c = pick(cites)
      const at = (c.index ?? 0) + '/theorem/'.length
      return { file, kind: 'a citation repointed to a key that is not live', before: src, where: lineAt(src, at, c[1], 'not_a_live_key_at_all'),
        after: src.slice(0, at) + 'not_a_live_key_at_all' + src.slice(at + c[1].length) }
    },
    // a decided flag flips — the class the rights and prior-art theorems exist to catch
    () => {
      const flags = [...src.matchAll(/(true|false)/g)]
      if (!flags.length) return null
      const f = pick(flags)
      const at = f.index ?? 0
      return { file, kind: 'a flag flipped in a table the kernel decides', before: src, where: lineAt(src, at, f[1], f[1] === 'true' ? 'false' : 'true'),
        after: src.slice(0, at) + (f[1] === 'true' ? 'false' : 'true') + src.slice(at + f[1].length) }
    },
  ]
  for (let i = 0; i < 6; i++) { const t = pick(kinds)(); if (t && t.after !== t.before) return t }
  return null
}

// WHICH CHAIN IS BEING MEASURED IS PART OF THE RESULT. The first run measured `gates`, which does not run
// the Lean kernel — so a flag flipped in a table the kernel DECIDES came back as a miss, and the reported
// rate was about my choice of chain as much as about the gates. `ci:local` is what runs on every commit, so
// that is the default and the report names it. A detection rate without the chain beside it is not a figure.
const CHAIN = arg('--chain') ?? 'npm run -s ci:local'
const caught: Trial[] = []
const missed: Trial[] = []
const skipped: string[] = []

for (let i = 0; i < TRIALS; i++) {
  const file = pick(TARGETS)
  let src = ''
  try { src = readFileSync(file, 'utf8') } catch { skipped.push(`${file} — unreadable`); continue }
  const t = mutate(file, src)
  if (!t) { skipped.push(`${file} — nothing to perturb`); continue }
  writeFileSync(file, t.after)
  let ok = true
  try { await run('sh', ['-c', CHAIN], { maxBuffer: 64 * 1024 * 1024 }) } catch { ok = false }
  // A GREEN CHAIN THAT REWROTE THE FILE DID NOT MISS THE DEFECT — it overwrote it. Those are different
  // outcomes and lumping them together would report a generator doing its job as a hole in the gates.
  t.regenerated = ok && readFileSync(file, 'utf8') !== t.after
  writeFileSync(file, t.before)          // ALWAYS restored, whatever the chain did
  ;(ok ? missed : caught).push(t)
  process.stdout.write(ok ? (t.regenerated ? '~' : '·') : '✓')
}
process.stdout.write('\n\n')

const tried = caught.length + missed.length
console.log(`blind — a seeded trial of what the gates catch when nobody chooses the defect:\n`)
console.log(`  chain measured                      ${CHAIN}`)
console.log(`  seed                                ${SEED}`)
console.log(`  perturbations applied               ${tried}`)
console.log(`  caught by \`${CHAIN}\`            ${caught.length}`)
console.log(`  NOT caught                          ${missed.length}`)
if (skipped.length) console.log(`  skipped, nothing to perturb         ${skipped.length}`)
console.log(`  detection rate                      ${tried ? (100 * caught.length / tried).toFixed(0) + '%' : '—'}\n`)

const overwritten = missed.filter((m) => m.regenerated)
const survived = missed.filter((m) => !m.regenerated)
if (overwritten.length) {
  console.log(`  ${overwritten.length} perturbation(s) were OVERWRITTEN, not missed — the chain regenerates that file, so`)
  console.log(`  the edit was replaced before anything could object. A generator doing its job, not a hole:`)
  for (const m of overwritten) console.log(`    ${m.file} — ${m.kind}\n        ${m.where ?? ''}`)
  console.log('')
}
if (survived.length) {
  console.log(`  THE MISSES ARE THE FINDING. Each of these changed the record, survived the run, and the chain`)
  console.log(`  stayed green:`)
  for (const m of survived) console.log(`    ${m.file} — ${m.kind}\n        ${m.where ?? ''}`)
  console.log(`\n  A miss is not proof that nothing checks it: this runs \`${CHAIN}\` and not the whole release,`)
  console.log(`  so a defect the Lean kernel or the seal step would catch shows up here as a miss. What it does`)
  console.log(`  show is which perturbations survive the chain that runs most often.`)
}
console.log(`\n○ blind: reports and does not fail. The rate is the measurement; a threshold on it would turn the`)
console.log(`  next unlucky seed into a red build and teach nobody anything.`)
