#!/usr/bin/env node
/** ── covered.json IS A RECORD OF WHERE PROOFS WENT, AND A GENERATOR OWNS THE FILE ─────────────────────────
 *
 *  `covered.json` says which live theorem carries a candidate that was dropped, and seal-lean reads it to
 *  decide whether a sealed key is superseded or genuinely orphaned. It is written by scripts/imagine.ts —
 *  which, until this gate existed, wrote it from its own analysis alone and ERASED every entry it had not
 *  just produced. A hand-written record of what carries `roots_of_unity_cancel` survived exactly one run.
 *
 *  That is the second generator in this repository to overwrite something a person put in its output: the
 *  first replaced a credited prior-art attribution with a claim of no known prior art. Fixing the first
 *  instance did not fix the shape, so this checks the shape.
 *
 *  TWO THINGS, AND THE SECOND IS THE POINT:
 *    · every entry names a theorem that is actually live — a record pointing nowhere carries nothing
 *    · running the generator PRESERVES every entry it did not write — checked by running it, not by reading
 *      the code, because "it merges now" is a claim about behaviour
 *
 *  It restores the file afterwards, so a run leaves the tree as it found it.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { leanTheorems, liveKeys } from '../src/api/index.ts'

const P = 'src/proof/covered.json'
const before = readFileSync(P, 'utf8')
const prior = JSON.parse(before) as Record<string, string>

const live = liveKeys()
const names = new Set((leanTheorems() as { name: string }[]).map((t) => t.name))
const dangling = Object.entries(prior).filter(([, by]) =>
  !names.has(by) || ![...live].some((k) => k.endsWith('_' + by) || k === by))
if (dangling.length) {
  console.log(`✗ covered-gate: ${dangling.length} entr(ies) in ${P} name a theorem that is not live:`)
  for (const [k, by] of dangling) console.log(`    ${k} → ${by}`)
  process.exit(1)
}

// THE BEHAVIOUR, EXERCISED. A sentinel is added, the generator is run, and the sentinel must still be there.
// Reading imagine.ts for a spread operator would test my reading of it; running it tests it.
const SENTINEL = '__covered_gate_sentinel__'
const heir = Object.values(prior)[0]
if (!heir) { console.log(`✗ covered-gate: ${P} is empty, so nothing can be checked for survival`); process.exit(1) }
writeFileSync(P, JSON.stringify({ ...prior, [SENTINEL]: heir }, null, 2) + '\n')
let survived = false
try {
  execFileSync('node', ['scripts/imagine.ts', '--emit'], { stdio: 'pipe' })
  survived = Object.hasOwn(JSON.parse(readFileSync(P, 'utf8')) as Record<string, string>, SENTINEL)
} finally {
  writeFileSync(P, before)
}
if (!survived) {
  console.log(`✗ covered-gate: scripts/imagine.ts --emit ERASED an entry it did not write.`)
  console.log(`  ${P} records where dropped proofs went and seal-lean reads it to tell a superseded key from`)
  console.log(`  an orphan. A generator that replaces the file destroys every record a person put there, and`)
  console.log(`  the loss is silent — the next run simply has fewer entries. Merge, do not replace.`)
  process.exit(1)
}

console.log(`✓ covered-gate: ${Object.keys(prior).length} coverage record(s), each naming a live theorem, and the`)
console.log(`  generator that owns the file preserves an entry it did not write — exercised, not read.`)
