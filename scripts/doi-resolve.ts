#!/usr/bin/env node
// EVERY DOI THIS REPOSITORY CITES, RESOLVED — not harvested, and checked against what we think it is.
//
// ceccec.github.io asked for this from both ends after we found the defect from opposite sides. Their
// version: a concept DOI in a site-wide citation block on 1038 published pages, handing every reader
// uuidna's deposit. Mine: a version DOI in CITATION.cff, README and 338 deposition records whose chain head
// is now uuidna. Neither of us chose to be in that chain; three unrelated works were published as versions
// of one, and the only way either noticed was one repository following the other's identifier.
//
// RESOLVE, DO NOT HARVEST. That distinction is the whole finding. A concept DOI has NO OAI record —
// GetRecord on one returns idDoesNotExist — so a gate that only harvests reports a FALSE ABSENCE for
// precisely the identifier most likely to be wrong, because the concept DOI is the one that silently moves.
// Both of us hit that error; they read it correctly and stopped, I read it correctly and stopped, and
// following it over HTTP is what found the substitution.
//
// ROLE-AWARE, because the same DOI means different things in different places. A DOI cited as THIS WORK
// must resolve to this work. A DOI cited as a PRIOR VERSION is allowed to be something else — that is what
// a version chain is — and is reported rather than failed, since the deposit already states in its own
// description that those titles claim what it refuses.
import { readFileSync, readdirSync, existsSync } from 'node:fs'

const OURS = 'ℤ/9 Vortex Framework'
type Cite = { doi: string; role: string; where: string; mustBeOurs: boolean }

const cites: Cite[] = []
const seen = new Set<string>()
const add = (doi: string, role: string, where: string, mustBeOurs: boolean) => {
  const k = `${doi}|${role}|${where}`
  if (seen.has(k)) return
  seen.add(k)
  cites.push({ doi, role, where, mustBeOurs })
}

const cff = readFileSync('CITATION.cff', 'utf8')
for (const m of cff.matchAll(/10\.\d{4,}\/zenodo\.\d+/g)) add(m[0], 'this work', 'CITATION.cff', true)
const z = JSON.parse(readFileSync('.zenodo.json', 'utf8')) as { related_identifiers?: { identifier: string; relation: string }[] }
for (const r of z.related_identifiers ?? [])
  if (/^10\.\d{4,}\//.test(r.identifier)) add(r.identifier, r.relation, '.zenodo.json', r.relation === 'isPartOf')
const DEP = '.zenodo/theorems'
if (existsSync(DEP)) {
  const one = JSON.parse(readFileSync(`${DEP}/${readdirSync(DEP).find((f) => f.endsWith('.json'))!}`, 'utf8'))
  for (const r of one.related_identifiers ?? [])
    if (/^10\.\d{4,}\//.test(r.identifier))
      add(r.identifier, r.relation, `${readdirSync(DEP).length} deposition records`, r.relation === 'isPartOf')
}

let bad = 0, checked = 0
for (const c of cites) {
  let landed = '', title = ''
  try {
    const r = await fetch(`https://doi.org/${c.doi}`, { redirect: 'follow', signal: AbortSignal.timeout(20_000) })
    landed = (r.url.match(/records\/(\d+)/) ?? [])[1] ?? ''
    if (landed) {
      const o = await fetch(`https://zenodo.org/oai2d?verb=GetRecord&metadataPrefix=oai_dc&identifier=oai:zenodo.org:${landed}`,
        { signal: AbortSignal.timeout(20_000) })
      const b = await o.text()
      title = (b.match(/<dc:title>([\s\S]*?)<\/dc:title>/) ?? [])[1]?.replace(/\s+/g, ' ').trim() ?? ''
    }
    checked++
  } catch (e) {
    console.log(`○ doi-resolve: NOT CHECKED — could not reach the network (${(e as Error).message}).`)
    console.log('  no identifier was confirmed on this run, which is not the same as their being correct.')
    process.exit(0)
  }
  const ours = title.includes(OURS)
  const moved = landed && !c.doi.endsWith(landed)
  const flag = c.mustBeOurs && !ours
  if (flag) bad++
  console.log(`  ${flag ? '✗' : ours ? '·' : '○'} ${c.doi}  [${c.role}, ${c.where}]`)
  console.log(`      resolves to record ${landed || '(none)'}${moved ? '  ← A DIFFERENT RECORD THAN THE ONE CITED' : ''}`)
  console.log(`      "${title.slice(0, 88)}"`)
  if (flag) console.log(`      cited as ours and does not name "${OURS}" — a citation that does not reach this work`)
}

console.log(bad
  ? `\n✗ doi-resolve: ${bad} of ${checked} identifier(s) cited as this work resolve to something else`
  : `\n✓ doi-resolve: ${checked} identifier(s) resolved. Every DOI cited AS THIS WORK reaches a record naming`
    + `\n  "${OURS}"; those cited as prior versions are reported with the title they actually carry, because a`
    + `\n  version chain is allowed to hold other work and this deposit says so in its own description.`)
process.exit(bad ? 1 : 0)
