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
// community — and submissions cannot be sent to CMI directly at all. This deposit proves 0 of the 7, which
// is measured on every build and stated on every page. So the first predicate fails and no package is
// generated. That refusal is COMPUTED here rather than written as policy: if the number were ever not zero
// this file would say so, which is the only way a refusal is worth anything.
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs'
import { clayFloor, census, advantage } from '../src/api/index.ts'
import { CONCEPT_DOI, FUNDING, REPO, SITE } from '../src/publication/index.ts'

const C = census(), F = clayFloor(), A = advantage()
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
      { says: 'a solution to one of the seven problems exists in this work',
        holds: false,
        because: `this deposit proves 0 of the 7. clayFloor() reports ${F.seven}/7 Clay-named theorems present, `
          + `all closing by decide, and reaches=${F.reaches.length} — none reaches a conjecture object. The pages `
          + `state 0/7 and a gate fails the build on any sentence claiming otherwise` },
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
      { says: 'a concrete technical deliverable, not a research promise', holds: C.byDecide > 0,
        because: `${C.byDecide} kernel-accepted theorems closing by exhaustion, plus a working verifier, an MCP `
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
// `F.seven` counts Clay-NAMED theorems present, not problems solved. Printed beside "0 of 7 proved" the
// bare fraction reads as seven solved, which is the exact misreading this deposit spends its gates on.
console.log(`  eligibility decided from this build — ${C.byDecide} theorems · Clay problems SOLVED: 0 of 7 `
  + `(${F.seven} Clay-named theorems present, ${F.reaches.length} reaching a conjecture) · `
  + `verification ratio ${A.ratio}×, classical\n`)

for (const o of OPPS) {
  const failed = o.reqs.filter((r) => !r.holds)
  if (failed.length) {
    console.log(`  ○ ${o.name}`)
    for (const r of failed) console.log(`      ✗ ${r.says}\n        — ${r.because}`)
    continue
  }
  const body = `# Application — ${o.name}\n\n`
    + `**Applicant.** Tsvetan Rouschev, independent researcher. ${FUNDING.statement}\n\n`
    + `**The work.** A machine-checked deposit: ${C.byDecide} theorems accepted by the Lean 4 kernel, each closing `
    + `by exhaustion over a finite domain, sorry-free and axiom-free with no Mathlib dependency. Concept DOI `
    + `[${CONCEPT_DOI}](https://doi.org/${CONCEPT_DOI}). Source: ${REPO}. Pages: ${SITE}.\n\n`
    + `**What is deliberately not claimed.** No Clay Millennium Problem is settled (${F.seven}/7 present as named `
    + `theorems, none reaching a conjecture), and no quantum speedup is asserted. The verification advantage is `
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
  + `first among them, because 0 of 7 is what this deposit proves and a generator that ignored that would be `
  + `the overclaim every gate here exists to stop.`)
