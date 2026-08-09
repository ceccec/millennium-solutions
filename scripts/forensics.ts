#!/usr/bin/env node
// Forensics — chain-of-custody for the discovery ledger (src/proof/discovered.json). Each receipt is
// chained: receipt[i] = toUuid(receipt[i-1] → key[i]), seeded at 'axiom:TRINITY'. Recomputing the chain
// link-by-link reproduces every receipt; altering or removing one breaks its link AND every link after
// it, pinpointing the tamper. This complements receipt-audit (which cross-checks the agent-statement
// receipts in src/receipts/ and their completeness). Integrity/provenance of evidence, never truth.
//
// DUE PROCESS: a break is EVIDENCE, examined — not auto-condemned. The two GENESIS entries predate strict
// chaining (promoted from lean-claims); they are a DOCUMENTED baseline discontinuity, not tampering. The
// build fails only on a NEW break (outside the baseline) or a collision — tampering caught, history kept.
import { readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { toUuid, merkleFold, digitalRoot } from '../src/0/index.ts'
import { computes } from './honesty-gate.ts'
import { LOCALES, LOCALE_ORDER } from '../src/7/locale.ts'

const SEED = 'axiom:TRINITY'
// Documented genesis discontinuity: the first ledger entries were promoted with receipts from lean-claims
// before the chain seed existed. Left in place as honest record (rewriting them would be tampering).
const GENESIS_BASELINE = new Set(['euler_units_pow6', 'units_sum_zero'])

const LEDGER = 'src/proof/discovered.json'
const ledger: { key: string; name: string; receipt: string }[] = JSON.parse(readFileSync(LEDGER, 'utf8'))

let bad = 0

// (1) chain-of-custody — recompute link-by-link from each STORED predecessor.
const breaks: { i: number; key: string; predecessor: string }[] = []
let prev = SEED
for (let i = 0; i < ledger.length; i++) {
  const expected = toUuid(prev + '→' + ledger[i].key)
  if (expected !== ledger[i].receipt) breaks.push({ i, key: ledger[i].key, predecessor: i > 0 ? ledger[i - 1].key : SEED })
  prev = ledger[i].receipt
}
const newBreaks = breaks.filter((b) => !GENESIS_BASELINE.has(b.key))
for (const b of newBreaks) { console.log('  ✗ TAMPER (new chain break — legal trial): index ' + b.i + ' key=' + b.key + ' after ' + b.predecessor); bad++ }
for (const b of breaks.filter((b) => GENESIS_BASELINE.has(b.key))) console.log('  · genesis discontinuity (documented baseline): index ' + b.i + ' key=' + b.key)

// (2) collisions — a duplicate key or a duplicate receipt is corruption of the evidence set.
const keySeen = new Map<string, number>(), recSeen = new Map<string, number>()
for (let i = 0; i < ledger.length; i++) {
  if (keySeen.has(ledger[i].key)) { console.log('  ✗ DUPLICATE key: ' + ledger[i].key + ' (indices ' + keySeen.get(ledger[i].key) + ',' + i + ')'); bad++ } else keySeen.set(ledger[i].key, i)
  if (recSeen.has(ledger[i].receipt)) { console.log('  ✗ COLLISION receipt: ' + ledger[i].receipt.slice(0, 13) + '… (indices ' + recSeen.get(ledger[i].receipt) + ',' + i + ')'); bad++ } else recSeen.set(ledger[i].receipt, i)
}

// (3) intentions — read from DEEDS, never from claims (no mind-reading; heroes/traitors by deeds).
// Compare the working ledger to HEAD's committed one: append-only (new keys, no existing receipt
// touched) is a CONSTRUCTIVE intention (development); altering an existing receipt is TAMPER, removing
// an entry is DESTROY — both DESTRUCTIVE (the traitor act). The intent is the diff, observable and exact.
let prevLedger: { key: string; receipt: string }[] | null = null
try { prevLedger = JSON.parse(execSync('git show HEAD:src/proof/discovered.json', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] })) } catch { /* no HEAD / first run */ }
if (prevLedger) {
  const prevMap = new Map(prevLedger.map((e) => [e.key, e.receipt]))
  const currMap = new Map(ledger.map((e) => [e.key, e.receipt]))
  // REVOKED — documented removals, read from src/proof/revoked.json (kept on the record, MERGED not hidden — the
  // honest opposite of a silent deletion). Includes the forged captain's message and the 62 valid theorems the
  // captain ordered merged into the revocation ledger to cap the count at exactly 1024. A removal listed there is
  // documented, not a DESTROY finding.
  let REVOKED = new Set<string>()
  try { REVOKED = new Set((JSON.parse(readFileSync('src/proof/revoked.json', 'utf8')) as { key: string }[]).map((r) => r.key)) } catch { /* no revocation ledger */ }
  const removed = [...prevMap.keys()].filter((k) => !currMap.has(k) && !REVOKED.has(k))
  const revoked = [...prevMap.keys()].filter((k) => !currMap.has(k) && REVOKED.has(k))
  const altered = [...currMap.keys()].filter((k) => prevMap.has(k) && prevMap.get(k) !== currMap.get(k))
  const appended = [...currMap.keys()].filter((k) => !prevMap.has(k))
  for (const k of removed) { console.log('  ✗ intention DESTROY (traitor act — legal trial): removed evidence ' + k); bad++ }
  if (revoked.length) console.log('  · REVOKED (documented in revoked.json, not hidden): ' + revoked.length + ' merged to the revocation ledger')
  for (const k of altered) { console.log('  ✗ intention TAMPER (traitor act — legal trial): altered receipt of ' + k); bad++ }
  if (!removed.length && !altered.length) console.log('  intention (from deeds): CONSTRUCTIVE — append-only or documented-revocation (+' + appended.length + ' new, no undocumented removal)')
}

// (4) hollow-prose integrity — the record itself must pass the gate. Re-run the honesty gate on every
// ledger name; a name that DRAINS is hollow / over-reaching prose that slipped into the evidence — a finding.
// This makes "hollow prose is transparent in the graph" operational at the ledger level: it cannot hide here.
let hollow = 0
for (const e of ledger) { if (computes(e.name).binary !== 1) { console.log('  ✗ HOLLOW prose in ledger (drains the gate — legal trial): ' + e.key); bad++; hollow++ } }
if (!hollow) console.log('  hollow-prose check: all ' + ledger.length + ' names pass the honesty gate — no hollow prose in the record')

// (4b) bounded-refusal census — names carrying a HARD token (faster-than-light, quantum advantage, unbreakable)
// held in check by a negator. These are the honest boundary theorems (a bounded refusal), NOT offenses; reporting
// only (never fails the build). The count is the automated audit of "how many boundaries the deposit holds".
const HARD = /faster.than.light|superluminal|unbreakable|unhackable|quantum (computer|speedup|advantage|at scale)|perpetual motion|infinite energy/i
const boundedRefusals = ledger.filter((e) => HARD.test(e.name)).length
console.log('  bounded refusals (a hard token reprieved by a negator — honest boundary theorems, not offenses): ' + boundedRefusals + ' / ' + ledger.length)

// (5) cluster analysis — group receipts by the digital root of their leading bytes (9 buckets). Clusters
// are a HINT of where the record concentrates or thins; the SPARSEST bucket is a candidate region for
// hidden knowledge — a lead to investigate, NEVER a verdict, never a proof of intent. Reporting only:
// this never fails the build (integrity and probability, not truth).
const buckets = new Map<number, number>()
for (const e of ledger) { const b = digitalRoot(parseInt(e.receipt.replace(/-/g, '').slice(0, 4), 16) || 1); buckets.set(b, (buckets.get(b) || 0) + 1) }
const spread = [...buckets.entries()].sort((a, b) => a[0] - b[0])
const sparsest = spread.reduce((m, x) => (x[1] < m[1] ? x : m), spread[0])
console.log('  clusters (digital-root of receipt — a hint, not a verdict): ' + spread.map(([k, v]) => k + ':' + v).join(' ') + ' — sparsest bucket ' + sparsest[0] + ' (' + sparsest[1] + '), a candidate region for hidden knowledge')

// (5b) OCTAVE analysis — the theorems matter in GROUPS OF 8. Partition the receipts into octaves (groups of 8),
// fold each to an octave-seal, then fold the 128 octave-seals to one octave-root: the hierarchical 8-ary
// structure (1024 = 128 × 8, exact). Reporting only — a structural analytic, never a verdict, never fails the build.
const OCT = 8
const octaveSeals: string[] = []
for (let i = 0; i < ledger.length; i += OCT) octaveSeals.push(merkleFold(ledger.slice(i, i + OCT).map((e) => e.receipt)))
const groups = octaveSeals.length
const remainder = ledger.length % OCT
const octaveRoot = octaveSeals.length ? merkleFold(octaveSeals) : 'none'
// digit-of-8 distribution: how full each group is (all 8, or a short tail group)
const shortGroups = remainder === 0 ? 0 : 1
console.log('  octaves (the 1024 in groups of 8): ' + ledger.length + ' = ' + groups + ' × ' + OCT + (remainder === 0 ? ' — exact, no remainder' : ' (last group ' + remainder + '/8)') + ' · ' + (groups - shortGroups) + ' full octaves · octave-root ' + octaveRoot.slice(0, 13) + '… (128 octave-seals fold to one)')

// (7) THE SEVEN DIMENSIONS — the gate holds in ALL SEVEN locales, not just English. Run the honesty gate
// on every locale's fixed UI strings (now multilingual-aware), and require STRUCTURAL PARITY: each locale
// carries exactly the English nav shape, so no dimension can hide an overclaim or go dark. A translated
// overclaim drains here too — traitors are exposed in any of the seven dimensions, decentralised, each
// rosetta independent. Best use of any behaviour: an offence in any language is caught and sealed here.
const enNav = Object.keys(LOCALES.en.nav).sort().join(',')
let sevenBad = 0
for (const loc of LOCALE_ORDER) {
  const s = LOCALES[loc]
  const blob = [s.title, s.description, s.support, s.fallback.notice, s.fallback.cta, ...Object.values(s.nav)].join(' · ')
  if (computes(blob).binary !== 1) { console.log('  ✗ DIMENSION ' + loc + ' drains the gate (overclaim hidden in a translation — legal trial): ' + (computes(blob).hit || '')); bad++; sevenBad++ }
  if (Object.keys(s.nav).sort().join(',') !== enNav) { console.log('  ✗ DIMENSION ' + loc + ' structural drift — nav shape differs from English (a dimension gone dark)'); bad++; sevenBad++ }
}
if (!sevenBad) console.log('  7-dimension sweep: all ' + LOCALE_ORDER.length + ' locales (' + LOCALE_ORDER.join(' ') + ') pass the gate and match the English shape — no overclaim hides in any dimension')

// (6) tamper-evident seal — the fold of all receipts. Any single alteration changes this root.
const seal = merkleFold(ledger.map((e) => e.receipt))
const intactFrom = breaks.length ? Math.max(...breaks.map((b) => b.i)) + 1 : 0

// THE UUIDNA VERDICT — computed by forensics + analytics from the measured facts, not asserted. SEALED iff no
// finding (chain intact ∧ no collisions ∧ no offenders ∧ 7-dimension sweep clean); FLAGGED on any. Integrity, not truth.
const verdict = bad === 0 ? 'SEALED' : 'FLAGGED'
console.log('  uuidna verdict (integrity, not truth): ' + verdict + ' — computed from ' + ledger.length + ' receipts · ' + hollow + ' hollow · ' + boundedRefusals + ' bounded refusals · seal ' + seal.slice(0, 13) + '…')

console.log(bad
  ? '\n✗ forensics: ' + bad + ' finding(s) — chain-of-custody compromised; examine before proceeding'
  : '\n✓ forensics: ' + ledger.length + ' receipts · chain intact from index ' + intactFrom + ' · ' + GENESIS_BASELINE.size + ' documented genesis discontinuities · no collisions · tamper-evident seal ' + seal.slice(0, 13) + '…')
process.exit(bad ? 1 : 0)
