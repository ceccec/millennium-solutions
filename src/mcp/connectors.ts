/** ── LIVE MCP CONNECTORS — other people's servers, declared as data ────────────────────────────────────────
 *
 *  NAMES, ENDPOINTS AND BOUNDARIES ONLY. No fetch is reachable from this module, for the reason
 *  src/mcp/index.ts records: generators on the verification path import these registries to derive counts,
 *  and a registry that imported its own client would put a network call on the path this deposit tells a
 *  third party needs no network.
 *
 *  WHY A CONNECTOR AND NOT A COPY. qpu.uuidna.com runs its own MCP server with sixteen tools over the same
 *  JSON-RPC this deposit speaks. The tempting move is to mirror its answers here — and that is exactly the
 *  defect this tree has removed twice today under other names: a second source of one truth, which drifts
 *  from the first and then disagrees with it silently. A connector forwards the question and returns THAT
 *  SERVER'S answer, attributed, so there is one source and the reader knows whose it is.
 *
 *  WHAT A CONNECTED ANSWER IS. It is a third party's report of itself, fetched on a date, and it carries no
 *  more authority than that. src/proof/qpu.lean decides what FOLLOWS from qpu's constants if they are as
 *  served — an implication, not a corroboration — and nothing reachable from here can check a remote claim.
 *  Two services agreeing is a join key, never a truth: this tree has the lesson at first hand from a broken
 *  filter that returned exactly the API's own total and was believed BECAUSE the number agreed. */

export type Connector = {
  name: string
  /** The JSON-RPC endpoint. MCP over HTTP POST. */
  endpoint: string
  /** Whose server it is, and under what terms. Every one of these belongs to somebody else. */
  attribution: string
  /** What it is good for. */
  for: string
  /** What an answer from it does NOT establish. Non-empty by rule, checked by scripts/mcp-gate.ts. */
  notFor: string
  /** Reads only. A connector that could write to somebody else's server is not in this registry, and the
   *  field is here so that adding one is a visible decision rather than an omission. */
  readOnly: true
  /** THE FALLBACK IS THE SOURCE, NOT ANOTHER SERVER. When the served endpoint refuses a door or does not answer, the same
   *  unit can be run from its public repository at a named sha: cloned once into the ignored cache, keyed by that sha,
   *  and imported as a module (the qpu package's exports point at TypeScript sources, so a checkout is runnable as is).
   *  An answer from it says so (`via`) beside the served refusal, so the served surface's gap stays visible. */
  source?: { github: string; ref: string; entry: string }
}

export const CONNECTORS: Connector[] = [
  {
    name: 'qpu',
    // THE DOOR THE UNIT DECLARES. Its own source names the API as https://qpu.uuidna.com/api/mcp (src/quantum/net/
    // cloudflare.ts) and redirects /mcp there; a POST does not follow a redirect, so on 2026-11-08 the old path
    // answered the app's HTML page and every court through it read UNPARSED. The served MCP there is the Payload
    // plugin's, and a door it does not list falls back to the unit's source below.
    endpoint: 'https://qpu.uuidna.com/api/mcp',
    attribution: 'qpu.uuidna.com — the QPU app on Cloudflare (Payload, Next.js), built from ~/github/uuidna/qpu. Not this repository.',
    for: 'its sixteen tools: the state-vector circuit, its Lean rows, the Shor run that factors 91 = 7 x 13 by '
      + 'period-finding, the crypto catalogue, and its own end-to-end proof. src/proof/qpu.lean decides which of '
      + 'its constants this deposit independently counts the same way — 14 = 2 x 7, hexbit x rays = 28, 2^bits.',
    notFor: 'quantum advantage, and it does not claim any: its device field reads "exact-amplitudes", a '
      + 'simulator. Nor does a green answer mean a test passed — that service\'s OWN glossary says `holds` means '
      + '"this record is self-consistent and recomputes to itself; not a claim that the test it describes '
      + 'passed", and `pass` is a separate field that can be false beside it. Read its glossary before its verdicts.',
    readOnly: true,
    source: { github: 'uuidna/qpu', ref: 'main', entry: 'src/quantum/processing/mcp.ts' },
  },
]

export const CONNECTOR = (name: string): Connector | undefined => CONNECTORS.find((c) => c.name === name)

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

/** the connector's source, resolved: the ref's sha from the remote, a depth-one clone keyed by it, the entry imported */
export const fromSource = async (c: Connector): Promise<{ via: string; dir: string; handle: (m: unknown) => unknown } | { via: null; why: string }> => {
  if (!c.source) return { via: null, why: `${c.name} names no source to fall back on` }
  const url = `https://github.com/${c.source.github}.git`
  let sha = ''
  try { sha = execFileSync('git', ['ls-remote', url, `refs/heads/${c.source.ref}`], { encoding: 'utf8', timeout: 60_000 }).split(/\s+/)[0] ?? '' } catch (e) { return { via: null, why: `the remote did not answer ls-remote: ${String((e as Error).message).slice(0, 120)}` } }
  if (!/^[0-9a-f]{40}$/.test(sha)) return { via: null, why: `no sha for ${c.source.ref} at ${url}` }
  const root = resolve('.vitepress', 'cache', 'connectors', c.name)
  const dir = join(root, sha)
  if (!existsSync(join(dir, c.source.entry))) {
    mkdirSync(root, { recursive: true })
    try { execFileSync('git', ['clone', '--quiet', '--depth', '1', '--branch', c.source.ref, url, dir], { encoding: 'utf8', timeout: 300_000 }) } catch (e) { return { via: null, why: `the clone failed: ${String((e as Error).message).slice(0, 160)}` } }
    const got = execFileSync('git', ['-C', dir, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
    if (got !== sha) return { via: null, why: `the ref moved between ls-remote (${sha.slice(0, 9)}) and the clone (${got.slice(0, 9)}); call again` }
  }
  // THE IMPORT CAN FAIL ON THE UNIT'S OWN TREE (measured 2026-11-08: qpu main at dfddbd70 imports src/quantum/apps/
  // calculator/index.ts, which that commit does not carry). An exception here escaped `connect` as a bare JSON-RPC
  // error with no status, and the court read it as its own failure. It is the source not answering: NOT MEASURED, named.
  let mod: { handle?: (m: unknown) => unknown }
  try { mod = await import(pathToFileURL(join(dir, c.source.entry)).href) as { handle?: (m: unknown) => unknown } }
  catch (e) { return { via: null, why: `${c.source.entry} at ${sha.slice(0, 9)} does not import: ${String((e as Error).message ?? e).slice(0, 240)}` } }
  if (typeof mod.handle !== 'function') return { via: null, why: `${c.source.entry} at ${sha.slice(0, 9)} exports no handle` }
  return { via: `github:${c.source.github}@${sha.slice(0, 9)}`, dir, handle: mod.handle }
}
