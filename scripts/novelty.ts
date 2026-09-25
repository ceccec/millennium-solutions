#!/usr/bin/env node
// NOVELTY — a prior-art search for every theorem, performed and recorded: the per-theorem half of the table.
//
// src/proof/priorart.lean classifies the 33 SOURCE FILES: 32 restate named work, one is the deposit's own table,
// and none is `none-known` — the only kind allowed to claim novelty, because it requires "a named prior-art search
// that was performed and found nothing". Until now no such search had been performed for any single theorem:
// a file is `named` because the ℤ/9 arithmetic under it is Euler's, while a statement inside it may have no
// earlier author at all, and nothing looked. The author asked for novelty discovery at scale; this is it.
//
// For every theorem in the tree — the kernel's declarations less the ones that close by rfl, which the seal
// calls declarations, not theorems; the counts are derived per run and printed, never written here — with no
// key and no account:
//   OEIS       — every integer list in the statement that could be a sequence (not a hash digest, not ASCII
//                text, not a constant run) is looked up by its terms: the most exact prior-art check there is;
//   zbMATH Open, OpenAlex, Crossref, arXiv — the theorem's own terms, with its file's declared domain.
// A hit is RELEVANT when it carries most of the theorem's distinctive terms AND a specific word of its file's domain.
// The OEIS result is recorded beside the verdict, not as one: a sequence being catalogued credits the SEQUENCE by its
// A-number, and says nothing about what the theorem claims of it. The verdict is the literature's, per theorem:
//   CANDIDATES    relevant literature to read before anything is claimed;
//   NONE_FOUND    every source answered and nothing relevant came back. This is the exact content of kind 2 —
//                 "these searches, on this date, returned nothing" — and NOT "nothing earlier exists": a search
//                 by keywords can miss what it does not name. It is recorded with what, where and when.
//   NOT_MEASURED  a source did not answer; nothing is concluded.
//
// INCREMENTAL, so it can run every week at this scale: src/proof/novelty.json is keyed by the theorem's ledger key
// and carries the hash of the statement it searched. A theorem is searched again only when its statement changed
// or its record is older than --days. The file is written every ten theorems, so a long run resumes.
//
//   node scripts/novelty.ts                     search what is new, changed or stale (default: older than 30 days)
//   node scripts/novelty.ts --limit N           at most N theorems this run
//   node scripts/novelty.ts --only flow.lean    one source file
//   node scripts/novelty.ts --all               search everything again
//   --days N · --summary <file.md>
import { readFileSync, writeFileSync, existsSync, appendFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { leanTheorems } from '../src/api/index.ts'
import { stripTags } from '../src/html/index.ts'
import { arg } from '../src/cli/index.ts'

const OUT = 'src/proof/novelty.json'
const LIMIT = Number(arg('--limit') ?? Infinity), DAYS = Number(arg('--days') ?? 30), ONLY = arg('--only'), ALL = process.argv.includes('--all')
// A BUDGET, BECAUSE A BATCH SIZE IS A GUESS. `--limit 8` was a number somebody picked, and the thing it was
// standing in for is TIME: every theorem costs four paced source calls plus an OEIS lookup, and how many fit
// depends on how the sources answer that hour, not on a count chosen in advance. `--minutes` spends a real
// budget and stops on a whole theorem, so a scheduled run fills whatever its job allows and the next one
// resumes — the record grows by itself instead of when somebody remembers to pick a number.
const BUDGET_MS = arg('--minutes') ? Number(arg('--minutes')) * 60_000 : Infinity
const startedAt = Date.now()
// ── THE SEARCH ITSELF LIVES IN src/novelty, SO THE PUBLIC CAN RUN IT ─────────────────────────────────────
// The five sources, the backoff, the term extraction, the relevance floor and the OEIS sequence filter used
// to be defined here, which made this script the only thing able to perform the search whose recorded
// answers priorart.lean's kind 2 rests on — a reader could read the verdict and could not ask the question.
// The core is in src/novelty/index.ts now, this script is one caller and the MCP server is the other.
// Nothing changed about what a search does; what changed is who can run one. What stays here is the part
// that is about THIS TREE: a theorem's file, its declared domain, and the anchors that domain implies.
import { LIMITS, SOURCES, get, q, relevance, sequencesIn, termsOf, LABELS, GENERIC, NUMBER_THEORY, type Hit } from '../src/novelty/index.ts'
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))


// ── THE FLOORS THIS SEARCH APPLIES, TYPED OUT BECAUSE THEY ARE CHOICES ────────────────────────────────────
// A verdict of NONE_FOUND was published as "every source answered and nothing relevant came back". It never
// said what RELEVANT meant, or how much of each source was looked at. It meant: nothing scoring at or above
// 0.6 word-overlap, among the first 5 results each source returned. Those two numbers decide a prior-art
// claim, and neither appeared anywhere in the record — a reader could not tell how narrow the search was,
// and neither could the next run.
//
// THEY CANNOT BE DERIVED, and pretending otherwise would be worse than typing them. There is no fact about
// this ring, or about the literature, that fixes where "relevant" begins; any number here is a judgement
// about how much noise to accept. So they get the treatment theology.lean gives its one typed list: written
// out AS a choice, carried in every row they produce, and stated in the report — so the verdict can never be
// read apart from the domain that made it. A floor you can see is a floor a reader can disagree with.


// ── the theorem's own terms, and its file's declared domain ───────────────────────────────────────────────────────
const anchorCache = new Map<string, string[]>()
const anchorsOf = (file: string): string[] => {
  if (!anchorCache.has(file)) {
    const line = readFileSync(`src/proof/${file}`, 'utf8').split('\n').find((l) => /^--\s*prior_art_domain:/.test(l)) ?? ''
    anchorCache.set(file, /number theory|modular|ℤ\/9|Z\/9|unit group|residue|digital root|sequences|group theory/i.test(line)
      ? NUMBER_THEORY : domainOf(file).filter((w) => w.length >= 5))
  }
  return anchorCache.get(file)!
}
const domainCache = new Map<string, string[]>()
const domainOf = (file: string) => {
  if (!domainCache.has(file)) {
    const line = readFileSync(`src/proof/${file}`, 'utf8').split('\n').find((l) => /^--\s*prior_art_domain:/.test(l)) ?? ''
    domainCache.set(file, termsOf(line.replace(/^--\s*prior_art_domain:\s*/, '').replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, '_')).filter((w) => !GENERIC.has(w)).slice(0, 4))
  }
  return domainCache.get(file)!
}
// ── the record ───────────────────────────────────────────────────────────────────────────────────────────────────
type Verdict = 'CANDIDATES' | 'NONE_FOUND' | 'NONE_FOUND_PARTIAL' | 'NOT_MEASURED' | 'TOO_FEW_TERMS'
type Rec = { key: string; file: string; name: string; statementHash: string; searched: string; limits?: typeof LIMITS; queries: Record<string, string>
  notMeasured: string[]; oeis: { a: string; name: string; query: string }[]; catalogued: boolean; candidates: Hit[]; verdict: Verdict }
const ledger: Record<string, Rec> = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {}
const save = () => writeFileSync(OUT, JSON.stringify(Object.fromEntries(Object.entries(ledger).sort(([a], [b]) => a.localeCompare(b))), null, 1) + '\n')
const hash = (s: string) => createHash('sha256').update(s).digest('hex').slice(0, 16)
// A record a source did not answer is searched again on the next run, whatever its age: NOT_MEASURED is a gap, not a result.
const stale = (r: Rec | undefined, h: string) => ALL || !r || !r.limits || r.statementHash !== h || r.verdict === 'NOT_MEASURED' || r.verdict === 'NONE_FOUND_PARTIAL' || Date.now() - Date.parse(r.searched) > DAYS * 86400000

const eligible = leanTheorems().filter((t) => t.tactic !== 'rfl').length
const todo = leanTheorems().filter((t) => (!ONLY || t.file === ONLY) && t.tactic !== 'rfl')
  .map((t) => ({ t, key: `lean_${t.namespace.toLowerCase()}_${t.name}`, h: hash(t.statement) }))
  .filter(({ key, h }) => stale(ledger[key], h)).slice(0, LIMIT)
console.log(`novelty: ${todo.length} theorem(s) to search this run · ${Object.keys(ledger).length} already on record`)

// ── THE RECORD IS EVIDENCE, SO IT IS CHECKED BEFORE ANY SEARCH ────────────────────────────────────────────────────
// src/proof/novelty.json is what priorart.lean's kind 2 rests on — "these searches, on this date, returned
// nothing". Nothing checked the record itself. The only refusal this script had is the one at the very bottom, and
// it needs every endpoint it knows to go silent at once, so no mutation of any file in this tree can reach it:
// control-probe correctly reported `novelty` UNMEASURED rather than inert, which is a gate with no control and no
// way to write one. These two are decidable here, locally, in milliseconds, and both are the record contradicting
// itself rather than a guess about what a search should have found:
//
//   HOLLOW — a row whose verdict claims a COMPLETED search while recording no query. A search that left no trace
//            of having run is not evidence that one ran; it is the unfalsifiable-check shape this repository hunts,
//            wearing the authority of a dated record.
//   ORPHAN — a row keyed to a theorem this tree does not hold. Evidence filed for a statement that is not here. It
//            survives a rename in silence, and renames are not rare: seven happened on 2026-09-18, and the reason
//            none of them orphaned a row is that the search had reached only 32 records by then — luck, not design.
//
// Measured on a clean tree on 2026-09-20: 32 rows on record, 0 hollow and 0 orphan, and the live key set they
// were checked against held 908 that day.
const CLAIMS_A_SEARCH = new Set<Verdict>(['NONE_FOUND', 'NONE_FOUND_PARTIAL'])
const liveKeys = new Set(leanTheorems().filter((t) => t.tactic !== 'rfl').map((t) => `lean_${t.namespace.toLowerCase()}_${t.name}`))
const hollowRows = Object.entries(ledger).filter(([, r]) => CLAIMS_A_SEARCH.has(r.verdict) && Object.keys(r.queries ?? {}).length === 0).map(([k]) => k)
const orphanRows = Object.keys(ledger).filter((k) => !liveKeys.has(k))
if (hollowRows.length || orphanRows.length) {
  if (hollowRows.length)
    console.log(`✗ novelty: ${OUT} holds ${hollowRows.length} record(s) that claim a completed search and record no query — ${hollowRows.slice(0, 3).join(', ')} — a search that left no trace of having run is not evidence that one ran`)
  if (orphanRows.length)
    console.log(`✗ novelty: ${OUT} holds ${orphanRows.length} record(s) keyed to a theorem this tree does not hold — ${orphanRows.slice(0, 3).join(', ')} — prior-art evidence filed for a statement that is not here`)
  process.exit(1)
}

// THREE REFUSALS IN A ROW AND A SOURCE IS LEFT FOR THE NEXT RUN — any source, not only arXiv. The first full run stalled
// on OpenAlex answering 429 to every call, each refusal costing ~100 s of backoff: hours spent learning nothing. A
// refusing source now costs seconds, its records say so, and the next run asks it again.
let measured = 0, n = 0
const refusals = new Map<string, number>()
const oeisSeen = new Map<string, { a: string; name: string; query: string }[] | Error>()
for (const { t, key, h } of todo) {
  // ── SEARCHED BY THE STATEMENT, NOT BY THE NAME ──────────────────────────────────────────────────────────
  // The query was built from the theorem's NAME, and this deposit names theorems as plain English
  // sentences. So `addressing_is_deterministic` searched for "addressing" and returned "Addressing
  // identity/redressing the museum"; `the_tens_complement_is_an_involution` searched for "reflection" and
  // returned "Glass Surface Detection: Leveraging Reflection Dynamics". Thirteen CANDIDATES for one file,
  // every one a collision with ordinary English.
  //
  // THE STATEMENT'S OWN IDENTIFIERS DO NOT FIX IT, and trying them is how the shape became clear: they are
  // `pow9`, `refl`, `isUnit`, `toUuidBytes` — this deposit's names for its objects, DEPOSIT-LOCAL BY
  // CONSTRUCTION, and no literature anywhere uses them. A search for `pow9` finds nothing and would record
  // NONE_FOUND, which is the false negative that looks like a discovery.
  //
  // What a statement actually offers the literature is two things, and both are used here. Its INTEGER
  // SEQUENCES, which the OEIS looks up by terms — the half of this search that already worked, and the half
  // that found A153130, "Period 6: repeat [1,2,4,8,7,5]", this deposit's own orbit already catalogued. And
  // the FIELD those objects belong to, which the file declares in `prior_art_domain` in the literature's
  // own language, because that line was written to be read by someone outside this tree.
  //
  // So the domain leads the query and the name follows it, contributing only terms long enough to be
  // distinctive. A name is a label its author chose; a domain is a claim about where the mathematics lives.
  const dom = domainOf(t.file)
  const fromName = termsOf(t.name).filter((w) => !LABELS.has(w) && !GENERIC.has(w) && w.length >= 5)
  const terms = [...dom, ...fromName.filter((w) => !dom.includes(w))]
  const query = [...dom.slice(0, 4), ...fromName.filter((w) => !dom.includes(w)).slice(0, 3)].join(' ')
  const rec: Rec = { key, file: t.file, name: t.name, statementHash: h, searched: new Date().toISOString(), limits: LIMITS, queries: {}, notMeasured: [], oeis: [], catalogued: false, candidates: [], verdict: 'NOT_MEASURED' }
  for (const seq of sequencesIn(t.statement)) {
    rec.queries[`oeis ${seq}`] = seq
    // ONE QUESTION PER SEQUENCE: the units 1,2,4,5,7,8 sit in 43 statements and would be asked 43 times.
    if (!oeisSeen.has(seq)) {
      try {
        const j = await get(`https://oeis.org/search?q=${q(seq)}&fmt=json`); measured++
        const rows = Array.isArray(j) ? j : (j?.results ?? [])
        // a sequence that merely CONTAINS the terms somewhere is not the statement's sequence: its data must begin with them
        oeisSeen.set(seq, (rows ?? []).filter((s: any) => String(s.data ?? '').replace(/\s+/g, '').startsWith(seq)).slice(0, 3)
          .map((s: any) => ({ a: `A${String(s.number).padStart(6, '0')}`, name: String(s.name ?? '').slice(0, 160), query: seq })))
      } catch (e) { oeisSeen.set(seq, new Error((e as Error).message)) }
      await sleep(1500)
    }
    const got = oeisSeen.get(seq)!
    if (got instanceof Error) rec.notMeasured.push(`oeis ${seq}: ${got.message}`); else rec.oeis.push(...got)
  }
  for (const [name, s] of Object.entries(SOURCES)) {
    rec.queries[name] = name === 'arxiv' ? terms.slice(0, 5).join(' AND ') : query
    if (terms.filter((w) => w.length >= 4).length < 2) continue
    if ((refusals.get(name) ?? 0) >= 3) { rec.notMeasured.push(`${name}: refusing this run (three refusals in a row) — retried next run`); continue }
    try {
      const hits = await s.run(terms, query); measured++; refusals.set(name, 0)
      // RELEVANT = most of the theorem's own terms AND a specific word of its file's domain, in the same hit.
      // RELEVANT = most of the theorem's own terms AND an anchor of its file's field; no anchor, no candidate claimed.
      const anchors = anchorsOf(t.file)
      rec.candidates.push(...hits.filter((x) => x.relevance >= LIMITS.relevanceFloor && anchors.length > 0 && anchors.some((a) => (x.text ?? '').toLowerCase().includes(a)))
        .map((x) => ({ ...x, text: (x.text ?? '').replace(/\s+/g, ' ').slice(0, 300) })))
    } catch (e) { rec.notMeasured.push(`${name}: ${(e as Error).message}`); refusals.set(name, (refusals.get(name) ?? 0) + 1) }
    await sleep(s.pace)
  }
  const searchable = terms.filter((w) => w.length >= 4).length >= 2
  rec.catalogued = rec.oeis.length > 0
  // ONE SOURCE DOWN IS NOT EVERY SOURCE DOWN. arXiv refused every call of the first trial, and the strict verdict filed
  // all of them NOT_MEASURED while zbMATH, OpenAlex and Crossref had answered. Three of four answering with nothing is
  // NONE_FOUND_PARTIAL — the missing source is named in the record, and the next run asks it again.
  const litMissing = rec.notMeasured.filter((m) => !m.startsWith('oeis')).length
  const oeisMissing = rec.notMeasured.some((m) => m.startsWith('oeis'))
  rec.verdict = rec.candidates.length ? 'CANDIDATES'
    : !searchable && !Object.keys(rec.queries).some((k) => k.startsWith('oeis')) ? 'TOO_FEW_TERMS'
    : !rec.notMeasured.length ? 'NONE_FOUND'
    : searchable && litMissing <= 1 && !oeisMissing ? 'NONE_FOUND_PARTIAL' : 'NOT_MEASURED'
  ledger[key] = rec
  if (++n % 10 === 0) { save(); console.log(`  … ${n}/${todo.length}`) }
  if (Date.now() - startedAt > BUDGET_MS) {
    save()
    console.log(`  … budget of ${(BUDGET_MS / 60_000).toFixed(0)} minute(s) spent after ${n} theorem(s); ${todo.length - n} of this run's queue remain and the next run resumes there`)
    break
  }
}
save()

// ── report ───────────────────────────────────────────────────────────────────────────────────────────────────────
const all = Object.values(ledger)
const by = (v: Verdict) => all.filter((r) => r.verdict === v)
const lines = [
  `## novelty — a prior-art search per theorem · ${new Date().toISOString().slice(0, 16)}Z`,
  `${all.length} theorems on record · searched this run: ${todo.length} · source calls answered: ${measured}`,
  // THE COVERAGE, STATED EVERY RUN. The per-theorem search had reached 32 of 924 and nothing said so on any
  // surface: a reader met the verdicts without meeting the fraction of the tree they cover. An incomplete
  // search is not a defect — stopping and not saying where you stopped is.
  `- coverage: ${all.length} of ${eligible} theorem(s) eligible for a per-theorem search have one on record `
  + `(${((100 * all.length) / eligible).toFixed(1)}%). The rest have not been searched, which is not the same as searched and found clear.`,
  `- every verdict below is relative to the floors this run applied: relevance ≥ ${LIMITS.relevanceFloor} over the first `
  + `${LIMITS.perSource} result(s) from each of ${LIMITS.sources.join(', ')}. They are choices, not findings — NONE_FOUND means `
  + `nothing cleared that floor in that many results, which is narrower than "nothing earlier exists". Rows carry the floors they were searched under.`,
  `- ${all.filter((r) => !r.limits).length} row(s) predate the floors being recorded and are re-searched on the next run, because a verdict whose domain is unknown is not a verdict`,
  `- CANDIDATES ${by('CANDIDATES').length} — relevant literature to read before anything is claimed`,
  `- NONE_FOUND ${by('NONE_FOUND').length} — every source answered and nothing relevant came back: these searches, on this date — not "nothing earlier exists"`,
  `- NONE_FOUND_PARTIAL ${by('NONE_FOUND_PARTIAL').length} — three of the four literature sources answered with nothing relevant; the fourth is named in the record and asked again next run`,
  `- NOT_MEASURED ${by('NOT_MEASURED').length} — too many sources did not answer; nothing concluded, and the next run searches it again`,
  `- TOO_FEW_TERMS ${by('TOO_FEW_TERMS').length} — the theorem's name gives fewer than two distinctive terms and its statement no sequence to look up`,
  `- beside the verdict: ${all.filter((r) => r.catalogued).length} statements carry a sequence catalogued in the OEIS — the sequence is credited by its A-number; the claim is judged by the verdict`,
]
for (const r of all.filter((x) => x.catalogued).slice(0, 12)) lines.push(`  - ${r.key}: ${r.oeis.map((o) => `${o.a} ${o.name.slice(0, 60)}`).join(' · ')}`)
const text = lines.join('\n')
console.log(text)
const summary = arg('--summary'); if (summary) appendFileSync(summary, text + '\n\n')
if (todo.length && !measured) { console.log('✗ novelty: no source answered anything — this run looked nowhere and is not a result'); process.exit(1) }
