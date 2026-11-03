#!/usr/bin/env node
// NET-TOOLS-TEST — every MCP tool that needs the network, exercised live, every input branch covered.
//
//   node scripts/net-tools-test.ts
//
// Coverage is derived, not typed: the list of network tools comes from the server's own NEEDS table (src/mcp/index.ts),
// and the run FAILS if any declared network tool has no case here, or if a case names a tool that no longer needs the
// network. So a new network tool cannot ship untested.
//
// When the environment has no network (scripts/environment.ts), the suite is SKIPPED and says why. It is never reported
// as a pass. When the network is present, every case must pass against the live service, and a service that does not
// answer is a failure, not a skip.
import { spawnSync } from 'node:child_process'
import { probe, skipOrFail } from './environment.ts'
import { NEEDS } from '../src/mcp/index.ts'
import { readFileSync } from 'node:fs'

// the constants qpu.lean pins (def name : Nat := value), for the live clay reading to be compared with
const LEAN_QPU = new Map([...readFileSync('src/proof/qpu.lean', 'utf8').matchAll(/^def\s+([a-z]+)\s*:\s*Nat\s*:=\s*(\d+)/gm)].map((m) => [m[1]!, Number(m[2])]))
const CANONICAL_DOI = /^doi:\s*"([^"]+)"/m.exec(readFileSync('CITATION.cff', 'utf8'))?.[1] ?? ''

type Case = { tool: string; name: string; args: object; check: (text: string) => string | null; seconds?: number }
// a case names its own budget only when the tool is a whole pipeline (the hook, the CERN corpus, every gate's control);
// the default is the three minutes a network answer takes

const json = (t: string): Record<string, unknown> | null => {
  try { return JSON.parse(t) as Record<string, unknown> } catch { return null }
}
const need = (cond: boolean, msg: string) => (cond ? null : msg)

// Each tool, each input branch. A check returns null on success or the reason it failed.
const CASES: Case[] = [
  // probe — a real reachability request
  { tool: 'probe', name: 'NIST Planck page is reached', args: { url: 'https://physics.nist.gov/cgi-bin/cuu/Value?h' },
    check: (t) => need(json(t)?.verdict === 'REACHED', `verdict was ${json(t)?.verdict}`) },

  // web_fetch — every branch: a page with a match, a page with no match, a missing page, a non-URL
  { tool: 'web_fetch', name: 'matching passage is returned with its address', args: { url: 'https://en.wikipedia.org/wiki/Conventional_superconductor', pattern: 'Nb 9\\.26', window: 40 },
    check: (t) => need(json(t)?.status === 'FETCHED' && Number(json(t)?.matches) >= 1 && String((json(t)?.passages as string[])?.[0]).includes('9.26'), 'no 9.26 passage') },
  { tool: 'web_fetch', name: 'a page with no match reports zero matches', args: { url: 'https://en.wikipedia.org/wiki/Conventional_superconductor', pattern: 'zzqxjv9873kkw' },
    check: (t) => need(json(t)?.status === 'FETCHED' && json(t)?.matches === 0, `status ${json(t)?.status}, matches ${json(t)?.matches}`) },
  { tool: 'web_fetch', name: 'a missing page is reported as its HTTP status', args: { url: 'https://en.wikipedia.org/wiki/zzqxjv9873kkw_no_such_page', pattern: 'x' },
    check: (t) => need(String(json(t)?.status).startsWith('HTTP_4'), `status ${json(t)?.status}`) },
  { tool: 'web_fetch', name: 'a non-URL is refused, not fetched', args: { url: 'not a url', pattern: 'x' },
    check: (t) => need(json(t)?.status === 'REFUSED', `status ${json(t)?.status}`) },

  // web_search — every source, the empty result, and an unknown source
  { tool: 'web_search', name: 'wikipedia returns hits', args: { source: 'wikipedia', query: 'BCS theory superconductivity', limit: 3 },
    check: (t) => need(json(t)?.status === 'FOUND' && (json(t)?.hits as unknown[])?.length >= 1, `status ${json(t)?.status}`) },
  { tool: 'web_search', name: 'openalex returns hits', args: { source: 'openalex', query: 'Bardeen Cooper Schrieffer superconductivity', limit: 2 },
    check: (t) => need(json(t)?.status === 'FOUND' && (json(t)?.hits as unknown[])?.length >= 1, `status ${json(t)?.status}`) },
  { tool: 'web_search', name: 'arxiv returns hits', args: { source: 'arxiv', query: 'BCS superconductivity', limit: 2 },
    check: (t) => need(json(t)?.status === 'FOUND' && (json(t)?.hits as unknown[])?.length >= 1, `status ${json(t)?.status}`) },
  { tool: 'web_search', name: 'an empty result is NONE, never a negative answer', args: { source: 'wikipedia', query: 'zzqxjv9873kkw' },
    check: (t) => need(json(t)?.status === 'NONE', `status ${json(t)?.status}`) },
  { tool: 'web_search', name: 'an unknown source is refused', args: { source: 'nowhere', query: 'x' },
    check: (t) => need(json(t)?.status === 'REFUSED', `status ${json(t)?.status}`) },

  // novelty — the prior-art search over its live indexes
  { tool: 'novelty', name: 'a statement gets a verdict from the live indexes', args: { statement: 'the Riemann zeta function has trivial zeros at the negative even integers' },
    check: (t) => need(['NONE_FOUND', 'FOUND', 'PRIOR_ART', 'SEARCHED'].some((v) => String(json(t)?.verdict ?? '').includes(v)) || json(t)?.verdict !== undefined, 'no verdict returned') },

  // readers — the scientific sources, listed (the live list is the answer)
  { tool: 'readers', name: 'the live reader list answers', args: { list: true },
    check: (t) => need(t.trim().length > 0 && !t.startsWith('FAILED'), 'no answer from readers') },

  // live — what the deposit has shipped, asked of the registries
  { tool: 'live', name: 'the registries answer for the shipped version', args: {},
    check: (t) => need(t.trim().length > 0 && !t.startsWith('FAILED'), 'no answer from live') },

  // connect — the declared qpu connector, one live door. The `data` door this asked (a NIST reading) is no longer served
  // (measured 2026-11-03); the register door `clay` is, and its relations carry the constants qpu.lean pins, so the live
  // reading is compared with the Lean definitions — read from the file, never typed here
  { tool: 'connect', name: 'the qpu connector answers its clay register live, every relation holds, and vertices and bits agree with qpu.lean', args: { connector: 'qpu', tool: 'clay', arguments: {} },
    check: (t) => { const j = json(t) as { status?: string; answer?: { result?: { content?: { text?: string }[] } } } | null
      if (j?.status !== 'ANSWERED') return `status ${j?.status}`
      let rel: { name: string; holds: boolean; sides: { expression: string; value: number }[] }[] = []
      try { rel = (JSON.parse(String(j.answer?.result?.content?.[0]?.text ?? '')) as { relations?: typeof rel }).relations ?? [] } catch { return 'the clay answer could not be read' }
      const failing = rel.filter((r) => !r.holds).map((r) => r.name)
      const served = new Map(rel.flatMap((r) => r.sides).map((x) => [x.expression, x.value]))
      const disagree = [...LEAN_QPU].filter(([k, v]) => served.has(k) && served.get(k) !== v).map(([k, v]) => `${k}: lean ${v}, served ${served.get(k)}`)
      const compared = [...LEAN_QPU].filter(([k]) => served.has(k)).length
      return need(rel.length >= 1 && failing.length === 0 && compared >= 2 && disagree.length === 0, `${rel.length} relations; failing [${failing}]; compared ${compared}; ${disagree.join('; ')}`) } },

  // clay_conditions — the rules are read through web_fetch and checked before the conditions are judged
  { tool: 'clay_conditions', name: 'the live rules are read and the encoded §6 text is found', args: {},
    check: (t) => need(t.includes('rules read through the MCP'), 'the rules were not read through the MCP') },

  // run_suite — a suite runs through the server and returns a verdict
  { tool: 'run_suite', name: 'a known suite returns a verdict', args: { suite: 'environment' },
    check: (t) => need(/"status": "(PASS|FAIL|SKIPPED)"/.test(t), 'no verdict returned') },
  { tool: 'run_suite', name: 'an unknown suite is refused, not guessed', args: { suite: 'nope' },
    check: (t) => need(/"status": "REFUSED"/.test(t), 'unknown suite was not refused') },

  // connect — a name the connector does not serve is refused with the server's own list, never read as an answer
  { tool: 'connect', name: 'an unknown qpu tool is refused, not answered', args: { connector: 'qpu', tool: 'no_such_tool_zz', arguments: {} },
    check: (t) => need(t.includes('"status": "REFUSED"'), 'unknown tool was not refused') },

  // answer — the routed answer tool: an integer goes to the arithmetic verifier and returns its certificate
  { tool: 'answer', name: 'an integer is answered FALSE with its witness', args: { question: '91' },
    check: (t) => need(t.includes('"value": "FALSE"') && t.includes('"checkedBy": "answer-verify-arith"'), 'the answer tool did not return FALSE with the arithmetic verifier') },

  // api_joins — several services asked for one DOI
  { tool: 'api_joins', name: 'the paper probe joins values across services', args: { probe: 'paper' },
    check: (t) => need(t.includes('PAPER') && !t.startsWith('FAILED'), 'no paper join') },

  // ── the fourteen declared on 2026-10-23 without a case; every shape below was printed by a run on 2026-11-02 ──
  // answer_verify_doi — the C3 verifier: the canonical record is SOURCED, another record is UNKNOWN with its reason, no DOI is usage
  { tool: 'answer_verify_doi', name: 'the deposit\'s own DOI resolves to the canonical work and is SOURCED with a C3 certificate', args: { doi: CANONICAL_DOI },
    check: (t) => need(json(t)?.value === 'SOURCED' && (json(t)?.certificate as { type?: string })?.type === 'C3', `value ${json(t)?.value}, certificate ${JSON.stringify(json(t)?.certificate)}`) },
  { tool: 'answer_verify_doi', name: 'a resolving DOI that is not the canonical work is UNKNOWN, never SOURCED', args: { doi: '10.1103/PhysRev.108.1175' },
    check: (t) => need(json(t)?.value === 'UNKNOWN' && /not the canonical work/.test(String(json(t)?.reason)), `value ${json(t)?.value}: ${json(t)?.reason}`) },
  { tool: 'answer_verify_doi', name: 'no DOI is UNKNOWN with the usage, not a verdict', args: {},
    check: (t) => need(json(t)?.value === 'UNKNOWN' && /usage/.test(String(json(t)?.reason)), `value ${json(t)?.value}: ${json(t)?.reason}`) },

  // api_adapters — every adapter asked live; a WRONG adapter is a stated fact the service no longer returns (zbmath:search was one, 2026-11-02)
  { tool: 'api_adapters', name: 'every adapter answers a verdict and none reads WRONG', args: {}, seconds: 600,
    check: (t) => { const m = /(\d+) adapter\(s\): PROVEN (\d+) · WRONG (\d+)/.exec(t); return need(!!m && Number(m[2]) >= 1 && Number(m[3]) === 0, m ? `PROVEN ${m[2]}, WRONG ${m[3]}: ${t.split('\n').filter((l) => l.startsWith('WRONG')).join('; ')}` : 'no tally line') } },

  // apis_guru — the catalogue snapshot (the full probe is a detached hour and is started, not awaited)
  { tool: 'apis_guru', name: 'the catalogue answers with its size and a snapshot path', args: { mode: 'catalogue' },
    check: (t) => { const m = /catalogue: (\d+) API\(s\)/.exec(t); return need(!!m && Number(m[1]) > 0 && /snapshot: evidence\/apis-guru\//.test(t), 'no catalogue line') } },
  { tool: 'apis_guru', name: 'the full probe is STARTED detached and names where its result lands', args: { mode: 'probe' },
    check: (t) => need(json(t)?.status === 'STARTED' && /apis_guru_cross/.test(String(json(t)?.check)), `status ${json(t)?.status}`) },
  { tool: 'apis_guru_live', name: 'the live reachability pass is STARTED detached and names where its result lands', args: {},
    check: (t) => need(json(t)?.status === 'STARTED' && /live\.json/.test(String(json(t)?.why)), `status ${json(t)?.status}`) },

  // cern — the corpus enumerated through the advertised sitemaps; the control must go RED and the document must agree with its record
  { tool: 'cern', name: 'the corpus is enumerated, the non-involution control goes red, the document agrees with its measured record', args: {}, seconds: 900,
    check: (t) => need(/involution control: .* RED, as required/.test(t) && /agrees with docs\/cern-measured\.json/.test(t) && !/✗/.test(t), t.split('\n').filter((l) => /✗|FAILED/.test(l)).join('; ') || 'no control or agreement line') },

  // clay_online — seven problems, two literature sources and the Clay page each; a source may rate-limit, but each problem is answered by at least one
  { tool: 'clay_online', name: 'all seven problems are read and each has at least one literature source answering', args: {}, seconds: 300,
    check: (t) => { const ps = (json(t)?.problems ?? []) as { problem: string; openalex?: unknown; crossref?: unknown }[]
      const silent = ps.filter((p) => !Array.isArray(p.openalex) && !Array.isArray(p.crossref)).map((p) => p.problem)
      return need(ps.length === 7 && silent.length === 0, `${ps.length} problems; no source answered for: ${silent.join(', ')}`) } },

  // gates_fire — every refusing gate's negative control. On a dirty tree it refuses by name (it writes into tracked files);
  // on a clean tree every control must fire and none may be untrusted
  { tool: 'gates_fire', name: 'on a dirty tree it refuses by name; on a clean tree every control fires and none is untrusted', args: {}, seconds: 1800,
    check: (t) => t.startsWith('REFUSED: the tree has uncommitted changes') ? null
      : need(/UNTRUSTED: 0 control\(s\)/.test(t) && !/✗/.test(t), t.split('\n').filter((l) => /✗|UNTRUSTED|FAILS ON A CLEAN TREE|NO-OP/.test(l)).slice(0, 4).join('; ') || 'no run and no refusal') },

  // links_check — every external link in README.md and index.md; a DEAD or UNREACHABLE link is the finding
  { tool: 'links_check', name: 'every external link in the two front pages is LIVE', args: {}, seconds: 300,
    check: (t) => { const j = json(t) as { checked?: number; tally?: Record<string, number>; rows?: { url: string; verdict: string }[] } | null
      const bad = (j?.rows ?? []).filter((r) => r.verdict !== 'LIVE')
      return need(Number(j?.checked) >= 1 && j?.tally?.LIVE === j?.checked && bad.length === 0, `checked ${j?.checked}: ${bad.map((r) => `${r.verdict} ${r.url}`).join('; ')}`) } },

  // novelty_batch — the incremental prior-art runner under a one-theorem, one-minute budget
  { tool: 'novelty_batch', name: 'one theorem is searched and at least one source answers', args: { limit: 1, minutes: 1 }, seconds: 400,
    check: (t) => { const s = /searched this run: (\d+)/.exec(t), a = /source calls answered: (\d+)/.exec(t)
      return need(!!s && Number(s[1]) >= 1 && !!a && Number(a[1]) >= 1 && !/✗ novelty/.test(t), `searched ${s?.[1]}, answered ${a?.[1]}`) } },

  // pre_commit_court — the court over the staged work, including qpu's audit door
  { tool: 'pre_commit_court', name: 'every court clears and the qpu audit passes all of its own checks', args: {}, seconds: 300,
    check: (t) => { const m = /qpu court — PASS: (\d+) of (\d+)/.exec(t); return need(/✓ pre-commit-court: every court cleared/.test(t) && !!m && m[1] === m[2], m ? `qpu ${m[1]} of ${m[2]}` : t.split('\n').filter((l) => /✗|SKIPPED/.test(l)).join('; ') || 'no court verdict') } },

  // pre_commit_e2e — the whole hook, end to end, without committing
  { tool: 'pre_commit_e2e', name: 'the whole pre-commit hook runs green end to end', args: {}, seconds: 900,
    check: (t) => need(/✓ pre-commit: gate \+ forensics/.test(t), t.split('\n').filter((l) => /✗/.test(l)).slice(0, 3).join('; ') || 'no hook verdict') },

  // qpu_crosscheck — corroboration of the GHZ cancellation against qpu's amplitudes: AGREES or NOT MEASURED, never DISAGREES
  { tool: 'qpu_crosscheck', name: 'the GHZ expectation is computed from Lean and qpu either agrees or has not returned amplitudes', args: {},
    check: (t) => need(['AGREES', 'NOT MEASURED'].includes(String(json(t)?.status)) && ((json(t)?.expected as { ghz?: unknown[] })?.ghz?.length === 8), `status ${json(t)?.status}`) },

  // shor_wave / qpu_wave — every N is factored by this tree's production factor (any binary variant, any width) and verified
  // here; the served Shor door (N in 3..21) is cross-checked where it reaches and its refusal kept in its own words beyond
  { tool: 'shor_wave', name: '15 agrees between the served door and this tree; 91 and a binary 0b variant are factored and verified here', args: { inputs: ['15', '91', '0b1011011'] },
    check: (t) => { const rows = (json(t)?.rows ?? []) as { n: string; qpu: string[] | null; verifier: string; door?: string; witness?: { faces: number; agree: boolean } }[]
      const ok15 = rows[0]?.verifier === 'VERIFIED' && JSON.stringify(rows[0]?.qpu) === '["3","5"]' && rows[0]?.witness?.faces === 14 && rows[0]?.witness?.agree === true
      const ok91 = rows[1]?.verifier === 'VERIFIED' && rows[1]?.qpu === null && /bounded to N in 3\.\.21/.test(String(rows[1]?.door)) && rows[1]?.witness?.agree === true
      const okBin = rows[2]?.verifier === 'VERIFIED' && rows[2]?.witness?.agree === true
      return need(ok15 && ok91 && okBin, JSON.stringify(rows).slice(0, 600)) } },
  { tool: 'shor_wave', name: 'an empty wave is empty, not an error', args: { inputs: [] },
    check: (t) => need(json(t)?.inputs === 0 && (json(t)?.rows as unknown[])?.length === 0, t.slice(0, 120)) },
  { tool: 'qpu_wave', name: 'the semiprimes of 10..21 and their mirrors are all factored and verified, with the door agreeing where it reaches', args: { lo: 10, hi: 21, count: 4 },
    check: (t) => { const j = json(t) as { semiprimes?: number; rows?: { n: string; verifier: string; qpu: string[] | null; door?: string; why?: string }[] } | null
      const rows = j?.rows ?? []
      const bad = rows.filter((r) => r.verifier !== 'VERIFIED')
      const reached = rows.filter((r) => Number(r.n) >= 3 && Number(r.n) <= 21)
      return need(Number(j?.semiprimes) >= 1 && rows.length >= 2 && bad.length === 0 && reached.every((r) => Array.isArray(r.qpu)), `semiprimes ${j?.semiprimes}; ${bad.map((r) => `${r.n} ${r.verifier} ${r.why ?? ''}`).join('; ')}; door unreached for ${reached.filter((r) => !Array.isArray(r.qpu)).map((r) => r.n + ' ' + r.door).join('; ')}`) } },
]

const declared = Object.entries(NEEDS).filter(([, n]) => n.includes('net')).map(([k]) => k).sort()
const covered = [...new Set(CASES.map((c) => c.tool))].sort()
const uncovered = declared.filter((t) => !covered.includes(t))
const notNetwork = covered.filter((t) => !declared.includes(t))

const main = async () => {
  const env = await probe()
  if (!env.net.present) {
    if (skipOrFail('net', env.net.why) === 'FAIL') {
      console.log(`FAILED — CI does not skip: network absent (${env.net.why})`)
      process.exit(1)
    }
    console.log(`SKIPPED — network tools are not measured here: net ${env.net.why}`)
    console.log('  a skipped suite is not a pass; it is reported as unmeasured')
    process.exit(0)
  }
  if (uncovered.length || notNetwork.length) {
    console.log(`✗ coverage: declared network tools with no case: [${uncovered.join(', ')}]; cases naming a tool that is not a network tool: [${notNetwork.join(', ')}]`)
    process.exit(1)
  }
  let failed = 0
  for (const c of CASES) {
    const run = spawnSync('node', ['scripts/mcp-call.ts', c.tool, JSON.stringify(c.args)], { encoding: 'utf8', timeout: (c.seconds ?? 180) * 1000, maxBuffer: 64 << 20 })
    const text = String(run.stdout ?? '') + (run.status !== 0 ? String(run.stderr ?? '') : '')
    const why = c.check(text)
    if (why) {
      failed += 1
      console.log(`✗ ${c.tool} — ${c.name}: ${why}`)
      // the tool's own words, so a run on another machine names its cause without a second run: the lines that carry a
      // verdict or a refusal, else the head of the answer (a CI run on 2026-11-02 reported three cases red with only
      // "no hook verdict" and "searched undefined" to go on)
      const telling = text.split('\n').filter((l) => /✗|REFUSED|FAILED|SKIPPED|Error|error:|not found|ENOENT/.test(l)).slice(0, 6)
      for (const l of (telling.length ? telling : [text.slice(0, 300)])) console.log(`    │ ${l.trim().slice(0, 240)}`)
      if (run.status !== 0) console.log(`    │ exit ${run.status}${run.signal ? ' signal ' + run.signal : ''}`)
    } else {
      console.log(`✓ ${c.tool} — ${c.name}`)
    }
  }
  console.log(`\n${failed === 0 ? '✓' : '✗'} net-tools-test: ${CASES.length - failed}/${CASES.length} cases pass across ${covered.length} network tools`)
  process.exit(failed === 0 ? 0 : 1)
}

main()
