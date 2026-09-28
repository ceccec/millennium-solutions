#!/usr/bin/env node
/** ── THE ENTANGLEMENTS, CHECKED AGAINST AN OUTSIDE CATALOGUE ───────────────────────────────────────────────
 *
 *  scripts/coils.ts decides that expressions from different subjects agree at every point of a shared grid.
 *  That is a proof about arithmetic and it is complete on its own terms. What it CANNOT do is establish that
 *  the identity was already known, or that the subjects it joins are ones anybody else recognises — those are
 *  claims about the literature, and a file deciding its own arithmetic has no access to them.
 *
 *  THE OEIS IS THE PUBLIC DATASET THAT SETTLES IT, and it is the right one for a specific reason: an OEIS
 *  entry does not merely hold a sequence, it enumerates the INDEPENDENT INTERPRETATIONS people have found for
 *  it, each with a name attached. So for every coil this asks the catalogue three questions:
 *
 *    1 · IS THE SEQUENCE THERE AT ALL? If a coil's terms match no catalogued sequence, the identity may still
 *        be true and is certainly not established as known. Reported, not hidden.
 *    2 · WHICH A-NUMBER, AND UNDER WHOSE NAME? The credit belongs to whoever catalogued it, and this deposit
 *        claims none of these sequences.
 *    3 · DOES THE ENTRY ITSELF SPAN FIELDS? An entry naming trees, brackets and triangulations is the
 *        catalogue agreeing that the subjects are joined — independently of my grid, by people who were not
 *        running this experiment. THAT is the corroboration, and it is not something I can manufacture.
 *
 *  WHAT A MATCH DOES NOT ESTABLISH. It does not make the identity true — the kernel did that. It does not make
 *  it interesting. And a NON-match is not a discovery: the OEIS is a catalogue and not the set of all true
 *  sequences, so "not found" means this search, on this date, with these terms.
 *
 *  CORROBORATION IS NOT CORRECTNESS, WHICH THIS TREE HAS LEARNED EXPENSIVELY. A broken CERN filter here once
 *  returned EXACTLY the API's own total and was believed BECAUSE the number agreed. So a match is checked for
 *  being the right KIND of agreement: the A-number's own terms are compared back against the computed ones,
 *  not just the search's willingness to return something.
 *
 *  NETWORK. Never in a build chain: an OEIS outage must not fail a build about this tree.
 *
 *    node scripts/entangle-oeis.ts            check every coil against the catalogue
 *    node scripts/entangle-oeis.ts --terms 10 how many terms to search on (default 8) */
import { DOM_EXPRS, ALL_DOMS } from '../src/entangle/index.ts'

const arg = (f: string) => { const i = process.argv.indexOf(f); return i > 0 ? process.argv[i + 1] : null }
const TERMS = Number(arg('--terms') ?? 8)
const N = Array.from({ length: 20 }, (_, i) => i + 1)
const UA = { 'User-Agent': 'millennium-solutions/entangle-oeis (+https://ceccec.psg.bg/millennium-solutions/; read-only)' }

// cluster exactly as coils.ts does, so this checks the same coils and not a different grouping
const by = new Map<string, typeof DOM_EXPRS>()
for (const e of DOM_EXPRS) { const k = N.map(e.at).join('|'); if (!by.has(k)) by.set(k, []); by.get(k)!.push(e) }
const coils = [...by.values()].filter((g) => g.length > 1).sort((a, b) => b.length - a.length)
const spanning = coils.filter((g) => new Set(g.map((e) => e.dom)).size > 1)

// FIELD WORDS, used only to ask whether the catalogue's OWN prose reaches outside one subject. A count of
// matches is a weak signal and is reported as one — it is not a verdict and nothing is gated on it.
const FIELDS: [string, RegExp][] = [
  ['combinatorics', /\b(subset|permutation|partition|composition|lattice path|binomial)\b/i],
  ['graphs/trees', /\b(tree|graph|vertex|vertices|edge|forest)\b/i],
  ['language/logic', /\b(word|string|grammar|parenthes|bracket|alphabet|expression)\b/i],
  ['geometry', /\b(polygon|triangulation|dissection|tiling|square|convex|diagonal)\b/i],
  ['biology', /\b(RNA|secondary structure|fold|gene|cell|population|rabbit)\b/i],
  ['physics/chem', /\b(quantum|energy|isomer|molecul|spin|particle|random walk)\b/i],
  ['music/art', /\b(music|chord|rhythm|scale|tone|ornament)\b/i],
  ['games/puzzles', /\b(game|puzzle|Hanoi|card|move|chess|domino)\b/i],
  ['computing', /\b(binary|bit|register|algorithm|stack|sort|Boolean)\b/i],
  ['number theory', /\b(prime|Mersenne|divisor|digit|modul|congruen)\b/i],
]

type Row = {
  coil: string[]; doms: string[]; terms: string
  found: boolean; anum?: string; oeisName?: string; termsAgree?: boolean; fields?: string[]; note?: string
  overlap?: number; divergeAt?: number
}

const ask = async (g: typeof DOM_EXPRS): Promise<Row> => {
  const doms = [...new Set(g.map((e) => e.dom))].sort()
  const mine = N.slice(0, TERMS).map((n) => g[0].at(n))
  const terms = mine.join(',')
  const base: Row = { coil: g.map((e) => `${e.dom}: ${e.say}`), doms, terms, found: false }
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 25_000)
  try {
    const res = await fetch(`https://oeis.org/search?q=${encodeURIComponent(terms)}&fmt=json`, { headers: UA, signal: ctl.signal })
    if (!res.ok) return { ...base, note: `HTTP ${res.status} — not measured` }
    const body = await res.text()
    let json: any
    try { json = JSON.parse(body) } catch { return { ...base, note: 'the catalogue did not return JSON — not measured' } }
    const hits = Array.isArray(json) ? json : (json.results ?? [])
    if (!hits.length) return { ...base, note: 'no catalogued sequence matches these terms — the identity may hold and is not established as KNOWN' }
    const h = hits[0]
    const anum = 'A' + String(h.number).padStart(6, '0')
    // THE CHECK THAT STOPS A FLATTERING MATCH. The catalogue's own terms are compared back against the
    // computed ones; a search that returns something is not a search that returned the right thing.
    //
    // A SLIDING WINDOW, BECAUSE AN OEIS SEQUENCE HAS ITS OWN OFFSET. The first version anchored on the first
    // OCCURRENCE of my first term and then compared forward — and that is wrong whenever the catalogue starts
    // at a different index or repeats a value. Catalan's data begins 1, 1, 2, 5 from n = 0 while this grid
    // starts at n = 1, so the anchor landed on the wrong 1 and the comparison failed on the next term.
    //
    // IT REJECTED FOUR CORRECT CORROBORATIONS: A000108 Catalan, A000142 factorial, A000041 partitions and
    // A000110 Bell were each returned by the catalogue, each obviously right, and each reported as "the
    // search's willingness to answer, not an agreement". The verdict was the careful-sounding one, which is
    // exactly why it needed checking — a check that errs toward refusing evidence still errs, and it was only
    // caught because the A-numbers were recognisable. A less familiar sequence would have stayed rejected.
    // SEARCH NARROW, VERIFY WIDE — and the first version did only the first half. Searching on 8 terms and
    // accepting the hit produced TWO FALSE CORROBORATIONS, both flattering:
    //   · A007337 "Signature sequence of sqrt(3)" was returned for (7n mod 12). Its first eight terms happen
    //     to be 7,2,9,4,11,6,1,8 and then it goes somewhere else entirely. A periodic sequence and an
    //     unrelated one can share any prefix you like.
    //   · A000027 "The positive integers" was returned for the digit root, because the digit root of 1..8 IS
    //     1..8. They first differ at n = 9, one term past the window.
    // Eight terms cannot distinguish a sequence from something that merely starts like it, and the verdict
    // 16 of 16 was better-looking than the evidence. So the match is now checked against EVERY term of the
    // grid that the catalogue is long enough to cover, and a coil whose sequence diverges beyond the search
    // window is reported as diverging rather than as agreement.
    const catTerms = String(h.data ?? '').split(',').map((x: string) => x.trim()).filter(Boolean)
    const searched = mine.map(String)
    const full = N.map((n) => String(g[0].at(n)))
    const windowAt = catTerms.findIndex((_, k) =>
      k + searched.length <= catTerms.length && searched.every((v, i) => catTerms[k + i] === v))
    const agree = windowAt >= 0
    // how far the two can be compared, and whether they stay together over all of it
    const overlap = agree ? Math.min(full.length, catTerms.length - windowAt) : 0
    const deepAgree = agree && overlap >= searched.length
      && full.slice(0, overlap).every((v, i) => catTerms[windowAt + i] === v)
    const divergeAt = agree && !deepAgree
      ? full.slice(0, overlap).findIndex((v, i) => catTerms[windowAt + i] !== v) + 1
      : 0
    const prose = [h.name, ...(h.comment ?? []), ...(h.example ?? [])].join(' ')
    const fields = FIELDS.filter(([, re]) => re.test(prose)).map(([f]) => f)
    return { ...base, found: true, anum, oeisName: String(h.name ?? '').slice(0, 130),
      termsAgree: deepAgree, fields, overlap, divergeAt }
  } catch (e) {
    const m = e instanceof Error ? e.message : String(e)
    return { ...base, note: /abort/i.test(m) ? 'timed out at 25s — not measured, never "absent"' : m.slice(0, 90) }
  } finally { clearTimeout(t) }
}

console.log(`entangle-oeis: ${spanning.length} cross-domain coil(s) from ${DOM_EXPRS.length} expressions over ${ALL_DOMS.length} domains`)
console.log(`  each searched in the OEIS on its first ${TERMS} terms — the catalogue is the outside witness, and this deposit claims none of these sequences\n`)

// one at a time, politely: this is somebody else's server and a burst of parallel queries is a cost imposed
// on a free public catalogue for no gain — the whole run is a few seconds either way
const rows: Row[] = []
for (const g of spanning) { rows.push(await ask(g)); await new Promise((r) => setTimeout(r, 350)) }

let confirmed = 0, uncatalogued = 0, unmeasured = 0, mismatched = 0
for (const r of rows) {
  if (r.note) {
    console.log(`○ ${r.doms.join(' ↔ ')}`)
    console.log(`    terms ${r.terms}`)
    console.log(`    ${r.note}`)
    if (/no catalogued/.test(r.note)) uncatalogued++; else unmeasured++
  } else if (!r.termsAgree) {
    console.log(`✗ ${r.doms.join(' ↔ ')}`)
    console.log(`    terms ${r.terms}`)
    if (r.divergeAt) {
      console.log(`    ${r.anum} — ${r.oeisName}`)
      console.log(`    matched the ${TERMS} searched terms and then DIVERGES at term ${r.divergeAt}. A shared prefix is not`)
      console.log(`    a shared sequence, and this is the coincidence an 8-term search cannot see past.`)
    } else {
      console.log(`    ${r.anum} came back but its terms do not line up over the ${r.overlap ?? 0} comparable term(s) —`)
      console.log(`    the match is the search's willingness to answer, not an agreement.`)
    }
    console.log(`    Counted as NO corroboration. The identity still holds on the grid; it is not shown to be known.`)
    mismatched++
  } else {
    confirmed++
    console.log(`✓ ${r.doms.join(' ↔ ')}`)
    console.log(`    ${r.anum} — ${r.oeisName}`)
    console.log(`    terms ${r.terms} — and the catalogue agrees over all ${r.overlap} comparable term(s), not just the ${TERMS} searched`)
    console.log(`    the entry's prose reaches ${r.fields!.length} field(s): ${r.fields!.join(', ') || 'none this crude filter names'}`)
    console.log(`    joined here: ${r.coil.slice(0, 4).join(' · ')}${r.coil.length > 4 ? ` · +${r.coil.length - 4}` : ''}`)
  }
}

const multi = rows.filter((r) => r.termsAgree && (r.fields?.length ?? 0) > 1)
console.log(`\n── WHAT THE OUTSIDE CATALOGUE SAYS`)
console.log(`  ${confirmed} of ${rows.length} coil(s) match a catalogued sequence whose own terms line up`)
console.log(`  ${multi.length} of those carry entry prose reaching MORE THAN ONE field — the catalogue joining the same`)
console.log(`    subjects independently, written by people who were not running this experiment`)
if (uncatalogued) console.log(`  ${uncatalogued} coil(s) match NO catalogued sequence — true on the grid, not established as known`)
if (mismatched) console.log(`  ${mismatched} coil(s) got an answer that does not line up — counted as no corroboration, not as agreement`)
if (unmeasured) console.log(`  ${unmeasured} NOT MEASURED — one run, one network, today; never read as absence`)
console.log(`\n  A MATCH DOES NOT MAKE AN IDENTITY TRUE — the kernel did that, in src/proof/coils.lean, and it would`)
console.log(`  hold if every catalogue vanished. What a match adds is that the identity was already known and`)
console.log(`  that its cross-domain reach is somebody else's observation as well as this grid's. And a NON-match`)
console.log(`  adds nothing either way: the OEIS is a catalogue, not the set of all true sequences.`)
if (mismatched) process.exit(1)
