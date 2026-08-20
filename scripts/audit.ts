#!/usr/bin/env node
// THE ONE PROSE AUDIT — shared by seal.ts (the whole deposit) and precommit.ts (the staged subset), so the
// promise precommit has always made in its own comments ("seal green ⇒ precommit green") holds by
// construction instead of by two copies staying in step. They diverged once already; that is why this exists.
//
// A file is audited on two questions:
//   (1) CITATIONS — does every /theorem/KEY it cites name a theorem that is LIVE in this deposit's own
//       chain-verified ledger? The authority is src/proof/discovered.json, whose link-by-link integrity
//       forensics.ts proves separately. The packaged gate ships a disjoint ledger (1329 mul9_* keys, zero
//       overlap with ours) and answers "fabricated" for every key we hold, Lean-proven ones included — that
//       is a category error, not a verdict, so citations are decided here. A REVOKED entry is not citable:
//       it keeps its receipt in the append-only record, but it no longer stands.
//   (2) PROSE — whatever the packaged gate can still judge, on text with the citations and fenced source
//       removed. A code fence is source, not an assertion: showing a proof is not making a claim, and the
//       gate reads Lean declaration syntax (`theorem foo :`) as a citation.
import { readFileSync } from 'node:fs'
import { computes } from './honesty-gate.ts'

const LEDGER: { key: string; revoked?: boolean }[] = JSON.parse(readFileSync('src/proof/discovered.json', 'utf8'))
export const LIVE = new Set(LEDGER.filter((e) => !e.revoked).map((e) => e.key))
export const GONE = new Set(LEDGER.filter((e) => e.revoked).map((e) => e.key))

// A citation is /theorem/KEY in URL POSITION — after "(", whitespace, ">" or a quote. That excludes a path
// segment like ./src/the/theorem/index.ts, where "/theorem/" follows a word character. Markdown links and
// bare URLs are both caught, so a citation cannot dodge the check by dropping its brackets.
export const CITE = /(?<=[(\s>"'])\/theorem\/([A-Za-z0-9_.]+)/g
export const prose = (txt: string) => txt.replace(/```[\s\S]*?```/g, '\n').replace(/`[^`\n]*`/g, ' ')
export const citations = (txt: string) => [...prose(txt).matchAll(CITE)].map((m) => m[1])

/** The verdict on one file. binary 1 = holds; 0 = drains, with `hit` naming what failed and `why` the statute. */
export const audit = (txt: string): { binary: 0 | 1; hit: string | null; why: string } => {
  const dangling = citations(txt).filter((k) => !LIVE.has(k))
  if (dangling.length) return {
    binary: 0,
    hit: dangling[0],
    why: GONE.has(dangling[0]) ? 'REVOKED — in the record, no longer citable' : 'NOT IN THE LEDGER — no such theorem',
  }
  const g = computes(prose(txt).replace(CITE, '/cited/').replace(/\/theorem\/[A-Za-z0-9_.]+/g, '/path/'))
  return { binary: g.binary, hit: g.hit, why: g.binary ? 'holds' : 'the packaged gate drained this prose' }
}
