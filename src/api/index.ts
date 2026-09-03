// THE REUSABLE API — one place that knows how to read this deposit.
//
// Thirty-two scripts loaded src/proof/discovered.json themselves and nine parsed Lean theorem names with
// their own regex. That is not a style problem: every one of those copies is a place where the deposit can
// start disagreeing with itself, and this session found several that had. forensics counted key families by
// splitting key TEXT and reported 377 development leads that did not exist; seal-lean matched whole keys and
// called 25 living theorems orphans; verify read a foreign ledger and reported every entry unproven. Each was
// a private answer to a question this module now answers once.
//
// Nothing here decides anything. It reads artefacts and returns them typed — the ledger, the Lean sources,
// and the relation between a sealed key and the theorem on disk that carries it. Judgement stays in the gates
// that own it.
import { readFileSync, readdirSync, existsSync } from 'node:fs'

export const LEDGER_PATH = 'src/proof/discovered.json'
export const PROOF_DIR = 'src/proof'

/** THE RECORD HAS FOUR STATES, NOT TWO. `revoked` was carrying two different meanings: a claim that stopped
 *  holding, and a claim that was withdrawn for want of a proof and has since been given one. Reporting the
 *  second as merely withdrawn understates the record — 113 entries whose statement the kernel now checks were
 *  being counted with the 1778 that nobody proved.
 *
 *  Nothing is un-revoked. The original entry's own evidence is still a TypeScript test, and rewriting its
 *  status would erase the fact that it did not hold on what it had. What changes is that the record can now
 *  say both things at once: withdrawn on its own evidence, and STANDING through the theorem that carries it.
 *
 *    standing    — live, kernel-checked, nothing withdrawn
 *    carried     — withdrawn on its own evidence, and its statement is proved by a live theorem
 *    withdrawn   — withdrawn, and nothing proves it
 *    (revoked)   — the raw flag, kept because the chain and every receipt were written against it
 */
export type Status = 'standing' | 'carried' | 'withdrawn'

export interface Entry {
  key: string
  name: string
  receipt: string
  revoked?: boolean
  reason?: string
  supersededBy?: string
  portable?: boolean
  statement?: string
}

/** The whole record, in order. Append-only: withdrawn entries are present and marked, never removed. */
export const ledger = (): Entry[] =>
  existsSync(LEDGER_PATH) ? JSON.parse(readFileSync(LEDGER_PATH, 'utf8')) : []

/** The entries that STAND. Everything that judges what the deposit currently claims wants this one. */
export const live = (l: Entry[] = ledger()): Entry[] => l.filter((e) => !e.revoked)

/** Withdrawn but kept — still receipted, still in the chain, no longer claimed. */
export const withdrawn = (l: Entry[] = ledger()): Entry[] => l.filter((e) => e.revoked === true)

/** Withdrawn AND since re-established by a Lean theorem, which the record links rather than un-revoking. */
export const superseded = (l: Entry[] = ledger()): Entry[] => l.filter((e) => e.supersededBy)

export const liveKeys = (l: Entry[] = ledger()): Set<string> => new Set(live(l).map((e) => e.key))
export const byKey = (l: Entry[] = ledger()): Map<string, Entry> => new Map(l.map((e) => [e.key, e]))

/** The octave reading — the deposit counts in eights. A target the theorems earn, never a quota. */
export const octave = (l: Entry[] = ledger()) => ({
  total: l.length, octaves: Math.floor(l.length / 8), remainder: l.length % 8, exact: l.length % 8 === 0,
})

export interface LeanTheorem { name: string; file: string; tactic: string; statement: string }

export const leanFiles = (): string[] =>
  existsSync(PROOF_DIR) ? readdirSync(PROOF_DIR).filter((f) => f.endsWith('.lean')).sort() : []

export const leanSource = (file: string): string => readFileSync(`${PROOF_DIR}/${file}`, 'utf8')

/** Every theorem on disk, with the file that carries it and the tactic that closed it. ONE parse of the
 *  `theorem` syntax, so a change to how proofs are written is a change in one place. */
export const leanTheorems = (): LeanTheorem[] => {
  const out: LeanTheorem[] = []
  for (const file of leanFiles()) {
    for (const m of leanSource(file).matchAll(/^theorem\s+([A-Za-z_0-9]+)\s*:([\s\S]*?):=\s*(by decide|rfl|by\s+\w+)/gm))
      out.push({ name: m[1], file, tactic: m[3], statement: m[2].replace(/^\s*--.*$/gm, '').replace(/\s+/g, ' ').trim() })
  }
  return out
}

/** Which file carries the theorem a sealed key was minted from.
 *
 *  Keys carry their naming HISTORY: older entries are `lean_<theorem>` and current ones are
 *  `lean_<namespace>_<theorem>`. Comparing whole keys called 25 living theorems orphans, and splitting key
 *  text invented a family per theorem. Matching on the theorem IDENTIFIER is what survives both conventions,
 *  and it is the only comparison any caller should be making. */
/** The domain `by decide` actually walked — the count of cases the kernel exhausted, read off the
 *  statement. One definition: scripts/leandoc.ts and scripts/pages.ts each had their own copy of this,
 *  byte-identical, so the number a theorem page prints and the number the front pages rank by could
 *  drift apart on the next edit to either. */
export const domainOf = (statement: string): number => {
  let n = 1
  for (const m of statement.matchAll(/List\.range'\s+\d+\s+(\d+)/g)) n *= Number(m[1])
  for (const m of statement.matchAll(/List\.range\s+(\d+)/g)) n *= Number(m[1])
  for (const m of statement.matchAll(/\[([0-9,\s]+)\]/g)) n *= Math.max(1, m[1].split(',').filter((x) => x.trim()).length)
  return n
}

export const theoremOfKey = (key: string, thms: LeanTheorem[] = leanTheorems()): LeanTheorem | null => {
  const rest = key.replace(/^lean_/, '')
  for (const t of thms) if (rest === t.name || rest.endsWith('_' + t.name) || rest.endsWith('.' + t.name)) return t
  return null
}

/** The file alone, for callers that only need to know where a key was minted from. Delegates to
 *  theoremOfKey so the two-convention matching above is written once and cannot drift between them. */
export const fileOfKey = (key: string, thms: LeanTheorem[] = leanTheorems()): string | null =>
  theoremOfKey(key, thms)?.file ?? null

/** Frontmatter written as `-- key: value` at the head of a Lean file, before its prose. */
export const frontmatter = (file: string): Record<string, string> => {
  const fm: Record<string, string> = {}
  for (const line of leanSource(file).split('\n')) {
    const m = line.match(/^\s*--\s*([a-z][a-z0-9_]*):\s*(.+?)\s*$/)
    if (!m) { if (/^\s*--/.test(line)) continue; if (line.trim() === '' || /^(import|set_option)/.test(line)) continue; break }
    fm[m[1]] = m[2]
  }
  return fm
}

/** THE TWO QUESTIONS, ASKED ONE WAY. Eight scripts spelled "does this entry stand" as their own inline
 *  predicate — `!e.revoked` here, `filter((e) => e.revoked)` there, `e.revoked === true` elsewhere. The
 *  predicates happened to agree, but agreement by coincidence is what a shared definition removes: a
 *  withdrawn entry that later grows a third state (superseded is already one) would need finding in eight
 *  places, and this session has twice watched a private copy answer differently from its siblings. */
export const isLive = (e: Entry): boolean => !e.revoked

/** The state of one entry, as the record can actually justify it.
 *
 *  THE SUCCESSOR MUST ITSELF STAND. The first version of this read `e.supersededBy ? 'carried' : 'withdrawn'`
 *  — the mere PRESENCE of a forwarding key was taken as proof that the statement survives. Twenty-five entries
 *  forward to a key that is itself withdrawn, and every one of them was being reported as carried: the record
 *  claimed a live proof at the far end of a link that leads nowhere. CHALLENGES.md published those links, and
 *  the seal gate caught a page citing a withdrawn theorem, which is how this was found rather than shipped.
 *  A carry is a claim about where the proof is now, so it is only a carry when there is a proof there. */
export const statusOf = (e: Entry, l: Entry[] = ledger()): Status => {
  if (!e.revoked) return 'standing'
  if (!e.supersededBy) return 'withdrawn'
  const heir = l.find((x) => x.key === e.supersededBy)
  return heir && !heir.revoked ? 'carried' : 'withdrawn'
}

/** Entries whose statement stands, whether by their own seal or through the theorem that carries it. This is
 *  the honest answer to "how much of this deposit is proved" — it is NOT the same as `live`, which counts
 *  only the entries that carry their own proof, and both numbers are worth reporting separately. */
export const carried = (l: Entry[] = ledger()): Entry[] => l.filter((e) => statusOf(e, l) === 'carried')
export const proved = (l: Entry[] = ledger()): Entry[] => l.filter((e) => statusOf(e, l) !== 'withdrawn')
export const isWithdrawn = (e: Entry): boolean => e.revoked === true

// ── THE ℤ/9 SETS, COMPUTED AND CHECKED AGAINST THE THEOREM THAT PROVES THEM ────────────────────────────────
//
// The tooling had these written out as literals — `[1,2,4,5,7,8]` for the units, `[3,6,0]` for the triad,
// `[1,2,4,8,7,5]` for the orbit — in imagine.ts, fold.ts and pages.ts. Every one of them is COMPUTED in
// src/0 and PROVED in src/proof, so the literal was a third copy that no gate was checking: change the
// modulus and the runtime and the kernel would both follow while the tooling silently kept describing ℤ/9.
//
// These compute the set and then refuse to return it unless the sealed theorem that proves it is live in the
// ledger. That is the whole point — not that the numbers are right today, but that the tooling cannot go on
// using them after the proof behind them stops standing.
import { units as runtimeUnits, triad as runtimeTriad, vortexOrbit as runtimeOrbit } from '../0/index.ts'

const backedBy = (key: string, value: number[], what: string): number[] => {
  if (!liveKeys().has(key)) {
    throw new Error(
      `api: refusing to serve ${what} — the theorem that proves it (${key}) is not live in the ledger. ` +
      `The value would still compute; what is missing is the reason to trust it. Prove it, or stop using it.`)
  }
  return value
}

/** The six units of ℤ/9 — computed, and served only while lean_units_are_six stands. */
export const units = (): number[] => backedBy('lean_units_are_six', runtimeUnits(), 'the units')

/** The triad {3,6,9} — the non-units, the merkaba's axis. */
export const triad = (): number[] => backedBy('lean_units_are_six', runtimeTriad(), 'the triad')

/** The doubling orbit 1,2,4,8,7,5 — six turns before it returns to where it began. */
export const orbit = (): number[] =>
  backedBy('lean_millenniumfloor_riemann_reflection_and_heart', runtimeOrbit(), 'the doubling orbit')

/** THE MOD-3 CLASSES — the merkaba's axis and its two tetrahedra, computed from the partition rather than
 *  typed. These were the literals I missed when I claimed the tooling held no hardcoded ℤ/9 sets: the claim
 *  was scoped to the three patterns I had grepped for, which is how a check confirms what it was told to look
 *  for and nothing else. Backed by the theorem that proves the classes partition the ring 3+3+3. */
export const tetA = (): number[] =>
  backedBy('lean_merkaba_the_three_classes_partition_z9',
    Array.from({ length: 9 }, (_, d) => d).filter((d) => d % 3 === 1), 'the first tetrahedron')

export const tetB = (): number[] =>
  backedBy('lean_merkaba_the_three_classes_partition_z9',
    Array.from({ length: 9 }, (_, d) => d).filter((d) => d % 3 === 2), 'the second tetrahedron')

/** The axis {3,6,0} — the same partition's third class, and the triad by another name. */
export const axis = (): number[] =>
  backedBy('lean_merkaba_the_three_classes_partition_z9',
    Array.from({ length: 9 }, (_, d) => d).filter((d) => d % 3 === 0), 'the axis')
