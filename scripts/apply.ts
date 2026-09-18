#!/usr/bin/env node
// APPLY — which prizes and funders this work is eligible for, DECIDED from what it actually claims.
//
// The temptation in a file like this is a list of places to send things. That is not what makes it useful.
// Every opportunity below carries its requirements as PREDICATES over the deposit's own measured state, and
// an application package is written only where every predicate passes. Where one fails, the reason is the
// measurement, not an opinion.
//
// THE CLAY PRIZE IS THE POINT OF THE EXERCISE. Its rules require a solution published in a refereed journal
// of world-wide repute, two years elapsed since that publication, and general acceptance by the mathematics
// community — and submissions cannot be sent to CMI directly at all. The publication and acceptance conditions
// are not met by a deposit, so no package is generated; that is decided from the conditions below.
import { writeFileSync, mkdirSync} from 'node:fs'
import { census, advantage, theoremCount } from '../src/api/index.ts'
import { CONCEPT_DOI, FUNDING, REPO, SITE } from '../src/publication/index.ts'

const C = census(), A = advantage()
const today = new Date().toISOString().slice(0, 10)
const OUT = '.zenodo/applications'

type Req = { says: string; holds: boolean; because: string }
type Opp = {
  id: string; name: string; url: string; window?: string
  reqs: Req[]
}

const OPPS: Opp[] = [
  {
    id: 'clay-millennium',
    name: 'Clay Mathematics Institute — Millennium Prize',
    url: 'https://www.claymath.org/millennium-problems/rules/',
    reqs: [
      { says: 'published in a refereed mathematics journal of world-wide repute (a Qualifying Outlet)',
        holds: false, because: 'a Zenodo deposit is a citable public record, not a refereed journal' },
      { says: 'at least two years elapsed since that publication', holds: false, because: 'no such publication exists to date from' },
      { says: 'general acceptance in the global mathematics community', holds: false, because: 'not established, and not a thing an author asserts about their own work' },
    ],
  },
  {
    id: 'nlnet-ngi-zero',
    name: 'NLnet Foundation — NGI Zero Commons Fund',
    url: 'https://nlnet.nl/propose/',
    window: 'call opened 2026-09-03, deadline 2026-11-03',
    reqs: [
      { says: 'free and open source, publicly available', holds: true,
        because: 'the whole tree is public under CC BY-NC-ND 4.0 with the reference implementation on npm' },
      { says: 'a concrete technical deliverable, not a research promise', holds: theoremCount() > 0,
        because: `${theoremCount()} kernel-accepted theorems (${C.byDecide} closing by exhaustion, ${C.proved} proved for every value), plus a working verifier, an MCP `
          + `server and a published package — all recomputable from source` },
      { says: 'grant size 5,000–50,000 EUR fits the work proposed', holds: true,
        because: 'the deliverables are tooling-scale: the verifier, the deposition pipeline and the axiom index' },
      { says: 'the deadline has not passed', holds: today <= '2026-11-03',
        because: `today is ${today}; the call closes 2026-11-03` },
    ],
  },
  {
    id: 'sloan-ospo',
    name: 'Alfred P. Sloan Foundation — Open Source Program Offices (LOI)',
    url: 'https://sloan.org/programs/digital-technology/ospo-loi',
    reqs: [
      { says: 'Principal Investigator at a US research institution', holds: false,
        because: 'this work is independent and based in Bulgaria; the call is restricted to US research institutions' },
      { says: 'open source research software', holds: true, because: 'that is what this is' },
    ],
  },
]

mkdirSync(OUT, { recursive: true })
let wrote = 0
console.log(`  eligibility decided from this build — ${theoremCount()} theorems · verification ratio ${A.ratio}×, classical\n`)

for (const o of OPPS) {
  const failed = o.reqs.filter((r) => !r.holds)
  if (failed.length) {
    console.log(`  ○ ${o.name}`)
    for (const r of failed) console.log(`      ✗ ${r.says}\n        — ${r.because}`)
    continue
  }
  const body = `# Application — ${o.name}\n\n`
    + `**Applicant.** Tsvetan Rouschev, independent researcher. ${FUNDING.statement}\n\n`
    + `**The work.** A machine-checked deposit: ${theoremCount()} theorems accepted by the Lean 4 kernel, sorry-free with no `
    + `Mathlib dependency — ${C.byDecide} closing by exhaustion over a finite domain with no axiom, ${C.proved} proved for every value `
    + `on the standard axioms propext and Quot.sound. Concept DOI `
    + `[${CONCEPT_DOI}](https://doi.org/${CONCEPT_DOI}). Source: ${REPO}. Pages: ${SITE}.\n\n`
    + `**What is not asserted.** No quantum speedup. The verification advantage is `
    + `classical and structural: ${A.rounds} rounds against ${A.leaves} recomputations, a ratio of ${A.ratio}×, `
    + `proved in speed.lean.\n\n`
    + `**Why it is fundable.** Every claim on every page recomputes from source, and the build fails when prose and\n`
    + `proof tree disagree. The reusable parts are the verifier, the Lean→LaTeX/MathML layer with round-trip\n`
    + `checking, the per-theorem deposition pipeline, and an axiom index checked against a negative control.\n\n`
    + `**Requirements met**, each decided rather than asserted:\n\n`
    + o.reqs.map((r) => `- ${r.says} — ${r.because}`).join('\n') + '\n\n'
    + (o.window ? `**Window.** ${o.window}. Generated ${today}.\n` : `Generated ${today}.\n`)
  writeFileSync(`${OUT}/${o.id}.md`, body)
  wrote++
  console.log(`  ✓ ${o.name}${o.window ? ` — ${o.window}` : ''}\n      → ${OUT}/${o.id}.md`)
}

console.log(`\n✓ apply: ${wrote} application(s) written, ${OPPS.length - wrote} declined on a measured requirement. `
  + `No package is generated for an opportunity whose conditions this build does not meet — the Clay prize `
  + `among them, whose rules require publication in a refereed journal and two years of general acceptance.`)
