#!/usr/bin/env node
// CITATIONS — who cites the author's DOIs, tracked through the registries that issue and index them.
//
// "Use without citing" is the violation this deposit cares about, and the citation graph answers only half
// of it: it names everyone who DID cite. Whoever used the work and said nothing is, by construction, absent
// from it. So this reports what the graph holds and refuses to read silence as innocence or as guilt — the
// boundary src/proof/instruments.lean decides for other instruments, applied where it matters most, because
// the wrong side of it here is an accusation against a real person.
//
// A self-citation is not a citation for this purpose. The author citing his own deposit from his own later
// deposit is provenance, not reception, and counting it as reception is the flattering direction.
import { writeFileSync } from 'node:fs'
import { flag } from '../src/cli/index.ts'

const UA = { 'User-Agent': 'millennium-solutions/citations (+https://ceccec.psg.bg/millennium-solutions/; mailto:ceccec@psg.bg)' }
const DOIS = ['10.5281/zenodo.21781603', '10.5281/zenodo.21819217', '10.5281/zenodo.22256707']
const AUTHOR = 'rouschev'

const get = async (url: string) => {
  const r = await fetch(url, { headers: UA, signal: AbortSignal.timeout(30_000) })
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  return r.json() as Promise<any>
}

type Citing = { doi: string; date: string; title: string; authors: string[]; self: boolean }
type Tracked = { doi: string; datacite?: number; openalex?: number; citing: Citing[]; notMeasured: string[] }

async function track(doi: string): Promise<Tracked> {
  const out: Tracked = { doi, citing: [], notMeasured: [] }
  try { out.datacite = (await get(`https://api.datacite.org/dois/${doi}`)).data?.attributes?.citationCount ?? 0 }
  catch (e) { out.notMeasured.push(`datacite: ${(e as Error).message}`) }
  try {
    const work = await get(`https://api.openalex.org/works/doi:${doi}`)
    out.openalex = work.cited_by_count ?? 0
    const id = String(work.id ?? '').split('/').pop()
    if (id && out.openalex) {
      const cites = await get(`https://api.openalex.org/works?filter=cites:${id}&per-page=50`)
      for (const w of cites.results ?? []) {
        const authors = (w.authorships ?? []).map((a: any) => a.author?.display_name ?? '')
        out.citing.push({
          doi: String(w.doi ?? w.id ?? ''), date: String(w.publication_date ?? ''),
          title: String(w.title ?? '').slice(0, 70), authors,
          self: authors.some((a: string) => a.toLowerCase().includes(AUTHOR)),
        })
      }
    }
  } catch (e) { out.notMeasured.push(`openalex: ${(e as Error).message}`) }
  return out
}

const tracked = await Promise.all(DOIS.map(track))
const all = tracked.flatMap((t) => t.citing)
const third = all.filter((c) => !c.self)
const self = all.filter((c) => c.self)
const blind = tracked.flatMap((t) => t.notMeasured)

for (const t of tracked) {
  console.log(`  ${t.doi}`)
  console.log(`    datacite ${t.datacite ?? '—'} · openalex ${t.openalex ?? '—'} citation(s)`
    + (t.notMeasured.length ? ` · NOT MEASURED: ${t.notMeasured.join(', ')}` : ''))
  for (const c of t.citing) console.log(`      ${c.self ? 'SELF' : 'THIRD PARTY'} · ${c.date} · ${c.authors.slice(0, 2).join(', ')} · ${c.title}`)
}

console.log(`\n${all.length} citing work(s) found · ${self.length} by the author himself · ${third.length} by anyone else.`)
if (third.length) {
  console.log(`\nTHIRD-PARTY CITATIONS — these cite the work, which is the opposite of the violation:`)
  for (const c of third) console.log(`  · ${c.date} · ${c.authors.join(', ')} · ${c.title} · ${c.doi}`)
}
console.log(`\nWHAT THIS CANNOT SHOW: the citation graph names everyone who DID cite. A work that uses the`)
console.log(`  author's results and says nothing is absent from it by construction, so ${third.length} third-party`)
console.log(`  citation(s) is not a count of honest users and 0 would not be a count of dishonest ones.`)
console.log(`  Uncited use is found by matching CONTENT, not by reading a citation graph — and an accusation`)
console.log(`  against a named party needs evidence of use, not the absence of a reference.`)
if (blind.length) console.log(`\n  ${blind.length} registry call(s) NOT MEASURED: ${blind.join(', ')} — silence here is outage, not absence.`)

if (flag('--write')) {
  writeFileSync('src/proof/citations.json', JSON.stringify({ measured: new Date().toISOString().slice(0, 10), tracked }, null, 2) + '\n')
  console.log('\n  recorded → src/proof/citations.json')
}
