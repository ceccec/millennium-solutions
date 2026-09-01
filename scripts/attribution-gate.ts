#!/usr/bin/env node
// ATTRIBUTION GATE — the author's identifier is either on every citable surface or it is on none of them.
//
// A name is not an identifier. "Tsvetan Rouschev" appears on a dozen surfaces here and resolves to nobody in
// particular; the ORCID does, which is the whole reason the deposit carries one. It was already in
// CITATION.cff, .zenodo.json, the site's schema.org block and llms.txt — and missing from package.json,
// packages/uuidna/package.json and paper.tex, which are the three surfaces a reader most likely cites FROM:
// the published package and the paper.
//
// That asymmetry is how attribution drifts: nobody removes an identifier, it simply never arrives on the
// next surface, and a citation that resolves in one place stops resolving in another. This checks the whole
// set at once, and fails if any surface names the author without also carrying the identifier.
import { readFileSync, existsSync } from 'node:fs'

const ORCID = '0009-0000-7312-9778'

// A NAME HAS SEVERAL CORRECT SPELLINGS, and each schema dictates its own. CITATION.cff splits the name into
// family-names and given-names; Zenodo wants "Rouschev, Tsvetan"; npm and LaTeX want it written out. My first
// version looked for one literal form and reported the two files following their own standards as failures —
// the eighth instrument this session to be wrong before its subject was, and the same mistake each time:
// checking the spelling I had in mind rather than the thing being claimed.
const NAME_FORMS = [
  /Tsvetan\s+Rouschev/,                                   // npm, LaTeX, prose
  /Rouschev,\s*Tsvetan/,                                  // Zenodo / BibTeX order
  /family-names:\s*Rouschev[\s\S]*given-names:\s*Tsvetan/, // CITATION.cff
]
const namesAuthor = (src: string) => NAME_FORMS.some((re) => re.test(src))

// each surface someone could cite this work from
const SURFACES = [
  'package.json', 'packages/uuidna/package.json', 'CITATION.cff', '.zenodo.json',
  'paper.tex', '.vitepress/config.ts', 'public/llms.txt',
]

let bad = 0, checked = 0
console.log('attribution — every surface that names the author must also identify them:')
for (const f of SURFACES) {
  if (!existsSync(f)) { console.log(`  ? ${f.padEnd(34)} absent`); continue }
  const src = readFileSync(f, 'utf8')
  const names = namesAuthor(src)
  const identifies = src.includes(ORCID)
  if (!names && !identifies) { console.log(`  · ${f.padEnd(34)} does not name the author`); continue }
  checked++
  if (names && identifies) console.log(`  ✓ ${f.padEnd(34)} names and identifies`)
  else if (names) { bad++; console.log(`  ✗ ${f.padEnd(34)} NAMES the author with no ORCID — a citation from here resolves to nobody`) }
  else { bad++; console.log(`  ✗ ${f.padEnd(34)} carries the ORCID but not the name`) }
}
console.log(bad
  ? `\n✗ attribution: ${bad} of ${checked} citable surface(s) name the author without identifying them`
  : `\n✓ attribution: all ${checked} citable surfaces carry both the name and ORCID ${ORCID}`)
process.exit(bad ? 1 : 0)
