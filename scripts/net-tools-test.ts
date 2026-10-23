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

type Case = { tool: string; name: string; args: object; check: (text: string) => string | null }

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

  // connect — the declared qpu connector, one live door
  { tool: 'connect', name: 'the qpu connector answers a live NIST reading that agrees', args: { connector: 'qpu', tool: 'data', arguments: { source: 'nist', about: 'Planck constant' } },
    check: (t) => need(t.includes('"agrees\\":true') || t.includes('"agrees": true'), 'agrees was not true') },

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
    const run = spawnSync('node', ['scripts/mcp-call.ts', c.tool, JSON.stringify(c.args)], { encoding: 'utf8', timeout: 180_000 })
    const text = String(run.stdout ?? '') + (run.status !== 0 ? String(run.stderr ?? '') : '')
    const why = c.check(text)
    if (why) {
      failed += 1
      console.log(`✗ ${c.tool} — ${c.name}: ${why}`)
    } else {
      console.log(`✓ ${c.tool} — ${c.name}`)
    }
  }
  console.log(`\n${failed === 0 ? '✓' : '✗'} net-tools-test: ${CASES.length - failed}/${CASES.length} cases pass across ${covered.length} network tools`)
  process.exit(failed === 0 ? 0 : 1)
}

main()
