// Dynamic route: one page per theorem (a stable, referrer-able URL /theorem/<key>), from ONE template.
// Two sources feed the same template:
//   • src/proof/discovered.json — the ℤ/9 discovery ledger (computed by exhaustion), and
//   • the seven Millennium-floor theorems in src/proof/index.lean — each carrying its Lean proof in
//     publication form and a link to the qualified outlet (Clay Mathematics Institute; Perelman's arXiv).
// Each page also carries the hues of its SURROUNDING theorems so its hero background is computed by the
// neighbourhood — the mesh, seen locally. The Lean proof text is READ FROM index.lean (single source), and
// every receipt is the content-address of the exact statement (reproducible by anyone via toUuid).
import { readFileSync } from 'node:fs'
import { toUuid } from '../src/0/index.ts'
import { leanTheorems, theoremOfKey, domainOf } from '../src/api/index.ts'
import { publicationHtml, NOVELTY, kinds, closureOf, creditedIn } from '../src/publication/index.ts'
import { treeOf } from '../src/quantum/tree.ts'
import { MILLENNIUM } from '../src/millennium/index.ts'
import { toLatex, toMathML } from '../src/latex/index.ts'

// EVERY Lean-backed page carries its own formula, not only the seven. The seven Millennium pages had a
// typeset statement and every other theorem in src/proof had prose about a proof the reader could not see, so
// the page could not be read as a paper and printed as one. The statement is read from the .lean source
// through the same matcher the ledger uses (theoremOfKey), so a page cannot show a formula that is not
// the one the kernel checked, and a key with no theorem shows no formula rather than a template.
const THMS = leanTheorems()
const formulaOf = (key: string) => {
  const t = theoremOfKey(key, THMS)
  if (t) return {
    statement: t.statement, tactic: t.tactic, leanFile: t.file, cases: domainOf(t.statement), ambiguous: '',
    mathml: toMathML(t.statement) ?? '', latex: toLatex(t.statement) ?? '',
    // The parse tree, serialised for the three.js figure. Derived from the statement, and the same parse
    // scripts/latex-gate round-trips against the Lean source — so the shape on the page is the proposition.
    treeNodes: JSON.stringify(treeOf(t.statement) ?? []),
    // THE SAME BODY THE ZENODO RECORD CARRIES. Built once in src/publication and rendered in both places,
    // because two descriptions of one theorem maintained separately had already drifted into disagreeing
    // in public about how many cases it walked. scripts/zenodo-gate.ts compares them byte for byte.
    publication: publicationHtml(t, {
      novelty: creditedIn(t.file).get(t.name)
        ? `Prior art: NAMED AND CREDITED for this declaration specifically. ${creditedIn(t.file).get(t.name)} `
          + `The file it sits in is otherwise this deposit's own construction; this record claims no priority `
          + `over the earlier work it names.`
        : (NOVELTY[kinds().get(t.file) ?? '1'] ?? NOVELTY['1']),
      files: ['src/proof/' + t.file, ...closureOf(t.file).map((f) => 'src/proof/' + f)],
      key,
    }),
  }
  // A key that predates the namespace convention and names a theorem declared in more than one file cannot
  // be resolved to one statement. Showing nothing is correct and unhelpful; the page says which keys DO
  // resolve, so the reader can cite one of them instead of guessing the way the matcher used to.
  const bare = key.replace(/^lean_/, '')
  const shared = THMS.filter((x) => x.name === bare)
  return {
    statement: '', tactic: '', leanFile: '', cases: 0, mathml: '', latex: '', publication: '', treeNodes: '[]',
    ambiguous: shared.length > 1 ? shared.map((x) => `lean_${x.namespace.toLowerCase()}_${x.name} (src/proof/${x.file})`).join(' · ') : '',
  }
}

const hueOf = (rec: string) => (parseInt(rec.replace(/-/g, '').slice(0, 2), 16) * 40) % 360
const withHues = <T extends { receipt: string }>(list: T[], i: number, N: number) => {
  const hues: number[] = []
  for (let k = -3; k <= 3; k++) hues.push(hueOf(list[(i + k + N) % N].receipt)) // 7 surrounding theorems
  return hues.join(',')
}


// read each theorem's exact statement+proof from index.lean — Lean is the single source of the proof
const leanSrc = readFileSync('src/proof/index.lean', 'utf8')
const extractLean = (key: string): string => {
  const m = leanSrc.match(new RegExp('theorem\\s+' + key + '\\s*:([\\s\\S]*?):= by decide'))
  return m ? ('theorem ' + key + ' :' + m[1] + ':= by decide').replace(/[ \t]+$/gm, '') : ''
}

export default {
  paths() {
    // 1 · the discovery ledger — unchanged
    const ledger: { key: string; name: string; receipt: string; revoked?: boolean; reason?: string; supersededBy?: string }[] =
      JSON.parse(readFileSync('src/proof/discovered.json', 'utf8'))
    const N = ledger.length
    // A REVOKED ENTRY KEEPS ITS PAGE AND MUST SAY SO. The record is append-only, so the URL stays resolvable
    // and the receipt stays checkable — but the template's standing claims ("re-verified on every build", "if
    // it ever stopped holding the build would fail") are FALSE of an entry that stopped holding. The page
    // carries the revocation and its reason, and the template suppresses those claims. A page that presents a
    // withdrawn theorem as live is the exact overclaim this deposit exists to refuse.
    const discovered = ledger.map((e, i) => ({
      params: {
        key: e.key, name: e.name, receipt: e.receipt, hues: withHues(ledger, i, N),
        revoked: e.revoked === true, reason: e.reason ?? '', supersededBy: e.supersededBy ?? '',
        ...formulaOf(e.key),
      },
    }))

    // 2 · the seven Millennium-floor theorems — Lean proof (from index.lean) + qualified outlet, one template
    const seven = Object.keys(MILLENNIUM).map((key) => {
      const meta = MILLENNIUM[key]
      const lean = extractLean(key)
      return { key, name: meta.name, receipt: toUuid('millennium:' + key + '\n' + lean), meta, lean }
    })
    const S = seven.length
    const millennium = seven.map((e, i) => ({
      params: {
        key: e.key, name: e.name, receipt: e.receipt, hues: withHues(seven, i, S),
        lean: e.lean, problem: e.meta.problem, bound: e.meta.bound,
        outlet: e.meta.outlet, outletName: e.meta.outletName,
        outlet2: e.meta.outlet2 ?? '', outlet2Name: e.meta.outlet2Name ?? '',
      },
    }))

    return [...discovered, ...millennium]
  },
}
