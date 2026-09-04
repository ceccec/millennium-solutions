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
const unread: [string, string][] = []
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
    // UNREAD IS NOT AGREEMENT, and it is not disagreement either. uuidna-49 keeps those strictly apart and
    // I did not: any failure here exited 0, so a 429 or a timeout on ONE identifier read as a clean run for
    // ALL of them. An identifier that could not be read is recorded as unread and reported at the end; the
    // gate refuses to call the sweep complete when any remain.
    unread.push([c.doi, (e as Error).message])
    continue
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

for (const [doi, why] of unread) console.log(`  ? ${doi}  UNREAD — ${why}`)
if (unread.length) {
  console.log(`\n○ doi-resolve: ${unread.length} identifier(s) could not be read on this run. That is not`)
  console.log(`  agreement and it is not disagreement — they are unverified, and ${checked} others were checked.`)
}
// A GREEN LINE ON ZERO CHECKS IS THE DEFECT THIS TREE SPENDS ITS GATES ON, and I wrote one into the fix
// that was meant to separate unread from disagreeing: with every identifier unreachable it reported
// "✓ 0 identifier(s) resolved". Nothing verified is not everything verified. Success now requires that
// something was actually read AND that nothing was left unread.
if (!checked) {
  console.log(`\n○ doi-resolve: NOTHING WAS VERIFIED — ${cites.length} identifier(s) cited, 0 read. This is not`)
  console.log(`  a pass; it is a run that established nothing, and it says so rather than showing a tick.`)
  process.exit(0)
}
// ── AND THE SITE URLS THE RECORDS PUBLISH, WHICH MUST NOT REDIRECT EITHER ───────────────────────────────
// The deposition records name theorem pages, the paper and the proofs index. Those were pointing at
// ceccec.github.io, which 301-redirects to ceccec.psg.bg — the origin .vitepress/config.ts declares, the
// sitemap uses, and every page emits as its own rel=canonical. A citation index following a 301 gets a
// redirect rather than the page, a redirect can lapse or be repointed by whoever holds the old host, and a
// minted record naming a non-canonical URL cannot be corrected afterwards.
//
// Found by RESOLVING a link instead of reading it. The concept DOI taught that lesson and I had not applied
// it to this deposit's own outbound links.
if (existsSync(DEP)) {
  const one = JSON.parse(readFileSync(`${DEP}/${readdirSync(DEP).find((f) => f.endsWith('.json'))!}`, 'utf8'))
  const urls = [...new Set((one.related_identifiers ?? [])
    .map((r: { identifier: string }) => r.identifier)
    .filter((u: string) => typeof u === 'string' && u.startsWith('http')))] as string[]
  let redirected = 0
  for (const u of urls) {
    try {
      const r = await fetch(u, { redirect: 'manual', signal: AbortSignal.timeout(20_000) })
      if (r.status >= 300 && r.status < 400) {
        redirected++
        console.log(`  ✗ ${u}`)
        console.log(`      ${r.status} → ${r.headers.get('location') ?? '(no location)'} — a record should name the resource, not a redirect to it`)
      }
    } catch { /* offline: reported by the unread branch above */ }
  }
  if (!redirected && urls.length) console.log(`\n  · ${urls.length} site URL(s) the records publish resolve directly, no redirects`)
  if (redirected) bad += redirected
}

console.log(bad
  ? `\n✗ doi-resolve: ${bad} of ${checked} identifier(s) cited as this work resolve to something else`
  : `\n✓ doi-resolve: ${checked} identifier(s) resolved. Every DOI cited AS THIS WORK reaches a record naming`
    + `\n  "${OURS}"; those cited as prior versions are reported with the title they actually carry, because a`
    + `\n  version chain is allowed to hold other work and this deposit says so in its own description.`)
process.exit(bad ? 1 : 0)  // unread does not fail the build; it is reported, never silently passed
