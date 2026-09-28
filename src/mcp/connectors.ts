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
}

export const CONNECTORS: Connector[] = [
  {
    name: 'qpu',
    endpoint: 'https://qpu.uuidna.com/mcp',
    attribution: 'qpu.uuidna.com — a Cloudflare Worker serving JSON-LD, built from ~/github/uuidna/qpu. Not this repository.',
    for: 'its sixteen tools: the state-vector circuit, its Lean rows, the Shor run that factors 91 = 7 x 13 by '
      + 'period-finding, the crypto catalogue, and its own end-to-end proof. src/proof/qpu.lean decides which of '
      + 'its constants this deposit independently counts the same way — 14 = 2 x 7, hexbit x rays = 28, 2^bits.',
    notFor: 'quantum advantage, and it does not claim any: its device field reads "exact-amplitudes", a '
      + 'simulator. Nor does a green answer mean a test passed — that service\'s OWN glossary says `holds` means '
      + '"this record is self-consistent and recomputes to itself; not a claim that the test it describes '
      + 'passed", and `pass` is a separate field that can be false beside it. Read its glossary before its verdicts.',
    readOnly: true,
  },
]

export const CONNECTOR = (name: string): Connector | undefined => CONNECTORS.find((c) => c.name === name)
