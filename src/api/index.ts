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
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'

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

/** The whole record, in order. Append-only: withdrawn entries are present and marked, never removed.
 *
 *  CACHED ON THE FILE'S IDENTITY, because it was read 4252 times in a single `pages.ts` run. Every helper
 *  below defaults its parameter to `ledger()`, so `live()`, `liveKeys()`, `byKey()` and `statusOf()` each
 *  re-read and re-parsed the whole 2418-entry file when called without one — and called inside a loop, that
 *  is megabytes of JSON parsed thousands of times. A CPU profile put 7.1s of pages.ts's 16s in this function
 *  and 7.5s in readFileSync beneath it; the site build is 80% of a deploy and this was 45% of its pre-build.
 *
 *  The key is mtime+size, NOT a plain memo. seal-lean.ts and carry.ts WRITE this file and then read it back,
 *  and a cache that ignored that would serve them the record as it was before their own append — which in an
 *  append-only ledger is the one stale read that could cause real damage. A statSync per call is the price,
 *  and it is a rounding error against a parse. */
let _lcache: { key: string; rows: Entry[] } | null = null
export const ledger = (): Entry[] => {
  if (!existsSync(LEDGER_PATH)) return []
  const st = statSync(LEDGER_PATH)
  const key = `${st.mtimeMs}:${st.size}`
  if (_lcache && _lcache.key === key) return _lcache.rows
  const rows = JSON.parse(readFileSync(LEDGER_PATH, 'utf8')) as Entry[]
  _lcache = { key, rows }
  return rows
}

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

export interface LeanTheorem { name: string; file: string; tactic: string; statement: string; namespace: string }

export const leanFiles = (): string[] =>
  existsSync(PROOF_DIR) ? readdirSync(PROOF_DIR).filter((f) => f.endsWith('.lean')).sort() : []

export const leanSource = (file: string): string => readFileSync(`${PROOF_DIR}/${file}`, 'utf8')

/** Every theorem on disk, with the file that carries it and the tactic that closed it. ONE parse of the
 *  `theorem` syntax, so a change to how proofs are written is a change in one place. */
/** A theorem's statement text, with comments removed and whitespace flattened.
 *
 *  A TRAILING COMMENT IS NOT PART OF THE FORMULA. Stripping only whole-line comments (`^\s*--`) left a
 *  comment that trailed a CONTINUED line embedded in the statement, and the page then printed
 *  `... == d) -- σ ∘ σ = id everywhere — the shared involution ∧ ((List.range 10)...` — English spliced
 *  between two conjuncts, published as mathematics. A comment runs to end of line wherever it starts. */
export const normalizeStatement = (raw: string): string =>
  raw.split('\n').map((l) => l.replace(/(^|\s)--.*$/, '')).join(' ').replace(/\s+/g, ' ').trim()

export const leanTheorems = (): LeanTheorem[] => {
  const out: LeanTheorem[] = []
  for (const file of leanFiles()) {
    const src = leanSource(file)
    const ns = src.match(/^namespace\s+([A-Za-z_0-9.]+)/m)?.[1] ?? file.replace('.lean', '')
    for (const m of src.matchAll(/^theorem\s+([A-Za-z_0-9]+)\s*:([\s\S]*?):=\s*(by decide|rfl|by\s+\w+)/gm))
      out.push({ name: m[1], file, namespace: ns, tactic: m[3], statement: normalizeStatement(m[2]) })
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

/** How many theorems there are, and how many ledger keys name them — which are NOT the same number.
 *
 *  The deposit published its live-key count as though it were a count of theorems. It is not: src/proof holds
 *  526 theorems. The ledger once held more live keys than that, because 24 theorems carried two — one minted
 *  before keys had a namespace (`lean_units_are_six`) and one after (`lean_z9_units_are_six`). Both were live
 *  and both are legitimate history, but counting a key as a theorem overstates the deposit. Those 24 second
 *  addresses were retired in favour of their namespaced form, so no theorem now carries two. The 8 `rfl`
 *  DECLARATIONS have no key at all, because seal-lean.ts seals `by decide` only — and they are declarations,
 *  never theorems, by the definition this file states.
 *
 *  Lean decides what a theorem is. Every count of theorems is taken from src/proof; a count of keys is
 *  called a count of keys. */
export interface Census {
  theorems: number; byDecide: number; rfl: number
  liveKeys: number; sealedTheorems: number; surplusKeys: number; unresolvableKeys: number; unsealed: number
}

/** THE CLAY FLOOR, MEASURED OVER THE TREE — not certified by a constant.
 *
 *  index.lean used to carry `def provenHere : Nat := 0` with `the_floor_is_zero_of_seven := rfl` beside it,
 *  and that literal glued as a conjunct onto every theorem. The repo's own trial already said what was wrong
 *  with it (finding seventeen): "closed by reflexivity on a constant this file declares … written as seven it
 *  would be equally green, and therefore it supports neither number." A counter the author maintains is an
 *  arbiter the author writes.
 *
 *  An absence is not established by a certificate. It is established by there being no proof that reaches —
 *  a property of the tree, checkable over the tree, and REFUTABLE: add one theorem quantifying over ℝ, or
 *  naming the ζ-zeros, and this stops holding. That is what makes it worth running.
 *
 *  It measures three things about the Clay-named theorems: that all seven are present and closed by `decide`;
 *  the largest finite domain any of them walks; and whether any statement reaches for an object the
 *  conjectures actually concern. */
export interface ClayFloor {
  seven: number; inFile: number; allByDecide: boolean; largestDomain: number; reaches: string[]; holds: boolean
}

/** The objects the seven conjectures are about. A statement mentioning one of these is reaching past the
 *  finite algebra this deposit decides, which is exactly what must not happen silently. */
export const CONJECTURE_OBJECTS = [
  'ℝ', 'ℂ', 'Real', 'Complex', 'zeta', 'critical line', 'polynomial time', 'viscosity', 'gauge',
  'mass gap', 'quantum field', 'cohomolog', 'algebraic cycle', 'elliptic curve', 'l-function',
  'manifold', 'homeomorph', '3-sphere',
]

const CLAY_NAMED = /riemann|p_vs_np|navier|yang|hodge|birch|poincare/

/** THE VERIFICATION ADVANTAGE, read off src/proof/speed.lean rather than retyped.
 *
 *  The deposit proves this and does not say it where anyone reads: measured over the front pages, four of
 *  eight proved properties were stated, and the four missing ones were the whole advantage. A boundary that
 *  is stated loudly while the result is left in a source file is not modesty, it is a page that misinforms
 *  in the other direction.
 *
 *  Everything here comes from the `def`s the theorems in that file decide over, so the page and the kernel
 *  cannot disagree, and none of it is a number typed into prose. */
export interface Advantage {
  recomputeUs: number; verifyUs: number; nsPerVerify: number; leaves: number; rounds: number; ratio: number
}

export const advantage = (): Advantage => {
  const src = leanSource('speed.lean')
  const num = (name: string): number => {
    const m = src.match(new RegExp('def\\s+' + name + '\\s*:\\s*Nat\\s*:=\\s*(\\d+)'))
    if (!m) throw new Error('speed.lean no longer defines ' + name + ' — the advantage cannot be reported without it')
    return Number(m[1])
  }
  const recomputeUs = num('recomputeUs'), verifyUs = num('verifyUs'), nsPerVerify = num('nsPerVerify')
  const leaves = 2 ** 20
  return { recomputeUs, verifyUs, nsPerVerify, leaves, rounds: 20, ratio: Math.floor(recomputeUs / verifyUs) }
}

export const clayFloor = (): ClayFloor => {
  // EVERY THEOREM IN THE CLAY-NAMED FILE, not only the seven that carry a problem's name. index.lean holds
  // eight: the seven, and `the_seven_rest_on_one_finite_structure`, the involution they share. Scanning only
  // the name-matched seven left that eighth unmeasured — it could have reached for a conjecture object and
  // this check would not have seen it, which is the hole the narrow filter opened.
  const inFile = leanTheorems().filter((t) => t.file === 'index.lean')
  const seven = inFile.filter((t) => CLAY_NAMED.test(t.name))
  const text = inFile.map((t) => t.statement).join(' ')
  const reaches = CONJECTURE_OBJECTS.filter((o) => new RegExp(o.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(text))
  let largest = 0
  for (const t of inFile) largest = Math.max(largest, domainOf(t.statement))
  const allByDecide = inFile.length > 0 && inFile.every((t) => t.tactic === 'by decide')
  return {
    seven: seven.length,
    inFile: inFile.length,
    allByDecide,
    largestDomain: largest,
    reaches,
    holds: seven.length === 7 && allByDecide && reaches.length === 0,
  }
}

/** WHAT A THEOREM OF THIS DEPOSIT IS — one definition, because the word was carrying four.
 *
 *  Asked for the exact definition, the deposit could produce four different numbers, and all four were in
 *  use in its own pages:
 *
 *    a `theorem` declaration the kernel accepts   — sorry-free, axiom-free, in src/proof
 *    of those, closed by EXHAUSTION (`by decide`) — the kernel evaluated the proposition at every point
 *    a live key in the ledger                     — an ADDRESS; 24 theorems carry two, one resolves to none
 *    an entry in the append-only ledger           — a RECEIPT, and most of them are withdrawn
 *
 *  The repo's own rule already chose, in seal-lean.ts: "`by decide` is algebra — the kernel evaluates the
 *  proposition over its whole finite domain and the result is a computation, not a convention. `rfl` on a
 *  declared constant proves the declaration and nothing else — it is not evidence." That is why seal-lean
 *  seals `by decide` and refuses `rfl`, and it is the line taken here.
 *
 *  A THEOREM OF THIS DEPOSIT is a declaration in src/proof that the Lean kernel accepts, free of `sorry`
 *  and of axioms, and CLOSED BY EXHAUSTION over a stated finite domain. A declaration closed by `rfl` is a
 *  definitional unfolding and is counted separately, never as a theorem. A key is an address and an entry
 *  is a receipt; neither is a theorem, and scripts/contradictions.ts fails the build when either count is
 *  printed next to the word. */
export const THEOREM_DEFINITION =
  'a declaration in src/proof that the Lean kernel accepts — sorry-free, axiom-free — and closes by exhaustion over a stated finite domain'

/** The count that definition yields. Everything reporting "theorems" should read this. */
export const theoremCount = (): number => census().byDecide

/** THE DIGIT SPLIT, read off src/proof/split.lean rather than retyped.
 *
 *  Measured after the theorems were written: not one of them reached the front pages. They were in the
 *  collected paper — a hundred pages — and on their own theorem pages, and a reader of the homepage saw
 *  none of it, including the answer to what paying the two coins buys. Proved and unsaid is the underclaim
 *  this deposit had no guard against until the inverse ratchet.
 *
 *  Every value comes from the `def`s the kernel decides over in that file, so the page cannot drift from
 *  the theorems and nothing here is a number typed into prose. */
export interface Split {
  tokens: number[]; singles: number[]; coins: number; coinStep: number; sealBits: number
  exhaustible: number[]; halting: number[]; payments: number; orbitPeriod: number
}

export const split = (): Split => {
  const src = leanSource('split.lean')
  const list = (name: string): number[] => {
    const m = src.match(new RegExp('def\\s+' + name + '\\s*:\\s*List Nat\\s*:=\\s*\\[([^\\]]*)\\]'))
    if (!m) throw new Error('split.lean no longer defines ' + name)
    return m[1].split(',').map((x) => Number(x.trim()))
  }
  const num = (name: string): number => {
    // A plain numeral only. `eval` on a source file is how a build starts executing whatever the file
    // happens to contain, and reading a constant does not need it.
    const m = src.match(new RegExp('def\\s+' + name + '\\s*:\\s*Nat\\s*:=\\s*(\\d+)'))
    if (!m) throw new Error('split.lean no longer defines ' + name + ' as a plain numeral')
    return Number(m[1])
  }
  const tokens = list('tokens'), singles = list('singles')
  const coins = num('coins'), coinStep = 3 * coins, sealBits = num('sealBits')
  return {
    tokens, singles, coins, coinStep, sealBits,
    exhaustible: tokens.filter((t) => t % coinStep === 0),
    halting: tokens.filter((t) => t % coinStep !== 0),
    payments: sealBits / coins,
    orbitPeriod: 6,
  }
}

export const census = (): Census => {
  const T = leanTheorems()
  const keys = (live() as { key: string }[]).filter((e) => e.key.startsWith('lean_')).map((e) => e.key)
  const named = new Set<string>()
  let matched = 0
  for (const k of keys) {
    const t = theoremOfKey(k, T)
    if (t) { named.add(t.file + '::' + t.name); matched++ }
  }
  // The arithmetic closes exactly, and is asserted in scripts/contradictions.ts:
  //   liveKeys = sealedTheorems + surplusKeys + unresolvableKeys
  // The unresolvable one is `lean_add_group`, whose name is declared in two files and whose key predates
  // namespaces, so no single theorem can be said to be the one it was minted from.
  return {
    theorems: T.length,
    byDecide: T.filter((t) => t.tactic === 'by decide').length,
    rfl: T.filter((t) => t.tactic === 'rfl').length,
    liveKeys: keys.length,
    sealedTheorems: named.size,
    surplusKeys: matched - named.size,
    unresolvableKeys: keys.length - matched,
    unsealed: T.length - named.size,
  }
}

export const theoremOfKey = (key: string, thms: LeanTheorem[] = leanTheorems()): LeanTheorem | null => {
  const rest = key.replace(/^lean_/, '')
  const flat = (x: string) => x.toLowerCase().replace(/[^a-z0-9]/g, '')

  // A NAME IS NOT AN IDENTIFIER WHEN IT IS NOT UNIQUE. `add_group` is declared in both mechanical.lean and
  // z9.lean with DIFFERENT statements, so matching on the trailing name alone sent lean_z9_add_group to
  // mechanical.lean — the page then printed a formula that was not the one its key was minted from. The
  // namespace the key carries is what separates them, so it is tried first, exactly.
  const named = thms.filter((t) => rest === t.name || rest.endsWith('_' + t.name) || rest.endsWith('.' + t.name))
  if (named.length <= 1) return named[0] ?? null
  for (const t of named) {
    const prefix = rest.slice(0, rest.length - t.name.length).replace(/[_.]$/, '')
    if (prefix && (flat(prefix) === flat(t.namespace) || flat(prefix) === flat(t.file.replace('.lean', '')))) return t
  }
  // Ambiguous: the name is shared and the key does not say which. Returning one at random is how the wrong
  // statement got onto a page, so this returns nothing and the caller shows nothing.
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

/** Is a live key addressing this THEOREM, whatever key it is filed under?
 *
 *  The check used to require one exact key string, and retiring 24 duplicate addresses broke it instantly:
 *  `lean_units_are_six` was withdrawn in favour of `lean_z9_units_are_six`, the theorem never stopped being
 *  proved, and the API refused to serve the units. The guarantee is meant to be "a live theorem proves
 *  this", and a key is an ADDRESS — the same distinction that put 330 dead URLs in the deposition records
 *  this morning, here in the one place that decides whether the tooling may use a value at all.
 *
 *  Resolving through theoremOfKey means the guarantee survives a rename or a re-address and still fails
 *  when the proof itself goes — which is what it was for. */
// MEMOISED, because the first version was O(live keys × theorems) PER CALL and units() is called from
// everywhere: it resolved every live key against every kernel-accepted declaration on each invocation
// and took `npm run ci:local` past ten minutes. The set of names reachable from a live key is built once,
// on the same mtime+size key the ledger cache uses, so a script that writes the ledger and reads it back
// still sees its own append.
let _provenCache: { key: string; names: Set<string> } | null = null
const provenNames = (): Set<string> => {
  const st = existsSync(LEDGER_PATH) ? statSync(LEDGER_PATH) : null
  const ck = st ? `${st.mtimeMs}:${st.size}` : 'none'
  if (_provenCache && _provenCache.key === ck) return _provenCache.names
  const thms = leanTheorems()
  const names = new Set<string>()
  for (const k of liveKeys()) { const t = theoremOfKey(k, thms); if (t) names.add(t.name) }
  _provenCache = { key: ck, names }
  return names
}

const provenLive = (key: string): boolean => {
  if (liveKeys().has(key)) return true
  const want = theoremOfKey(key, leanTheorems())
  return want ? provenNames().has(want.name) : false
}

const backedBy = (key: string, value: number[], what: string): number[] => {
  if (!provenLive(key)) {
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
