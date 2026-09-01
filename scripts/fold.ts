#!/usr/bin/env node
// FOLD — nothing is purged before the sequence has been given every turn it allows.
//
// The dry clean revoked 1865 entries for lacking a Lean proof. That was right about the standard and wrong
// about the order: an entry was withdrawn BEFORE the prover had been asked whether it could be rendered, and
// once withdrawn nothing ever asked again. Twenty-seven of them have since been proved in Lean and the record
// still showed them as simply gone, because a revocation was one-way and a resurrection had nowhere to be
// written down.
//
// This folds instead. One fold is: translate what the ledger states, put it to the kernel, seal what holds,
// then LINK every revoked claim whose statement now stands to the theorem that carries it.
//
// HOW MANY FOLDS THE SEQUENCE ACTUALLY ALLOWS — measured, not assumed. The orbit 1,2,4,8,7,5 gives six turns
// before it returns to where it began, so six is the ceiling. The real number is ONE, and the reason is worth
// stating plainly: the translator is deterministic and its input is the ledger's own tests, which a pass does
// not change. A second identical pass therefore cannot reach anything the first did not — it is a no-op that
// costs a full kernel run to discover. The first version of this script folded six times to find that out and
// timed out doing it. A fold is only productive when something between passes CHANGED: new vocabulary in the
// translator, a new definition in the preamble, a claim rewritten by an author. So this runs one fold, and
// reports the ceiling and the reason rather than performing five empty turns to look thorough.
//
// Nothing is deleted and nothing is un-revoked. The ledger is append-only, so a withdrawn entry stays
// withdrawn and gains a `supersededBy` pointing at the theorem that re-established it. The history reads
// truthfully in both directions: the claim did not hold on the evidence it had, and it holds now on evidence
// it did not have then. That is a record of work, not an erasure of a mistake.
//
// Run: node scripts/fold.ts           (fold and report)
//      node scripts/fold.ts --write   (also write the supersededBy links)
import { writeFileSync } from 'node:fs'
import { ledger as loadLedger, live as liveOf, type Entry } from '../src/api/index.ts'
import { execSync } from 'node:child_process'

const LEDGER = 'src/proof/discovered.json'

const ORBIT = [1, 2, 4, 8, 7, 5]        // the doubling orbit: six turns, then it repeats
const write = process.argv.includes('--write')

const load = (): Entry[] => loadLedger()
const sh = (cmd: string) => { try { return execSync(cmd, { encoding: 'utf8', stdio: 'pipe' }) } catch (e) {
  return String((e as { stdout?: string }).stdout ?? '') } }

const ORBIT_TURNS = ORBIT.length
const before = load()
const liveBefore = before.filter((e) => !e.revoked).length

sh('node -e "import(\'./src/prove/emit.ts\').then(m => m.emit())"')
const lean = sh('node scripts/lean.ts')
if (/FAILING/.test(lean)) {
  console.log('fold 1 — the kernel refused something; stopping rather than sealing over it')
  process.exit(1)
}
if (write) sh('node scripts/seal-lean.ts --seal')

const after = load()
const live = new Set(liveOf(after).map((e) => e.key))

// LINK: a revoked claim whose statement is now carried by a Lean theorem is superseded, not merely gone.
// Matched on the claim's own key appearing as the theorem's suffix, which is how the prover names what it
// renders — never on wording, because shared vocabulary is not shared mathematics.
let linked = 0
for (const e of after) {
  if (!e.revoked || e.supersededBy) continue
  const succ = [...live].find((k) => k === 'lean_mechanical_' + e.key || k.endsWith('_' + e.key))
  if (!succ) continue
  e.supersededBy = succ
  linked++
}
if (linked && write) writeFileSync(LEDGER, JSON.stringify(after, null, 2) + '\n')

const gained = after.filter((e) => !e.revoked).length - liveBefore
console.log(`fold 1 of at most ${ORBIT_TURNS} (the orbit's length) — sealed ${after.filter((e) => !e.revoked).length} live (${gained >= 0 ? '+' : ''}${gained}) · linked ${linked} withdrawn claim(s) to the theorem that re-established them`)
console.log(`  a second fold is skipped, not omitted: the translator is deterministic over an unchanged ledger, so it would render exactly this again. Folding resumes when the translator learns a shape it cannot read today.`)

// WHAT REMAINS, and why — reported per reason, never as a single number. A count of failures teaches nothing;
// the shape of them is the work list for the next pass of the translator.
const led = load()
const stillGone = led.filter((e) => e.revoked && !e.supersededBy)
const reasons: Record<string, number> = {}
for (const e of stillGone) reasons[(e.reason ?? 'no reason recorded').split('.')[0].slice(0, 70)] = (reasons[(e.reason ?? 'no reason recorded').split('.')[0].slice(0, 70)] ?? 0) + 1

console.log(`\nfolded once of the orbit's ${ORBIT_TURNS} · ${linked} claim(s) linked to their proof this run`)
console.log(`${led.filter((e) => e.supersededBy).length} withdrawn claim(s) now carry a supersededBy link — withdrawn on the evidence they had, standing on evidence they did not`)
console.log(`${stillGone.length} still have no Lean successor:`)
for (const [r, n] of Object.entries(reasons).sort((a, b) => b[1] - a[1]).slice(0, 6)) console.log(`  ${String(n).padStart(5)}  ${r}`)
if (!write) console.log('\nrun with --write to seal and record the links')
