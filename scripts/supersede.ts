#!/usr/bin/env node
// SUPERSEDE — when a generator RENAMES what it proves, say which theorem carries each old name.
//
// scripts/imagine.ts enumerates its vocabulary from the ring instead of from a typed table, so its maps are
// named for what they are — `aff_2_0` rather than `double`. Every statement the old table proved is still
// proposed, still true, still decided by the kernel on every run. Only the NAME moved.
//
// The ledger is append-only and its keys are provenance, so a name that moves leaves a sealed key with no
// source. seal-lean calls that an orphan and offers to withdraw it, which at the time, for 3317 entries,
// would have been this deposit withdrawing facts the kernel checks on every run — an underclaim, and the one direction the record
// must never move in. covered.json already exists to say "superseded, not lost", but imagine.ts can only
// write it for candidates IT dropped: a rename is invisible there, because the old name is no longer a
// candidate at all.
//
// THE JOIN IS ON THE STATEMENT, NOT THE NAME — which is the only join that can be trusted here, and is the
// same equality-by-extension the generator uses to decide two maps are one map. A theorem carries an old key
// exactly when it proves character-for-character what that key was sealed from. Nothing is matched on
// spelling, token overlap or resemblance: scripts/carry.ts records what heuristic name-matching cost here,
// and three of its twelve candidates were wrong.
import { execSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { ledger as ledgerRows, carrierOf, leanFiles } from '../src/api/index.ts'

// THE JOIN IS ON WHAT THE STATEMENT COMPUTES, NOT ON HOW IT IS SPELLED — and the first version of this was
// character-exact, which is the right conservatism and the wrong instrument. It carried 56 names and left 35
// behind that the new corpus DOES prove: `squares_is_closed_under_square` was written `m9 (d * d)` when the
// map table was typed and is written `m9 (d ^ 2)` now that the powers are a derived family; negation was
// `m9 (9 - d)` and is `m9 (8 * d)`; the reflection was `m9 (10 - d)` and is `m9 (8 * d + 1)`. Same map, same
// set, same theorem, four spellings — and withdrawing a fact over a change of notation is the underclaim this
// ledger must never make.
//
// So every map expression inside a statement is replaced by its EXTENSION over the ring before comparing:
// the nine values it takes. That is the same equality-by-extension the generator uses to decide two maps are
// one map, and the same rule src/entangle uses to decide two formulas coil. Only closed arithmetic in `d` is
// evaluated — anything carrying a list, a method call or a name is left exactly as written, so nothing is
// normalised into agreement that was not already computing the same thing.
const M9 = (n: number) => ((n % 9) + 9) % 9
const extendMaps = (p: string): string => {
  let out = '', i = 0
  while (i < p.length) {
    const at = p.indexOf('m9', i)
    if (at < 0 || p[at + 2] !== ' ' && p[at + 2] !== '(') { out += p.slice(i); break }
    let j = p.indexOf('(', at)
    if (j < 0) { out += p.slice(i); break }
    let depth = 0, k = j
    for (; k < p.length; k++) { if (p[k] === '(') depth++; else if (p[k] === ')' && --depth === 0) { k++; break } }
    const span = p.slice(at, k)
    const js = span.replace(/\bm9\b/g, 'M').replace(/\^/g, '**')
    // only closed arithmetic in d: a letter other than M or d means a list, a method or a name, and it stays.
    if (!/^[Md\d\s+*\-()%.]+$/.test(js) || !/\bd\b/.test(js)) { out += p.slice(i, k); i = k; continue }
    try {
      const f = new Function('M', 'd', `return ${js}`) as (m: typeof M9, d: number) => number
      out += p.slice(i, at) + '⟨' + [0, 1, 2, 3, 4, 5, 6, 7, 8].map((d) => f(M9, d)).join('') + '⟩'
    } catch { out += p.slice(i, k) }
    i = k
  }
  return out
}
const norm = (p: string) => extendMaps(p.replace(/\s+/g, ''))
const parse = (src: string): Map<string, string> => {
  const out = new Map<string, string>()
  for (const m of src.matchAll(/^theorem\s+([A-Za-z_][A-Za-z0-9_']*)\s*:\s*([\s\S]*?):=\s*by\s+decide\s*$/gm))
    out.set(m[1]!, norm(m[2]!))
  return out
}

// AT HEAD, not on disk: the working tree already holds the NEW names, so reading it would compare a file
// with itself and find every key its own successor.
const before = new Map<string, string>()
const heads: string[] = []
for (const f of execSync('git ls-tree --name-only HEAD src/proof/', { encoding: 'utf8' }).split('\n')
  .map((l) => l.replace('src/proof/', '').trim()).filter((f) => /^imagined(_\d+)?\.lean$/.test(f)))
  { // maxBuffer RAISED FROM ITS 1 MB DEFAULT. This read HEAD's generated Lean back through a pipe, which was
    // fine while the generator wrote one small file and threw at the first commit where it wrote seven
    // multi-megabyte shards — as a crash dumping a megabyte of Lean into the error, not as a clear limit.
    const src = execSync(`git show HEAD:src/proof/${f}`, { encoding: 'utf8', maxBuffer: 512 * 1024 * 1024 }); heads.push(src)
    for (const [n, p] of parse(src)) before.set(n, p) }

// THE WHOLE CORPUS, not only this generator's own files. Scoped to the shards, the question being asked was
// "does an imagined theorem still prove this", when the question that matters is "does ANY live theorem
// prove this" — and seventeen statements looked orphaned for that reason alone. Each had been dropped by
// imagine's already-said filter under its new name, because a hand-written theorem in src/proof expresses
// it; the old key could not find that carrier because the two names have nothing in common. A fact proved
// by hand is proved.
const after = new Map<string, string>()
for (const f of leanFiles())
  for (const [n, p] of parse(readFileSync('src/proof/' + f, 'utf8'))) after.set(n, p)

// A STATEMENT PROVED TWICE UNDER TWO NEW NAMES CANNOT NAME A CARRIER. If the same proposition appears more
// than once in the new corpus there is no single theorem that carries the old key, and guessing one would put
// a false claim in a record whose whole purpose is saying WHICH theorem holds the fact. Those are reported.
const byProp = new Map<string, string[]>()
for (const [n, p] of after) (byProp.get(p) ?? byProp.set(p, []).get(p)!).push(n)

const covered: Record<string, string> = existsSync('src/proof/covered.json')
  ? JSON.parse(readFileSync('src/proof/covered.json', 'utf8')) : {}
let moved = 0, gone = 0
const share: string[] = [], lost: string[] = []
for (const [oldName, prop] of before) {
  if (after.has(oldName)) continue                      // the name did not move
  const carriers = byProp.get(prop) ?? []
  // MORE THAN ONE CARRIER IS NOT AMBIGUITY HERE, and treating it as such left five proved facts looking
  // orphaned. carry.ts refuses to choose because ITS matcher is a heuristic over names, where a wrong pick
  // asserts something false. This match is exact: each candidate computes the old statement's extension,
  // value for value, so "expressed by X" is true of every one of them. The lexicographically first is named
  // so the choice is deterministic and re-derivable, and the rest are recorded as also proving it.
  if (carriers.length >= 1) {
    const [first, ...also] = [...carriers].sort()
    covered[oldName] = first!
    moved++
    if (also.length) share.push(`${oldName} → ${first} (also proved by ${also.length} other live theorem(s))`)
  } else { gone++; lost.push(oldName) }
}
// ── THE RENAME DICTIONARY IS LEARNED FROM THE MATCHES, NOT TYPED ────────────────────────────────────────
// Seventeen keys are left, and their carriers exist — they are just unreachable by name. Each was dropped by
// imagine's already-said filter under its NEW name, because a hand-written theorem in src/proof proves it;
// covered.json records that carrier against the new candidate key, and the old key shares no text with it.
//
// The bridge is a map-id rename table, and it is READ OUT OF THE MATCHES ABOVE rather than written down.
// Every pair carried by exact extension equality is evidence of one token moving: `squares_is_closed_under_
// square` matching `squares_is_closed_under_pow_2` says `square` became `pow_2` and says it with a proof,
// because the two statements compute the same nine values. A pair is kept only when the two names differ in
// exactly one token, so nothing is inferred from a rename that also changed something else.
const rename = new Map<string, string>()
for (const [from, to] of Object.entries(covered)) {
  const a = from.split('_'), b = to.split('_')
  const keep = a.filter((x) => !b.includes(x)), add = b.filter((x) => !a.includes(x))
  if (keep.length === 1 && add.length >= 1) rename.set(keep[0]!, add.join('_'))
}
let bridged = 0
for (const oldName of [...lost]) {
  for (const [from, to] of rename) {
    if (!oldName.includes(from)) continue
    const guess = oldName.replace(from, to)
    // ONLY where the new key already has a recorded carrier, or IS a live theorem. A rename that points at
    // nothing is not a carrier, and naming one would put an unverifiable claim in the record.
    const carrier = covered[guess] ?? (after.has(guess) ? guess : undefined)
    if (!carrier) continue
    covered[oldName] = carrier
    lost.splice(lost.indexOf(oldName), 1); gone--; moved++; bridged++
    break
  }
}
if (bridged) console.log(`  ✓ ${bridged} more reached through a rename the matches themselves evidence`)
// ── WHAT HAS NO CARRIER IS KEPT, NOT WITHDRAWN ──────────────────────────────────────────────────────────
// A handful survive every join: statements this generator sealed under its old vocabulary and does not
// propose under its new one. They are not false and they were never refuted — the kernel checked each of
// them on every run up to this commit. Only the enumeration moved.
//
// There are three things that can be done with such a key and two of them are wrong. Withdrawing it says the
// deposit no longer proves something it does prove, which is the underclaim this record must never make.
// Naming a carrier that does not compute the same statement puts a false claim in the one file whose whole
// job is saying which theorem holds a fact. So the SOURCE is kept: the theorem is copied out of HEAD exactly
// as it stood, into a file of its own, where the kernel goes on deciding it. A generator does not get to
// delete the evidence for something it has already sealed just because its vocabulary changed.
const retained: string[] = []
for (const name of lost) {
  const src = heads.find((h) => h.includes(`theorem ${name} :`))
  if (!src) continue
  const m = src.match(new RegExp(`(^--[^\\n]*\\n)?^theorem\\s+${name}\\s*:[\\s\\S]*?:=\\s*by\\s+decide$`, 'm'))
  if (m) retained.push(m[0])
}
if (retained.length) {
  writeFileSync('src/proof/retained.lean', `import Z9
set_option maxRecDepth 8000000
-- title: Sealed before the vocabulary moved, and still decided
-- wing: the imagined
-- prior_art: unclassified
-- RETAINED — scripts/imagine.ts sealed these when its map table was hand-written, and its derived
-- enumeration does not propose them. Nothing about them was refuted: each is copied here exactly as the
-- generator last wrote it, and the kernel decides every one on every run. The ledger is append-only, so a
-- sealed key whose source disappears is an orphan the record cannot honestly resolve — keeping the source is
-- the only answer that neither withdraws a proved fact nor claims a carrier that does not prove it.
--
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0 · No axioms, no Mathlib, no sorry.

namespace Imagined

open Z9

${retained.join('\n\n')}

end Imagined
`)
  console.log(`  ✓ ${retained.length} kept in src/proof/retained.lean — sealed, still true, no longer proposed`)
}
// ── AND THE CITATIONS FOLLOW, OR THE RENAME IS NOT FINISHED ─────────────────────────────────────────────
// Carrying a key marks it revoked with a `supersededBy`, and cite-audit reads a revoked key in prose as
// "REVOKED — in the record, no longer citable". It is right to: this repository's own rule is that a citation
// names the LIVE end of the chain, because the middle of one sends a reader to a page saying the theorem
// moved. Two published files cited a key this run carried, and neither the prose nor the gate was wrong —
// the rename simply had not finished.
//
// So the prose is rewritten to the carrier the LEDGER names, resolved with carrierOf, which walks to the
// live end rather than stopping at the first heir. Nothing is edited on a guess: a key is rewritten only
// when the record itself says where its proof now is, and only when that destination stands.
// ONLY PROSE NOBODY GENERATES. The first version rewrote every .md in the root, and two of them are
// generated: challenges.ts already renders a carried entry in its own shape — struck through, with an arrow
// to the heir — so patching its output replaced a correct rendering with a foreign one that the next
// regeneration would drop anyway, and a drift gate would have caught it as a hand edit. The generated set is
// DERIVED by reading which files the scripts write, not listed here, so a new generator cannot be forgotten.
const led = ledgerRows()
const generated = new Set<string>()
for (const f of readdirSync('scripts').filter((x) => x.endsWith('.ts')))
  for (const m of readFileSync(`scripts/${f}`, 'utf8').matchAll(/writeFileSync\(\s*['`]([^'`$]+\.md)['`]/g))
    generated.add(m[1]!)
let recited = 0
for (const f of readdirSync('.').filter((f) => f.endsWith('.md') && !generated.has(f))) {
  const txt = readFileSync(f, 'utf8')
  const next = txt.replace(/(?<=[(\s>"'])\/theorem\/([A-Za-z0-9_.]+)/g, (whole, key: string) => {
    const e = led.find((x) => x.key === key)
    if (!e || !e.revoked) return whole
    const to = carrierOf(e, led)
    if (!to) return whole
    recited++
    return whole.replace(key, to)
  })
  if (next !== txt) writeFileSync(f, next)
}
if (recited) console.log(`  ✓ ${recited} citation(s) repointed to the carrier the ledger names`)
// ── NO CARRIER THAT IS NOT A THEOREM ────────────────────────────────────────────────────────────────────
// covered-gate found an entry naming `belowtouchesit.These` as the theorem carrying a fact — prose with its
// whitespace stripped, produced by a matcher that took a name from a chunk that was not a theorem. A
// coverage record exists to answer WHICH theorem holds a superseded fact; an entry naming something that
// does not exist answers it falsely, which is worse than leaving it unanswered, because the ledger then
// reports the fact as carried. Every carrier is checked against the live corpus before the file is written,
// and one that is not a theorem is dropped with its name said out loud.
const liveNames = new Set(after.keys())
let dropped = 0
for (const [k, v] of Object.entries(covered))
  if (!liveNames.has(v)) { console.log(`  ○ dropped carrier ${k} → ${v} — no such theorem in src/proof`); delete covered[k]; dropped++ }
if (dropped) console.log(`  ✓ ${dropped} entr(ies) named a theorem that does not exist and were removed`)
writeFileSync('src/proof/covered.json', JSON.stringify(covered, null, 2) + '\n')
console.log(`before ${before.size} · after ${after.size}`)
console.log(`  ✓ ${moved} old name(s) carried — a live theorem computes each one's statement value for value`)
if (share.length) { console.log(`  ○ ${share.length} are proved by several live theorems; the first is named, deterministically:`); for (const l of share) console.log('      ' + l) }
if (gone) { console.log(`  ○ ${gone} statement(s) are no longer proposed at all — genuinely orphaned, left for seal-lean to judge:`); for (const l of lost) console.log('      ' + l) }
