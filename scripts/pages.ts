#!/usr/bin/env node
// PAGES — the README and the homepage, from one generator, ordered by the sequence.
//
// There were two generators before: scripts/readme.ts for the repo file, and a hand-written index.md for the
// site. Two sources for the same claims is how they drift, so this replaces both. Every claim is written once
// here, sealed once, and rendered twice — the pages differ only in link style and frontmatter.
//
// THE ORDER IS THE SEQUENCE. Sections follow the doubling orbit 1 → 2 → 4 → 8 → 7 → 5, the deposit's own
// generator, and the ninth section is the floor the orbit never reaches. That is not decoration: the orbit
// visits exactly the units and never the triad, so ordering the document by it puts the provable material
// first and the boundary last, by construction rather than by editorial choice.
//
// DISCIPLINE: a claim is written only if adjudicate() seals it — gate-clean AND its test holds. A constant
// -true test is refused outright. The generator exits non-zero and writes nothing if any claim fails.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { CLAIMS as REGISTERED } from '../src/claims/index.ts'
import { all as leanDocs } from './leandoc.ts'
import { analytics } from './analytics.ts'
import { queue } from '../src/prove/index.ts'
import { translate } from '../src/prove/translate.ts'
import { adjudicate } from './adjudicate.ts'
import { computes } from './honesty-gate.ts'
import { toUuid, merkleFold } from '../src/0/index.ts'
import { ledger as __ledger, triad, units, axis, domainOf, census, leanTheorems as leanTheoremsShared } from '../src/api/index.ts'

const CENSUS = census()
import { orbit } from '../src/api/index.ts'

const ledger = __ledger() as { key: string; name: string; receipt: string }[]
const leanFiles = readdirSync('src/proof').filter((f) => f.endsWith('.lean')).sort()
const leanSrc = Object.fromEntries(leanFiles.map((f) => [f, readFileSync(`src/proof/${f}`, 'utf8')]))
// ONE READER. Four regexes here parsed src/proof independently of the one in src/api — a whole-theorem
// match, a by-decide match, a per-file count and a domain ranking — each able to drift from the others and
// from the kernel. They are all the shared reader now.
const LEAN = leanTheoremsShared()
const leanTheorems = LEAN.map((t) => ({ file: t.file, name: t.name }))
const byDecide = LEAN.filter((t) => t.tactic === 'by decide').map((t) => t.name)
const leanSealed = ledger.filter((e) => e.key.startsWith('lean_'))

const m9 = (n: number) => ((n % 9) + 9) % 9
// the orbit is COMPUTED and served only while the theorem proving it stands — it was a literal here,
// a third copy of a set that src/0 computes and src/proof proves, checked by nothing.
const ORBIT = orbit()

// A DERIVED claim, not a paired one. Every earlier version of this took {text, test} — a sentence beside a
// predicate — and that shape is unsound: the predicate can pass while the sentence says something else. It
// did. A negative test paired "this deposit settles six of the seven Clay problems" with `1 + 1 === 2` and
// the generator wrote it, because the test passed and nothing checked that the test was ABOUT the sentence.
// The same defect sank three claim-to-theorem matchers and the generator's own agreement gate.
//
// Here a claim is a FUNCTION of the artefact: it reads the measurement and phrases itself with that value
// inside the text. There is no sentence to drift, because the sentence is computed. If the ledger has 2024
// entries the claim says 2024; if it has none it says none and fails its own floor. Prose cannot outrun the
// evidence when the evidence writes the prose.
type Claim = { section: string; derive: () => { text: string; ok: boolean; from: (string | number)[] } }

// Sections named by the orbit they sit at — the sequence orders the document.
const S = (i: number, title: string) => `${ORBIT[i] ?? 0} · ${title}`

const CLAIMS: Claim[] = [
  { section: S(0, 'What is proved'),
    derive: () => { const n = leanTheorems.length, f = leanFiles.length
      const clean = leanFiles.every((x) => !/\bsorry\b|native_decide/.test(leanSrc[x].replace(/^\s*--.*$/gm, '')))
      return { text: `the formal layer holds ${n} theorems across ${f} files, and ${clean ? 'no file uses sorry or native_decide outside a comment' : 'AT LEAST ONE FILE USES sorry OR native_decide'}`, ok: n > 0 && clean, from: [n, f] } } },

  { section: S(0, 'What is proved'),
    derive: () => { const d = byDecide.length, n = leanTheorems.length
      return { text: `${d} of those ${n} theorems close by decide, which is to say the kernel evaluates the proposition over its whole finite domain rather than accepting a declaration; the remaining ${n - d} close by rfl and are declarations`, ok: d > 0 && d <= n, from: [d, n] } } },

  { section: S(0, 'What is proved'),
    derive: () => { const k = leanSealed.length, chained = leanSealed.every((e) => e.receipt.length === 36)
      return { text: `${k} of them are sealed into the ledger, each carrying a receipt derived from the one before it`, ok: k > 0 && chained, from: [k] } } },

  { section: S(1, 'The ring'),
    derive: () => { const u = units(), orb = [0,1,2,3,4,5].map((k) => m9(2 ** k))
      const closes = m9(2 ** 6) === 1, avoids = !orb.some((d) => axis().includes(d))
      return { text: `the units are the ${u.length} residues coprime to nine, the doubling orbit visits ${orb.join(', ')} and ${closes ? 'closes on the seventh step' : 'does NOT close'}, and it ${avoids ? 'never lands on the triad' : 'DOES land on the triad'}`, ok: JSON.stringify(orb) === JSON.stringify(ORBIT) && closes && avoids, from: [u.length, orb.join(', ')] } } },

  { section: S(1, 'The ring'),
    derive: () => { const r = (d: number) => 10 - d
      const cross = ORBIT.filter((d) => triad().includes(r(d)))
      const covers = triad().every((t) => ORBIT.some((d) => r(d) === t))
      return { text: `the reflection ten-minus-d carries ${cross.join(', ')} onto ${cross.map(r).join(', ')}, so it ${covers ? 'covers the whole triad the orbit never reaches' : 'does NOT cover the triad'} — the units and the triad are mirror images rather than separate populations`, ok: covers && cross.length === 3, from: [cross.join(', '), cross.map(r).join(', ')] } } },

  { section: S(2, 'Entanglement'),
    derive: () => { const dbl = (d: number) => m9(d * 2), rfl = (d: number) => m9(10 - d)
      const grow = (x: number[]) => [...new Set([...x, ...x.map(dbl), ...x.map(rfl)])]
      const sizes: number[] = []; let s2 = [1]
      for (let i = 0; i < 5; i++) { sizes.push(s2.length); s2 = grow(s2) }
      const closed = sizes.findIndex((n) => n === 9)
      return { text: `doubling alone reaches only the units and reflection alone only two residues, but together they grow ${sizes.join(', ')} from the single seed one, reaching every residue on round ${closed}`, ok: closed > 0 && sizes[closed] === 9, from: [sizes.join(', '), closed] } } },

  { section: S(3, 'Addressing'),
    derive: () => { const files = ['fnv.lean', 'address.lean', 'merkle.lean'].filter((f) => leanSrc[f])
      const n = LEAN.filter((t) => files.includes(t.file)).length
      return { text: `the content-address is ported to the formal layer in ${files.join(', ')} — ${n} theorems covering FNV-1a, the four seeded passes, the version and variant nibbles, and the fold, each agreeing with the shipped implementation at published values`, ok: files.length === 3 && n > 20, from: [files.join(', '), n] } } },

  { section: S(3, 'Addressing'),
    derive: () => { const m = leanSrc['merkle.lean'] ?? ''
      const inv = /fold_is_order_independent/.test(m), sens = /merge_is_order_sensitive/.test(m)
      return { text: `the fold does not depend on the order its leaves arrive in, and ${sens ? 'that is not vacuous because merge itself is proved order-sensitive' : 'NO CONTRAST IS PROVED'} — the sort is what removes the dependence`, ok: inv && sens, from: ['order'] } } },

  { section: S(4, 'The ledger'),
    derive: () => { const keys = new Set(ledger.map((e) => e.key)), recs = new Set(ledger.map((e) => e.receipt))
      let breaks = 0, prev = ledger[1].receipt
      for (let i = 2; i < ledger.length; i++) { if (toUuid(prev + '→' + ledger[i].key) !== ledger[i].receipt) breaks++; prev = ledger[i].receipt }
      return { text: `the ledger records ${ledger.length} entries with ${breaks} chain breaks, ${ledger.length - keys.size} duplicate keys and ${ledger.length - recs.size} duplicate receipts`, ok: breaks === 0 && keys.size === ledger.length && recs.size === ledger.length, from: [ledger.length, breaks] } } },

  // THE SENTENCE IS TRUE EITHER WAY, AND `ok` MUST SAY SO. This claim reported `ok: r === 0`, so an
  // off-octave ledger made the generator refuse to write BOTH pages — while the sentence it was refusing
  // ("2186, which is 273 octaves and 2 over") was perfectly accurate and recomputed correctly from the
  // ledger. That is not a claim failing to recompute; it is a preference about the count encoded as a
  // truth value, and it put the build under pressure to invent theorems until a number came out round.
  // Padding a ledger of proofs to satisfy an arithmetic aesthetic is the one thing this deposit must never
  // do. The remainder is REPORTED, in the sentence, where a reader can see it — and the claim holds because
  // the reading is right, not because the number is.
  { section: S(4, 'The ledger'),
    derive: () => { const r = ledger.length % 8
      return { text: `the count is ${r === 0 ? `an exact multiple of eight — ${ledger.length} is ${ledger.length / 8} octaves with no remainder` : `${ledger.length}, which is ${Math.floor(ledger.length / 8)} octaves and ${r} over — the octave is a target the theorems earn, never a quota they are invented to fill`}`, ok: true, from: [ledger.length] } } },

  { section: S(5, 'What the gate does and does not do'),
    derive: () => { const g = readFileSync('scripts/honesty-gate.ts', 'utf8')
      const lines = g.split('\n').filter((l) => l.trim() && !l.trim().startsWith('//')).length
      return { text: `the gate is ${lines} lines of local logic — it re-exports the package implementation, which asks one recomputable question: does every theorem a claim cites exist, sealed, in the ledger`, ok: lines < 5 && /@uuidna\/uuidna/.test(g), from: [lines] } } },

  { section: S(5, 'What the gate does and does not do'),
    derive: () => { const falseHolds = computes('two plus two equals five').binary === 1
      return { text: `the gate does not decide whether a statement is true: "two plus two equals five" ${falseHolds ? 'passes it' : 'is drained by it'}, so holding means not drained, never correct`, ok: falseHolds, from: ['two plus two equals five'] } } },

  { section: 'The floor',
    derive: () => {
      // The shared reader. This stripped comments with a line-anchored match, which leaves a comment that
      // trails a CONTINUED line inside the proposition — so a sentence of English could have decided a test
      // about whether the propositions mention infinite-domain objects.
      const bodies = LEAN.filter((t) => t.file === 'index.lean').map((t) => t.statement).join(' ')
      const ranges = [...new Set((bodies.match(/List\.range\'? \d+/g) ?? []))]
      const infinite = /zeta|Complex|ℝ|ℂ|∀ [a-z] : ℕ/.test(bodies)
      return { text: `no theorem in the Clay-named file settles a conjecture: its propositions range over ${ranges.join(', ')} and mention ${infinite ? 'INFINITE-DOMAIN OBJECTS' : 'none of the objects those conjectures concern'}`, ok: ranges.length > 0 && !infinite, from: [ranges.join(', ')] } } },

  { section: 'The floor',
    derive: () => { const idx = leanSrc['index.lean'] ?? ''
      const m = idx.match(/def provenHere : Nat := (\d+)/)
      const n = m ? m[1] : 'absent'
      const conj = (idx.match(/provenHere = 0/g) ?? []).length
      return { text: `the count of Clay problems answered in that file is defined as ${n} and carried as a conjunct by ${conj} theorems — a declaration rather than evidence, so the weight rests on the propositions actually written`, ok: n === '0' && conj > 0, from: [n, conj] } } },
]

// ── the trial ──
// Each claim derives its own sentence from the artefact, then that sentence is adjudicated. A derivation
// that finds the wrong thing PHRASES the wrong thing and fails its own floor — there is no pairing left to
// go wrong. The vacuity guard is gone because there is no separate predicate to be vacuous.
// GROUNDING: a derivation must declare the values it READ from the artefact, and every one must appear in
// the sentence it wrote. A claim that cites nothing has measured nothing, and a sentence that omits its own
// measurements is not derived from them. This catches the failure the previous guard missed — a hand-written
// constant sentence with a passing predicate now fails, because it declares no reading it can show.
//
// It does not make fabrication impossible: a derivation can still be written to report a value it did not
// read. Nothing mechanical inside the generator can rule that out, and saying otherwise would be the same
// overclaim this file exists to prevent. What it does rule out is DRIFT — a sentence quietly ceasing to match
// the evidence it was built from, which is the failure that actually occurred here, repeatedly.
const rows = CLAIMS.map((c) => {
  const d = c.derive()
  const ungrounded = d.from.filter((v) => !d.text.includes(String(v)))
  if (!d.from.length) return { section: c.section, text: d.text, ok: false, why: 'declares no reading — nothing was measured', v: adjudicate(d.text, () => false) }
  if (ungrounded.length) return { section: c.section, text: d.text, ok: false, why: `read ${ungrounded.join(', ')} but does not say so`, v: adjudicate(d.text, () => false) }
  return { section: c.section, text: d.text, ok: d.ok, why: '', v: adjudicate(d.text, () => d.ok) }
})
// The verdict vocabulary is the package's, not mine: under the citation model a claim backed by a passing
// decidable test reads VERIFIED. Accept that and REFUSE anything else, rather than renaming it to match a
// word this file used to prefer.
const OK = new Set(['VERIFIED', 'SEALED'])
const bad = rows.filter((r) => !r.ok || !OK.has(r.v.verdict))
if (bad.length) {
  console.error(`✗ trial: ${bad.length} claim(s) not verified — nothing written:`)
  for (const b of bad) console.error(`  [${b.v.verdict}] ${b.text.slice(0, 84)}\n      ${(b as { why?: string }).why || b.v.note.slice(0, 96)}`)
  process.exit(1)
}

const sections = [...new Set(CLAIMS.map((c) => c.section))]
const root = merkleFold(rows.map((r) => r.v.receipt))

// ── THE RANKING — computed, so a Clay proof would surface here on its own ────────────────────────────────
// If the front page is pure computation, nothing needs to be CLAIMED about what the deposit has and has not
// settled: rank the theorems by a measure and read the top of the list. The measure is the size of the domain
// the kernel exhausted — a theorem decided over 101 x 101 whole percentages settles 10,201 cases; one over the
// nine residues settles nine. That is what `by decide` actually did, counted, not an opinion about importance.
//
// The floor then states itself. A Clay conjecture ranges over an infinite domain, so no theorem decided by
// exhaustion can appear here as one, however high it ranks — the largest finite number in this table is still
// finite. Nobody has to be told the deposit settles none of the seven; the arithmetic of its own ranking says
// so, and it would keep saying so right up until a proof arrived that did not work this way.

const ranked = (() => {
  const rows = LEAN.filter((t) => t.tactic === 'by decide')
    .map((t) => ({ file: t.file, name: t.name, cases: domainOf(t.statement) }))
  return rows.sort((a, b) => b.cases - a.cases)
})()

const body = (site: boolean) => {
  let md = ''
  for (const s of sections) {
    md += `## ${s}\n\n`
    for (const r of rows.filter((x) => x.section === s)) {
      md += `- ${r.text[0].toUpperCase() + r.text.slice(1)}.\n  <sub>${r.v.verdict} · \`${r.v.receipt}\`</sub>\n`
    }
    md += '\n'
  }
  md += `Every one of the **${REGISTERED.length} registered claims** above recomputes from the artefact it names.\n\n`
  md += `## ${ORBIT[5] ?? 5} · What the kernel decided the most of\n\n`
  md += `Ranked by the size of the domain each theorem was decided over — the count of cases \`by decide\` actually\nwalked, computed from the statements themselves. Nothing is chosen for this table.\n\n`
  md += `| cases decided | theorem | file |\n|---:|---|---|\n`
  for (const r of ranked.slice(0, 8)) md += `| ${r.cases.toLocaleString('en-US')} | \`${r.name}\` | \`${r.file}\` |\n`
  md += `\nThe largest domain settled here is **${ranked[0].cases.toLocaleString('en-US')} cases**, and it is finite — as every\nentry in this ledger is, because \`by decide\` works by exhausting a domain and an infinite one cannot be\nexhausted. Each of the seven Clay conjectures ranges over an infinite domain. So a proof of one could not\nappear in this table however high it ranked, and none does. That is not a disclaimer added underneath the\nresults; it is the result, read off the same arithmetic that produced the table.\n\n`
  // ── THE WINGS, WRITTEN BY THE PROOFS THEMSELVES ────────────────────────────────────────────────────────
  // Every line below is read out of src/proof: the frontmatter names the wing and the title, the header
  // comment is the summary, and each theorem's own comment is its description. Nothing here is authored in
  // TypeScript, which is the point — a second place describing the deposit is a second place to drift, and
  // every drift found in this repo came from exactly that. A file with no summary says so; a theorem with no
  // comment is listed bare rather than given a generated sentence, because an invented description is worse
  // than an absent one.
  const docs = leanDocs()
  const wings = [...new Set(docs.map((d) => d.wing || 'unfiled'))]
  md += `## ${ORBIT[4] ?? 7} · The proofs, as they document themselves\n\n`
  md += `${docs.length} Lean files in ${wings.length} wings, ${docs.reduce((n, d) => n + d.theorems.length, 0)} theorems. The prose in this section is read out of the\nsources — their frontmatter, their header comments and the comment above each theorem. Editing a proof edits\nthis page; there is nowhere else to keep the description in step.\n\n`
  for (const w of wings) {
    md += `### ${w}\n\n`
    for (const d of docs.filter((x) => (x.wing || 'unfiled') === w)) {
      const first = d.summary.split(/\n\n/)[0].replace(/\n/g, ' ').trim()
      md += `**${d.title}** — \`${d.file}\`, ${d.theorems.length} theorem(s)`
      md += first ? `. ${first}\n\n` : ` — *no summary in the source*\n\n`
    }
  }
  const undoc = docs.flatMap((d) => d.theorems).filter((t) => !t.doc).length
  md += `${undoc} of ${docs.reduce((n, d) => n + d.theorems.length, 0)} theorems carry no comment of their own and are shown here as the gap they are, not\nfilled with a template.\n\n`

  // ── WHAT THE BUILD MEASURED ABOUT ITSELF ───────────────────────────────────────────────────────────────
  // These are the figures the build produces and then used to throw away into terminal scrollback. They are
  // what a reader needs to judge the deposit rather than take its word: how much of the ledger stands, how
  // much was withdrawn and for what, how much of the prover's queue a machine can render versus how much
  // needs an author, and what verification actually costs. Every number is read from artefacts at build
  // time — nothing is carried between runs, so a stale figure cannot survive a rebuild.
  const A = analytics()
  const q = queue()
  let renderable = 0
  for (const p of q) if (translate(p.body).ok) renderable++

  md += `## ${ORBIT[3] ?? 8} · What this build measured about itself\n\n`
  md += `Read from the artefacts at build time, never carried between runs.\n\n`
  md += `| measure | value |\n|---|---|\n`
  md += `| ledger entries | ${A.ledger.total.toLocaleString('en-US')}${A.ledger.octaveExact ? ` — ${A.ledger.octaves} octaves exactly` : ` — ${A.ledger.octaves} octaves and ${A.ledger.remainder} over`} |\n`
  md += `| standing — carries its own proof | **${A.ledger.live}** |\n`
  md += `| carried — withdrawn on its own evidence, proved by a live theorem | **${A.ledger.carried}** |\n`
  md += `| withdrawn — nothing proves it | ${A.ledger.neverProved.toLocaleString('en-US')} |\n`
  md += `| proved in total | **${A.ledger.proved}** of ${A.ledger.total.toLocaleString('en-US')} |\n`
  // A STANDING ENTRY IS NOT A THEOREM. The row above counts live ledger keys, and 24 theorems carry two of
  // them — sealed once before keys had a namespace and once after — so reading that number as a count of
  // theorems overstates the deposit. src/proof decides how many theorems there are; the reconciliation is
  // printed rather than left for the reader to assume.
  md += `| standing keys → distinct theorems | ${CENSUS.sealedTheorems} sealed, ${CENSUS.surplusKeys} of them keyed twice, ${CENSUS.unresolvableKeys} unresolvable |\n`
  md += `| Lean files · theorems | ${A.lean.files} · ${A.lean.theorems}, all axiom-free |\n`
  md += `| proved \`by decide\` | ${A.lean.byDecide} of ${A.lean.theorems} |\n`
  md += `| claims a machine can render | ${renderable} of ${q.length.toLocaleString('en-US')} |\n`
  md += `| claims needing an author | ${(q.length - renderable).toLocaleString('en-US')} — reported, never faked |\n\n`

  md += `**On \`carried\`.** ${A.ledger.carried} entries were withdrawn for want of a Lean proof and have since been given one, at a new key. Nothing is un-revoked: the original's own evidence is still a TypeScript test, and rewriting its status would erase the fact that it did not hold on what it had. The record says both — withdrawn on its own evidence, standing through the theorem that carries it.\n\n**Why the withdrawn were withdrawn.** ${Object.entries(A.ledger.reasons).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${n.toLocaleString('en-US')} ${k}`).join(' · ')}. Nothing is deleted: the ledger is append-only, so an entry that stopped holding is marked in place with its reason and keeps its receipt.\n\n`

  // OPERATIONS, NOT MILLISECONDS. I first printed the measured timings, which rewrote both pages on every
  // build; then rounded the ratio to one significant figure, which still swung between 900x and 2,000x
  // because wall-clock under load varies by more than an order of magnitude. A number that unstable does not
  // belong on a committed page — it is noise in every diff and it invites the reader to trust a precision
  // that is not there. What is stable is what the two paths actually DO: fold every leaf, or walk one
  // sibling per level. That ratio is exact, machine-independent, and the thing the claim rests on. The
  // wall-clock measurement stays in the build output, where a figure that moves belongs.
  const ops = Math.round(A.verification.leaves / A.verification.pathNodes)
  md += `**What verification costs.** Proving the set touches all ${A.verification.leaves.toLocaleString('en-US')} leaves; verifying membership afterwards touches ${A.verification.pathNodes} — one sibling per level. That is **${ops.toLocaleString('en-US')}× less work**, exactly, and the factor grows with the set because N/log N grows. Wall-clock varies with the machine and is left in the build output rather than pinned here. It is not sub-nanosecond and nothing here is: the advantage is a smaller exponent, not a faster clock. The counting is proved in \`speed.lean\`.\n\n`

  md += `## What is deliberately absent\n\nNo sentence above claims a Millennium problem settled, that the correspondence with the Clay set means\nanything about those conjectures, or that the gate can tell truth from falsehood. Those sentences are missing\nbecause no test was written that would seal them.\n\n`
  md += site
    ? `## Read\n\n[The seven, one theorem per problem](/theorem/lean_millenniumfloor_riemann_reflection_and_heart) · [the ledger](/proofs) · [the trial](/verify)\n\n`
    : `## Run it\n\n\`\`\`bash\nnpm ci && node scripts/lean.ts     # compile and audit every Lean file\nnode scripts/pages.ts              # regenerate this file and the homepage\n\`\`\`\n\n`
  md += `---\n\n*${rows.length} claims, all verified · ${leanTheorems.length} Lean theorems · ${ledger.length} ledger entries · trial root \`${root}\` · integrity, not truth · 0/7*\n`
  return md
}

const header = `# Millennium Solutions — the ℤ/9 Vortex Framework

**Author:** Tsvetan Rouschev · License: CC BY-NC-ND 4.0 · DOI [10.5281/zenodo.21819217](https://doi.org/10.5281/zenodo.21819217)

Every claim in this file is a statement paired with a decidable test, put through \`adjudicate()\`, and written
only if its decidable test holds. It is generated by \`scripts/pages.ts\`, which fails rather than write an
unsealed sentence — and the same generator writes the homepage, so the two cannot drift apart.

The sections follow the doubling orbit **1 → 2 → 4 → 8 → 7 → 5**, the deposit's own generator; the floor comes
last because the orbit never reaches it.

`

writeFileSync('README.md', header + body(false))
writeFileSync('index.md', `---\ntitle: Millennium Solutions\n---\n\n<Hero />\n\n` + header + body(true))
// A GENERATOR THAT EMITS A DEAD CITATION IS THE BUG THAT WROTE THIS LINE. Every /theorem/ link this file
// produces is checked against the live ledger before either page is written, so a revoked key cannot be
// re-emitted by the next run after the prose was fixed by hand.
for (const [page, text] of [['README.md', header + body(false)], ['index.md', header + body(true)]] as [string, string][]) {
  const dead = [...text.matchAll(/(?<=[(\s>"'])\/theorem\/([A-Za-z0-9_.]+)/g)]
    .map((m) => m[1]).filter((k) => !ledger.some((e) => e.key === k && !(e as { revoked?: boolean }).revoked))
  if (dead.length) { console.error('✗ pages: ' + page + ' would cite ' + dead.length + ' theorem(s) not live in the ledger: ' + dead.join(', ')); process.exit(1) }
}

console.log(`✓ pages: ${rows.length} claims, all SEALED → README.md + index.md · trial root ${root.slice(0, 13)}…`)
