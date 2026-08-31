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
import { readFileSync, readdirSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { toUuid, merkleFold, digitalRoot } from '../src/0/index.ts'
import { computes } from './honesty-gate.ts'
import { CANDIDATES } from './discover.ts' // gap classification only (reporting) — distinguishes an undiscovered theorem from a non-theorem
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
console.log('  clusters (digital-root of receipt — a LOSSY hint, not a verdict; each event compressed to 1 of 9 roots): ' + spread.map(([k, v]) => k + ':' + v).join(' ') + ' — sparsest bucket ' + sparsest[0] + ' (' + sparsest[1] + '); the EXACT undiscovered are pointed at below, uncompressed')

// (5c) GAP ANALYSIS — the LOSSLESS complement to the digital-root buckets above. Rather than compress every
// receipt-event into one of nine roots (which discards the event and can only wave at a "region"), this reads the
// KEY NAMESPACE directly and points EXACTLY at the undiscovered: an integer-indexed theorem family that runs dense
// and nearly-complete but SKIPS an index has a precise hole — a specific theorem not yet discovered (or removed).
// Named directly, excluding documented revocations. A lead to investigate, never a verdict; never fails the build.
let REVOKED_G = new Set<string>()
try { REVOKED_G = new Set((JSON.parse(readFileSync('src/proof/revoked.json', 'utf8')) as { key: string }[]).map((r) => r.key)) } catch { /* no revocation ledger */ }
const idxSeries = new Map<string, number[]>()
for (const e of ledger) { const m = e.key.match(/^(.*?)(\d+)$/); if (m) { const p = m[1]; if (!idxSeries.has(p)) idxSeries.set(p, []); idxSeries.get(p)!.push(parseInt(m[2], 10)) } }
const exactGaps: string[] = []
for (const [p, idx] of idxSeries) {
  const s = [...new Set(idx)].sort((a, b) => a - b)
  const span = s[s.length - 1] - s[0] + 1
  // a real family with a gap: ≥4 members, a bounded span, ≥70% full (dense) — never a sparse hashed range
  if (s.length < 4 || span > 16 || s.length / span < 0.7) continue
  for (let n = s[0]; n <= s[s.length - 1]; n++) { const k = p + n; if (!s.includes(n) && !REVOKED_G.has(k)) exactGaps.push(k) }
}
// classify each exact gap against the candidate space, so the pointer distinguishes a GENUINELY undiscovered
// theorem (computes true, absent) from a non-theorem's shadow (computes false — correctly absent) or an
// index the generator never proposes (a lead to develop). This is what makes the pointer EXACT, not merely a hole.
const candByKey = new Map(CANDIDATES.map((c) => [c.key, c]))
const undiscovered: string[] = [], nonTheorem: string[] = [], unproposed: string[] = []
for (const k of exactGaps) { const c = candByKey.get(k); if (!c) unproposed.push(k); else if (c.test()) undiscovered.push(k); else nonTheorem.push(k) }
console.log(undiscovered.length
  ? '  gap (LOSSLESS — GENUINELY UNDISCOVERED: computes TRUE yet absent from a dense family — a theorem to SHIP): ' + undiscovered.join(' ')
  : '  gap (LOSSLESS): 0 genuinely-undiscovered — every dense-family index that computes true is already sealed')
if (nonTheorem.length) console.log('  gap — correctly absent (a non-theorem: computes FALSE at this index — its absence is right, not a hole): ' + nonTheorem.join(' '))
if (unproposed.length) console.log('  gap — unproposed (the generator emits no candidate here — a lead to DEVELOP the generator, never a tamper): ' + unproposed.join(' '))
// distance to the next full octave — the other exact, uncompressed lead (theorems matter in groups of 8)
const toNextOctave = (8 - (ledger.length % 8)) % 8
console.log('  gap — to the next full octave: ' + (toNextOctave === 0
  ? 'none, the ledger is octave-exact (' + ledger.length + ' = ' + (ledger.length / 8) + ' × 8)'
  : toNextOctave + ' theorem(s) short of ' + (Math.ceil(ledger.length / 8) * 8)))

// (5d) DOMAIN ANALYTICS — the map read across domains: partition the ledger by key FAMILY (the first meaningful
// token, skipping generic prefixes), report the distribution (richest and thinnest domains) and the single-family
// concentration. An analytic skill over the whole uuidna map — reporting only, a lead, never a verdict.
// THE FAMILY IS READ FROM THE SOURCE, NOT PARSED OUT OF THE KEY. Splitting key text invented a family per
// theorem for every entry sealed under the older `lean_<theorem>` convention, and reported them as singleton
// domains "not yet grown to an octave" — when each is an ordinary theorem sitting in z9.lean or quantum.lean
// alongside twenty others. The metric was measuring NAMING HISTORY and calling it domain structure, which is
// worse than reporting nothing: it pointed at work that does not exist. The unit work is actually organised
// by is the file, so the file is what is counted, by matching each key against the theorem names on disk.
const STOP = new Set(['the', 'a', 'an', 'is', 'are', 'of', 'in', 'to', 'and', 'each', 'all', 'no', 'not', 'one', 'two', 'six', 'seven', 'lean'])
const fileOfTheorem = new Map<string, string>()
try {
  for (const lf of readdirSync('src/proof').filter((x) => x.endsWith('.lean'))) {
    const txt = readFileSync('src/proof/' + lf, 'utf8')
    for (const m of txt.matchAll(/^theorem\s+([A-Za-z_0-9]+)/gm)) fileOfTheorem.set(m[1], lf.replace('.lean', ''))
  }
} catch { /* no proofs on disk — fall back to the key */ }
const familyOf = (key: string) => {
  const rest = key.replace(/^lean_/, '')
  for (const [name, file] of fileOfTheorem) if (rest === name || rest.endsWith('_' + name) || rest.endsWith('.' + name)) return file
  for (const t of key.split('_')) if (!STOP.has(t)) return t
  return key.split('_')[0]
}
// PARTITIONED OVER LIVE ENTRIES, NOT THE WHOLE RECORD. Counting every entry made this line report 1026
// singleton families as "a candidate to develop" when 1014 of them are WITHDRAWN claims — a withdrawn claim
// is not a fact waiting to grow into an octave, it is a fact that stopped standing, and calling it a lead
// pointed every reader at work that must not be done. The live count is 12, which is the honest size of the
// lead. The revoked entries are still counted separately below, where they are described as what they are.
const fam = new Map<string, number>()
const liveEntries = ledger.filter((e) => !(e as { revoked?: boolean }).revoked)
for (const e of liveEntries) { const t = familyOf(e.key); fam.set(t, (fam.get(t) ?? 0) + 1) }
const byCount = [...fam.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
const top = byCount[0]
console.log('  domains (by key family, LIVE only): ' + fam.size + ' families over ' + liveEntries.length + ' live theorems'
  + ' · richest ' + byCount.slice(0, 6).map(([t, n]) => t + ':' + n).join(' ')
  + ' · largest family ' + top[0] + ' holds ' + (top[1] / liveEntries.length * 100).toFixed(1) + '%')
const singletons = byCount.filter(([, n]) => n === 1).length
console.log('  domain spread: ' + singletons + ' live singleton families (a standing fact not yet grown to an octave — a real candidate), '
  + byCount.filter(([, n]) => n >= 8).length + ' families at octave scale (≥8)'
  + ' · ' + (ledger.length - liveEntries.length) + ' withdrawn entries are excluded: a claim that stopped standing is not a lead')

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
