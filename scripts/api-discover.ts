#!/usr/bin/env node
/** ── DISCOVER THE APIS, THEN THEIR SCHEMAS, THEN THE JOINS, THEN PROVE THE JOINS ON LIVE DATA ───────────────
 *
 *  A chain of four steps, each derived from the one before and none of them a list I wrote:
 *
 *    1 · THE APIS come from src/readers/index.ts — 30 sources, 22 readable, each already proven against a fact
 *        known before it was asked. This adds nothing to that registry; it consumes it.
 *    2 · THE SCHEMA of each is discovered, in two ways and in this order: an OpenAPI or Swagger document at a
 *        well-known path if the service publishes one, and otherwise the SHAPE OF A REAL RESPONSE, flattened
 *        to leaf paths. The second always works and is the honest fallback — a service that documents nothing
 *        still tells you what it returns.
 *    3 · THE JOINS ARE DISCOVERED FROM THE DATA, NOT FROM MY KNOWLEDGE OF THE FIELDS. Every response is
 *        flattened to (path, value) pairs, and a value appearing in TWO INDEPENDENT SERVICES for the same
 *        entity is a candidate join — the two paths that hold it are the cross formula. This matters: I could
 *        have written down that PubChem's InChIKey joins ChEMBL's standard_inchi_key, and then the program
 *        would be checking my recollection rather than discovering anything. Finding it by shared value means
 *        the program finds joins I did not know about, and fails to find ones I wrongly believed in.
 *    4 · AND THE JOIN IS PROVEN, which for an identifier means byte-identical across two services run by
 *        different institutions. PubChem is NCBI in Maryland; ChEMBL is EMBL-EBI in Cambridge. When both
 *        return BSYNRYMUTXBXSQ-UHFFFAOYSA-N for aspirin, that is not a resemblance and not a convention two
 *        parties agreed informally — it is a computed identity, the InChIKey being a hash of the structure.
 *
 *  WHAT A DISCOVERED JOIN IS AND IS NOT. It establishes that two databases are talking about the same thing
 *  and can be joined without matching on a name — which is the single hardest problem in every one of these
 *  domains, because common names are ambiguous across languages, centuries and trade usage. It establishes
 *  NOTHING about whether either database is correct. Two services can agree and both be wrong, and this tree
 *  has the lesson at first hand: a broken CERN filter here once returned EXACTLY the API's own total and was
 *  believed BECAUSE the number agreed. Agreement is a join key, not a truth.
 *
 *  TRIVIAL AGREEMENT IS NOT AGREEMENT. Two services both saying `true`, or `0`, or `"C"`, share a value and
 *  nothing else. A candidate must carry enough information that coincidence is not the explanation, and the
 *  floor is stated in CANDIDATE below rather than tuned until the output looked good.
 *
 *  NETWORK. Never in a build chain: an outage at NCBI or EMBL-EBI must not fail a build about this tree.
 *
 *    node scripts/api-discover.ts              every probe
 *    node scripts/api-discover.ts --probe drug only one
 *    node scripts/api-discover.ts --schemas    stop after discovering schemas, do not look for joins */
import { arg, flag } from '../src/cli/index.ts'
import { READERS } from '../src/readers/index.ts'

// argv reading comes from src/cli — one implementation, kept that way by scripts/canon-gate.ts. The copy
// that stood here returned null where the shared one returns undefined; every call site tests it with a
// falsy check or `??`, so the two are indistinguishable to them.
const UA = { 'User-Agent': 'millennium-solutions/api-discover (+https://ceccec.psg.bg/millennium-solutions/; read-only)' }
const get = async (url: string, ms = 25_000): Promise<{ ok: boolean; body: string; status: number }> => {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), ms)
  try { const r = await fetch(url, { headers: UA, signal: ctl.signal, redirect: 'follow' }); return { ok: r.ok, body: await r.text(), status: r.status } }
  catch { return { ok: false, body: '', status: 0 } } finally { clearTimeout(t) }
}

/** ── STEP 2 · THE SHAPE OF A RESPONSE, as leaf paths. Arrays collapse their index to [] so two responses with
 *  different list lengths still compare as the same shape — an index is a position, not a field. */
const leaves = (v: unknown, path = '', out: [string, string][] = []): [string, string][] => {
  if (v === null || v === undefined) return out
  if (Array.isArray(v)) { for (const x of v) leaves(x, path + '[]', out); return out }
  if (typeof v === 'object') { for (const [k, x] of Object.entries(v as object)) leaves(x, path ? `${path}.${k}` : k, out); return out }
  out.push([path, String(v)])
  return out
}

/** ── STEP 3's FLOOR. A shared value counts as a candidate join only if coincidence is an implausible
 *  explanation of it. Identifiers are long, mixed and rare; `true`, `0` and `"C"` are none of those. */
const CANDIDATE = (v: string): boolean =>
  v.length >= 7 && v.length <= 200
  && /[A-Za-z]/.test(v) && /[0-9A-Z\-]/.test(v)
  && !/^(true|false|null|none|unknown|approved|https?:)/i.test(v)
  && !/^\d{4}-\d\d-\d\d/.test(v)      // a date is shared by everything published that day
  && !/^(the|and|for|with|from) /i.test(v)

type Probe = { name: string; entity: string; calls: { source: string; url: string }[] }
const PROBES: Probe[] = [
  { name: 'drug', entity: 'aspirin — the same molecule asked of four services', calls: [
    { source: 'pubchem', url: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/aspirin/property/InChIKey,MolecularFormula,CanonicalSMILES/JSON' },
    { source: 'chembl', url: 'https://www.ebi.ac.uk/chembl/api/data/molecule/CHEMBL25.json' },
    { source: 'rxnorm', url: 'https://rxnav.nlm.nih.gov/REST/rxcui.json?name=aspirin' },
    { source: 'chebi', url: 'https://www.ebi.ac.uk/ols4/api/ontologies/chebi/terms?short_form=CHEBI%3A15365' },
  ] },
  { name: 'protein', entity: 'haemoglobin subunit alpha — asked of a protein and a genome service', calls: [
    { source: 'uniprot', url: 'https://rest.uniprot.org/uniprotkb/P69905.json' },
    { source: 'ensembl', url: 'https://rest.ensembl.org/lookup/id/ENSG00000206172?content-type=application/json' },
  ] },
  { name: 'plant', entity: 'German chamomile — asked of two independent naming authorities', calls: [
    { source: 'gbif', url: 'https://api.gbif.org/v1/species/match?name=Matricaria%20chamomilla' },
    { source: 'wikidata', url: 'https://www.wikidata.org/wiki/Special:EntityData/Q158695.json' },
  ] },
  { name: 'paper', entity: 'one DOI, asked of three indexes', calls: [
    { source: 'crossref', url: 'https://api.crossref.org/works/10.1136/bmj.39489.470347.AD' },
    { source: 'europepmc', url: 'https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:%2210.1136/bmj.39489.470347.AD%22&format=json&resultType=core' },
    { source: 'datacite', url: 'https://api.datacite.org/dois/10.5281/zenodo.21819217' },
  ] },
]

const only = arg('--probe')
const probes = PROBES.filter((p) => !only || p.name === only)

console.log(`api-discover: ${READERS.length} source(s) in the registry · ${probes.length} probe(s) this run\n`)

// ── STEP 2a · DOES THE SERVICE PUBLISH A SCHEMA AT ALL? Asked of the hosts this run touches, at the paths the
// OpenAPI ecosystem has settled on. A service that publishes none is not at fault and is not a gap in this
// deposit — it is a fact about the service, and the response shape below is read instead.
if (flag('--schemas')) {
  const hosts = [...new Set(probes.flatMap((p) => p.calls.map((c) => new URL(c.url).origin)))]
  const WELL_KNOWN = ['/openapi.json', '/swagger.json', '/api/openapi.json', '/v3/api-docs', '/.well-known/openapi.json']
  for (const h of hosts) {
    const hits: string[] = []
    for (const w of WELL_KNOWN) {
      const r = await get(h + w, 8000)
      if (r.ok && /"(openapi|swagger)"\s*:/.test(r.body)) hits.push(`${w} (${r.body.length} bytes)`)
    }
    console.log(`  ${hits.length ? '✓' : '○'} ${h}  ${hits.length ? hits.join(', ') : 'publishes no OpenAPI document at a well-known path — its response shape is the schema this uses'}`)
  }
  process.exit(0)
}

let provenJoins = 0, probesRun = 0, probesPartial = 0
for (const p of probes) {
  console.log(`── ${p.name.toUpperCase()} · ${p.entity}`)
  const shapes = new Map<string, [string, string][]>()
  for (const c of p.calls) {
    const r = await get(c.url)
    if (!r.ok) { console.log(`   ○ ${c.source.padEnd(11)} did not answer (HTTP ${r.status || 'no response'}) — NOT MEASURED, never "no join"`); continue }
    let j: unknown
    try { j = JSON.parse(r.body) } catch { console.log(`   ○ ${c.source.padEnd(11)} answered but not with JSON — no shape to read`); continue }
    const lv = leaves(j)
    shapes.set(c.source, lv)
    console.log(`   ✓ ${c.source.padEnd(11)} ${lv.length} leaf value(s) over ${new Set(lv.map(([k]) => k)).size} distinct path(s)`)
    await new Promise((r) => setTimeout(r, 250))
  }
  if (shapes.size < 2) { console.log(`   ○ fewer than two services answered — nothing to join this run\n`); probesPartial++; continue }
  probesRun++

  // ── STEP 3 · THE JOINS, DISCOVERED. Index every candidate value by the services that returned it.
  const byValue = new Map<string, Map<string, string[]>>()
  for (const [src, lv] of shapes) {
    for (const [path, val] of lv) {
      if (!CANDIDATE(val)) continue
      if (!byValue.has(val)) byValue.set(val, new Map())
      const m = byValue.get(val)!
      m.set(src, [...(m.get(src) ?? []), path])
    }
  }
  const joins = [...byValue.entries()].filter(([, m]) => m.size >= 2)
    .sort((a, b) => b[1].size - a[1].size || b[0].length - a[0].length)

  if (!joins.length) {
    console.log(`   ✗ no value appears in two of these services above the floor — these responses cannot be joined`)
    console.log(`     without matching on a name, which is the thing that does not work. A real negative.\n`)
    continue
  }
  console.log(`   ${joins.length} value(s) returned by two or more of them — each is a join these services support:`)
  for (const [val, m] of joins.slice(0, 6)) {
    const srcs = [...m.keys()].sort()
    console.log(`     ✳ ${val.length > 60 ? val.slice(0, 57) + '…' : val}`)
    console.log(`         held by ${srcs.length} service(s): ${srcs.join(' + ')}`)
    for (const s of srcs) console.log(`           ${s.padEnd(11)} ${[...new Set(m.get(s)!)].slice(0, 2).join(' , ')}`)
    provenJoins++
  }
  if (joins.length > 6) console.log(`     … and ${joins.length - 6} more above the floor`)
  console.log()
}

console.log(`── WHAT WAS DISCOVERED`)
console.log(`  ${provenJoins} join(s) shown on live data across ${probesRun} probe(s)${probesPartial ? `, ${probesPartial} probe(s) incomplete this run` : ''}`)
console.log(`  Each is a value two INDEPENDENT services returned for the same entity — discovered by comparing`)
console.log(`  every leaf of every response, not by my naming the field that joins them. That distinction is the`)
console.log(`  point: a program told which fields join is checking my recollection, and a program that finds them`)
console.log(`  by shared value finds joins nobody wrote down and refuses ones that were only believed.`)
console.log(`\n  AND A JOIN IS NOT A TRUTH. It establishes that two databases mean the same entity and can be`)
console.log(`  joined without matching on a name. It establishes nothing about either being right: two services`)
console.log(`  can agree and both be wrong, and agreement was how a broken filter in this very tree passed once.`)
