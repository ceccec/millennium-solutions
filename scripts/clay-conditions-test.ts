#!/usr/bin/env node
// CLAY-CONDITIONS-TEST — the three conditions CMI sets before it considers a proposed solution, one test each.
//
//   node scripts/clay-conditions-test.ts                 test the evidence record clay/evidence.json
//   node scripts/clay-conditions-test.ts --self-test     prove the tests can pass, with a synthetic record in a temp file
//
// The conditions, quoted from https://www.claymath.org/millennium-problems/rules/ (fetched through the MCP web_fetch
// tool, revised 26 September 2018):
//   (i)   the proposed solution must be published in a Qualifying Outlet (see §6)
//   (ii)  at least two years must have passed since publication
//   (iii) the proposed solution must have received general acceptance in the global mathematics community
//
// A condition is MET only when its evidence is present and checks out. Otherwise it is NOT MET, with the reason.
// The tests never mark a condition MET from the repository alone: the repository holds no publication record, and
// condition (i) needs a reviewer to check §6, which the fetched page did not contain. Condition (iii) has no
// measurable test in this repository; it stays NOT MET until CMI or the community supplies its evidence.
import { readFileSync, existsSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

type Evidence = {
  problem: string
  doi?: string
  outlet?: string
  outletChecklist?: {                 // §6(e): a publication lacking any of these is not a Qualifying Outlet
    editorialBoardNamed: boolean      // i.   an editorial board whose members are named and available for contact
    editorCanFindReferees: boolean    // ii.  an editor who can identify an appropriate referee
    refereeingProcess: boolean        // iii. a published refereeing process that CMI judges sound
    mathSciNetListed: boolean         // iv.  inclusion in the list of publications maintained by MathSciNet
  }
  cmiDecision?: 'qualifying' | 'not qualifying' | 'pending'   // §6(f): CMI's sole and unfettered discretion
  publishedOn?: string                // ISO date
  acceptance?: { source: string; url: string }[]
}
type Verdict = 'MET' | 'NOT MET'
type Result = { condition: string; verdict: Verdict; reason: string }

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const TODAY = new Date('2026-10-22T00:00:00Z')
const EVIDENCE = join(ROOT, 'clay', 'evidence.json')

const condition1 = (e: Evidence | null): Result => {
  const name = '(i) published in a Qualifying Outlet (§6)'
  if (!e) return { condition: name, verdict: 'NOT MET', reason: 'no publication record: clay/evidence.json is absent' }
  if (!e.doi) return { condition: name, verdict: 'NOT MET', reason: 'the record names no DOI' }
  if (!e.outletChecklist) return { condition: name, verdict: 'NOT MET', reason: 'no §6(e) checklist recorded for the outlet' }
  const failed = Object.entries(e.outletChecklist).filter(([, v]) => v !== true).map(([k]) => k)
  if (failed.length) return { condition: name, verdict: 'NOT MET', reason: `§6(e): the outlet lacks ${failed.join(', ')}, so it is deemed not a Qualifying Outlet` }
  if (e.cmiDecision !== 'qualifying') return { condition: name, verdict: 'NOT MET', reason: `§6(f): CMI has not decided (${e.cmiDecision ?? 'no decision recorded'}); its decision is sole and unfettered` }
  return { condition: name, verdict: 'MET', reason: `DOI ${e.doi} in ${e.outlet}: §6(e) checklist complete, CMI decided qualifying` }
}

const condition2 = (e: Evidence | null): Result => {
  const name = '(ii) at least two years since publication'
  if (!e?.publishedOn) return { condition: name, verdict: 'NOT MET', reason: 'no publication date' }
  const published = new Date(e.publishedOn)
  if (Number.isNaN(published.getTime())) return { condition: name, verdict: 'NOT MET', reason: `publication date "${e.publishedOn}" is not a date` }
  const due = new Date(published)
  due.setUTCFullYear(due.getUTCFullYear() + 2)
  if (TODAY < due) return { condition: name, verdict: 'NOT MET', reason: `two years have not passed: due ${due.toISOString().slice(0, 10)}` }
  return { condition: name, verdict: 'MET', reason: `published ${e.publishedOn}; two years passed by ${due.toISOString().slice(0, 10)}` }
}

const condition3 = (e: Evidence | null): Result => {
  const name = '(iii) general acceptance in the global mathematics community'
  if (!e?.acceptance?.length) return { condition: name, verdict: 'NOT MET', reason: 'no acceptance evidence recorded' }
  // Acceptance is not something a repository can measure. A record may list sources, but the decision is CMI's.
  return { condition: name, verdict: 'NOT MET', reason: `${e.acceptance.length} source(s) listed, but general acceptance is a judgement made by the community and CMI, not by this test` }
}

// THE RULES ARE READ THROUGH THE MCP. The test encodes §6(e) and §6(f); before it trusts that encoding it fetches the
// live rules PDF with web_fetch and checks the sentences it encodes are still there. A rules change then shows as a
// failure of this check, not as a silently stale test.
const RULES_PDF = 'https://www.claymath.org/wp-content/uploads/2022/03/millennium_prize_rules_0.pdf'
const rulesStillSay = (): { ok: boolean; why: string } => {
  const call = (pattern: string): string => {
    const out = spawnSync('node', ['scripts/mcp-call.ts', 'web_fetch', JSON.stringify({ url: RULES_PDF, pattern, window: 1200 })], { cwd: ROOT, encoding: 'utf8', timeout: 180_000 })
    return String(out.stdout ?? '')
  }
  const checks: [string, RegExp][] = [
    ['§6(e) lacking-any rule', /lacking\s+any\s+of\s+the\s+following/],
    ['§6(e)(iv) MathSciNet', /MathSciNet/],
    ['§6(f) sole and unfettered discretion', /sole\s+and\s+unfettered\s+discretion/],
  ]
  for (const [label, re] of checks) {
    const text = call(label.includes('MathSciNet') ? 'MathSciNet' : label.includes('(f)') ? 'unfettered' : 'lacking\\s+any')
    let parsed: { status?: string; matches?: number; passages?: string[]; why?: string } = {}
    try { parsed = JSON.parse(text) } catch { return { ok: false, why: `${label}: the MCP did not answer (${text.slice(0, 120)})` } }
    if (parsed.status !== 'FETCHED') return { ok: false, why: `${label}: ${parsed.status} ${parsed.why ?? ''}`.trim() }
    if (!(parsed.passages ?? []).some((p) => re.test(p))) return { ok: false, why: `${label}: not found in the live rules, so the encoding is stale` }
  }
  return { ok: true, why: 'the encoded §6(e) and §6(f) text is present in the live rules document' }
}

const run = (e: Evidence | null): Result[] => [condition1(e), condition2(e), condition3(e)]

const report = (results: Result[]): number => {
  for (const r of results) console.log(`${r.verdict === 'MET' ? '✓' : '✗'} ${r.condition} — ${r.verdict}: ${r.reason}`)
  const allMet = results.every((r) => r.verdict === 'MET')
  console.log(allMet ? '\n✓ all three conditions met' : `\n✗ ${results.filter((r) => r.verdict !== 'MET').length} of 3 conditions not met`)
  return allMet ? 0 : 1
}

if (process.argv.includes('--self-test')) {
  // The instrument must be able to say MET. A synthetic record in a temp file with a date far enough in the past.
  const dir = mkdtempSync(join(tmpdir(), 'clay-cond-'))
  const synthetic: Evidence = { problem: 'self-test', doi: '10.0000/synthetic', outlet: 'synthetic journal', outletChecklist: { editorialBoardNamed: true, editorCanFindReferees: true, refereeingProcess: true, mathSciNetListed: true }, cmiDecision: 'qualifying', publishedOn: '2020-01-01', acceptance: [{ source: 'synthetic', url: 'https://example.invalid' }] }
  writeFileSync(join(dir, 'e.json'), JSON.stringify(synthetic))
  const e = JSON.parse(readFileSync(join(dir, 'e.json'), 'utf8')) as Evidence
  rmSync(dir, { recursive: true, force: true })
  // Condition (iii) is never MET by design; the self-test checks that the other two can be.
  const r = run(e)
  const ok = r[0]!.verdict === 'MET' && r[1]!.verdict === 'MET' && r[2]!.verdict === 'NOT MET'
  console.log(ok ? '✓ self-test: conditions (i) and (ii) can be MET; (iii) stays NOT MET by design' : '✗ self-test failed: the tests cannot reach MET where the evidence is complete')
  process.exit(ok ? 0 : 1)
}

const rules = rulesStillSay()
console.log(`${rules.ok ? '✓' : '✗'} rules read through the MCP: ${rules.why}`)
const evidence: Evidence | null = existsSync(EVIDENCE) ? (JSON.parse(readFileSync(EVIDENCE, 'utf8')) as Evidence) : null
process.exit(rules.ok ? report(run(evidence)) : 1)
