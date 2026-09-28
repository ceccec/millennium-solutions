/** ── THE MCP TOOL TABLE — DATA, WITH NOTHING BEHIND IT ────────────────────────────────────────────────
 *
 *  Names, descriptions and schemas only. No handler, no import, no way to reach a network from here.
 *
 *  THIS SPLIT IS A REPAIR, AND THE DEFECT WAS MINE. `scripts/pages.ts` and `scripts/notice.ts` generate
 *  README.md, the homepage and llms.txt, and I had them import `scripts/mcp.ts` to derive the tool count
 *  rather than retype it — correct instinct, wrong module. `scripts/mcp.ts` imports `scripts/api.ts` for
 *  its handlers, and api.ts holds two `fetch` calls. Both generators sit on the verification path that
 *  `scripts/independent.ts` derives from `ci:local`, so importing the handlers put a NETWORK CALL on the
 *  path a third party walks to check this deposit — in the same commit that added a section to llms.txt
 *  telling that third party no network is required.
 *
 *  independent.ts caught it and states the choice without softening it: either the dependency moves off
 *  the verification path, or the claim that this deposit can be checked without an account, a key or a
 *  model is false and must stop being made. The dependency moved.
 *
 *  So the table lives here and the handlers stay in scripts/mcp.ts. A generator that only needs to say how
 *  many tools there are imports this; nothing it reaches can open a socket. */

export const WRITES = new Set(['lean_seal', 'lean_generate', 'pages', 'ledger_trial'])

export const TOOLS = [
  // ── THE COMBINATORIAL LAYER, OPENED TO THE PUBLIC ──────────────────────────────────────────────────────
  // These four were local scripts: the deposit could search the literature, enumerate its statement space
  // and cluster its cross formulas, and a reader could only read the recorded answers. A record of a search
  // nobody else can run is an assertion with a date on it. All four are READ-ONLY here — none appears in
  // WRITES, and the novelty search in particular returns its result instead of filing it, because
  // src/proof/novelty.json is what priorart.lean's kind 2 rests on and a caller must be able to ASK without
  // being able to amend the deposit's evidence. Searching is free; filing is the depositor's act.
  { name: 'novelty', description: 'Run this deposit\'s own prior-art search against any statement: zbMATH, OpenAlex, Crossref, arXiv, and the OEIS for any integer sequence in it. Returns the verdict vocabulary the record uses — CANDIDATES | NONE_FOUND | NONE_FOUND_PARTIAL | NOT_MEASURED | TOO_FEW_TERMS — with the queries sent, the hits, and THE FLOORS APPLIED (relevance ≥ 0.6 over the first 5 results per source), because a verdict cannot be read apart from the domain that made it. NONE_FOUND means "these searches, on this date, returned nothing" and never "nothing earlier exists": a keyword search misses what it does not name. Writes nothing.',
    inputSchema: { type: 'object', properties: { statement: { type: 'string' }, anchors: { type: 'array', items: { type: 'string' } } }, required: ['statement'] } },
  { name: 'coils', description: 'The cross formulas, clustered: every expression in the deposit\'s vocabulary evaluated at every point of a grid and grouped by the resulting vector. Two expressions in one coil prove each other — compute either and the other is computed. Returns the coils, the pair count, and the expressions that coil with NOTHING, which are the ones prose must never interchange.',
    inputSchema: { type: 'object', properties: {}, required: [] } },
  { name: 'discoveries', description: 'Where the next prior-art search should go, consolidating the generators: which theorems sit in files declaring their own work, which have no search recorded, which families are at octave scale. A RANK IS NOT A NOVELTY CLAIM — this orders a queue, and only a performed search can say whether a statement has an earlier author. Reports the coverage, which is the finding: novelty in this tree is measured for a few per cent of it.',
    inputSchema: { type: 'object', properties: { limit: { type: 'number' } }, required: [] } },
  { name: 'formulas', description: 'Every formula this deposit decides, as data: the proposition the Lean kernel accepted, character for character, with its file, namespace, wing, tactic and ledger key. Filter by any of them. Nothing summarised and nothing authored.',
    inputSchema: { type: 'object', properties: { wing: { type: 'string' }, file: { type: 'string' }, contains: { type: 'string' }, limit: { type: 'number' } }, required: [] } },
  { name: 'handle', description: 'The SHORT FORM: the first four hex of an address, plus the message, determine the whole address — so nothing but the message ever travels. Pass text to mint a handle; pass handle AND text to resolve one. ROUTES and REJECTS, never identifies: 16 bits over 2912 sealed receipts collide 71 times (birthday expectation 64.7), and the collision-free minimum today is 7 hex. The window is the FRONT four hex because hex 12..16 and 16..20 overlap the forced version/variant bits and carry less — and hex 12..16 is the third dash-group of the display form, the one an eye would reach for.',
    inputSchema: { type: 'object', properties: { text: { type: 'string' }, handle: { type: 'string' } }, required: ['text'] } },
  { name: 'content_address', description: 'Content-address (uuid) any text — INTEGRITY/provenance, NOT encryption or proof.',
    inputSchema: { type: 'object', properties: { text: { type: 'string' } }, required: ['text'] } },
  { name: 'honesty_gate', description: 'Run the honesty gate: binary 1 (no named overclaim) or 0 (drains) + the hit. A lexical FLOOR, not a truth oracle; passing != true.',
    inputSchema: { type: 'object', properties: { text: { type: 'string' } }, required: ['text'] } },
  { name: 'merkle_fold', description: 'Order-independent merkle fold of a list of strings into one address.',
    inputSchema: { type: 'object', properties: { items: { type: 'array', items: { type: 'string' } } }, required: ['items'] } },
  { name: 'probe', description: 'Read-only reachability probe of a public URL: REACHED | INCONCLUSIVE | DRAINS + HTTP failure-mode (429/403/404/5xx classified, rate-respecting). A timeout is INCONCLUSIVE, never "blocked" — HTTP status indexed honestly.',
    inputSchema: { type: 'object', properties: { url: { type: 'string' } }, required: ['url'] } },
  { name: 'lineage', description: 'Delivery vs churn across release tags, by git tree hash (git\'s own faithful content-address). Identical trees = a tag minted over no delta (churn); distinct = a delivery. Integrity-level: measures WHAT was delivered, not whether it is true. Heroes and traitors by deeds, not statements.',
    inputSchema: { type: 'object', properties: {}, required: [] } },
  { name: 'verify', description: 'Audit any prose/message, or decode-and-verify a uuid across BOTH evidence sets. Prose → honesty-gate verdict + content-address. A uuid is a ONE-WAY address (never reversed); "decode" looks it up in (1) the agent-statement receipts (src/receipts/, verifies toUuid(message)===uuid + observer/role) then (2) the discovery ledger (reports the fact, chain position, and whether the chain-of-custody link is intact). In neither ⇒ opaque, honestly.',
    inputSchema: { type: 'object', properties: { text: { type: 'string' } }, required: ['text'] } },
  { name: 'discover', description: 'The discovery engine: computationally-generated + curated candidate facts over ℤ/9, each tested by exhaustion. Returns discovered (provable) vs refuted + a discovery root. Decidable facts only.',
    inputSchema: { type: 'object', properties: {}, required: [] } },
  { name: 'recompute', description: 'Recompute ALL theorems: re-run every candidate\'s formula (its test) by exhaustion, report how many hold vs refuted, verify every RECORDED ledger theorem still recomputes true, and fold the recompute root — the whole deposit recomputes from its theorems, not from stored answers. A theorem without a formula that recomputes true is refused (hallucination). Decidable.',
    inputSchema: { type: 'object', properties: {}, required: [] } },
  { name: 'rosetta', description: 'The completed cross-domain rosetta as a reusable endpoint: every domain family one hop from the shared core, content-addressed and folded to one rosetta root, all addresses distinct (no collision unless consolidated or redistributed). Returns the core address, the domain list and count, the collision check, and the rosetta root. Integrity of the cross-domain map, not truth.',
    inputSchema: { type: 'object', properties: {}, required: [] } },
  { name: 'audit', description: 'Self-audit of THIS MCP server: content-address every tool (name+description+schema), verify each declared tool has a handler and each handler is declared (coverage), fold to one self-audit root. Integrity of the tool surface, not truth.',
    inputSchema: { type: 'object', properties: {}, required: [] } },
  { name: 'forensics', description: 'Chain-of-custody for the discovery ledger: recompute the receipt chain link-by-link (receipt[i]=toUuid(receipt[i-1]→key[i]), seed axiom:TRINITY), pinpoint any break, check for duplicate keys/receipts, and fold a tamper-evident seal. Genesis discontinuities are a documented baseline; a NEW break is tampering. Integrity/provenance of evidence, not truth.',
    inputSchema: { type: 'object', properties: {}, required: [] } },
  // ── THE LEAN WORKFLOW, encoded. Each of these was run by hand, repeatedly, with a pause for confirmation
  // between steps — which is how a check gets skipped and how a session stalls waiting on a human for work a
  // machine already knows how to do. They are tools now: callable, idempotent, and reporting measurements
  // rather than prose. Every one shells to the script that owns the operation, so there is one implementation.
  { name: 'lean_verify', description: 'Compile every Lean file and audit it per theorem: #print axioms on each, hygiene (no sorry / native_decide outside comments), theorem counts. Fails if any file carries an axiom or does not compile. This is the gate every seal depends on.',
    inputSchema: { type: 'object', properties: { file: { type: 'string', description: 'optional single file to verify' } }, required: [] } },
  { name: 'lean_seal', description: 'Seal every compiled, axiom-free Lean theorem into the ledger with a chained receipt. ONLY by-decide theorems are sealed — rfl on a declared constant proves the declaration, not a fact. Gated on lean_verify; seals nothing if the layer does not verify. Pass dry=true to report without writing.',
    inputSchema: { type: 'object', properties: { dry: { type: 'boolean' } }, required: [] } },
  { name: 'lean_generate', description: 'Generate quantified Lean for ledger families — one theorem subsuming a whole family of per-parameter rows. Five gates: compiles, axiom-free, agrees with the ledger test at every parameter, carries a boundary case, and flags a zero divisor in range. Pass emit=true to write.',
    inputSchema: { type: 'object', properties: { emit: { type: 'boolean' } }, required: [] } },
  { name: 'metrics_face', description: 'This repository\'s build face: one row per measurement, each carrying the claim, the value, THE COMMAND THAT RECOMPUTES IT, and a receipt over the row\'s own fields. Gate results are run, not remembered, and a failing gate is reported as FAIL rather than suppressed. A sibling session calls this instead of being sent a prose summary.',
    inputSchema: { type: 'object', properties: {}, required: [] } },
  { name: 'verify_face', description: 'Verify a face emitted by ANY repository — pass its JSON or a path. Recomputes every receipt and the merkle root from the rows themselves, needing nothing from the emitting tree. INTEGRITY ONLY: this establishes that the rows are unaltered since sealing, NOT that any figure is correct. Reading a passing verify as evidence a number is right is the error this exists to prevent.',
    inputSchema: { type: 'object', properties: { json: { type: 'string' }, path: { type: 'string' } }, required: [] } },
  { name: 'peer_faces', description: 'List and verify every face present in the shared fusion directory, so this session can check what siblings published rather than trust their reports. Reports each repo, its root, whether it is intact, and any gate it published as FAIL.',
    inputSchema: { type: 'object', properties: { dir: { type: 'string' } }, required: [] } },
  // ── THE CROSS-DOMAIN LAYER, OPENED TO THE PUBLIC ───────────────────────────────────────────────────────
  // Both READ. `entanglements` returns a clustering the kernel has already decided and `api_joins` asks other
  // people's servers and files nothing here — a caller must be able to run the experiment without being able
  // to amend the record of it, which is the same rule `novelty` follows.
  { name: 'entanglements', description: 'The cross-domain identity map: 80 expressions from 24 subjects — music, biology, sport, juggling, botany, law, textiles, cryptography and the rest — evaluated on ONE shared grid n = 1..20 and clustered by agreeing at every point. Returns the identities (a knockout bracket and an n-bit register are the same integer; phyllotaxis, breeding pairs and Zeckendorf are one recursion), the domains each joins, the expressions that join NOTHING, and whether the entanglement graph is connected. Decided in src/proof/coils.lean, so the identities hold whether or not this tool answers. An identity is not an explanation: neither subject explains the other, they are one object approached from two sides.',
    inputSchema: { type: 'object', properties: { domain: { type: 'string' }, spanningOnly: { type: 'boolean' } } } },

  { name: 'api_joins', description: 'Ask several independent public services for the SAME entity and report which values two or more of them return — the join DISCOVERED from the data rather than declared. PubChem, ChEMBL and ChEBI all return the InChIKey BSYNRYMUTXBXSQ-UHFFFAOYSA-N for aspirin, at three different paths, from two institutions on two continents. Negative results are reported and are the interesting ones: two plant-naming authorities share no joinable value, which is the problem Kew\'s credential-gated MPNS exists to solve. A JOIN IS NOT A TRUTH — it establishes that two databases mean the same entity, never that either is correct; two services can agree and both be wrong. Reaches the network; writes nothing.',
    inputSchema: { type: 'object', properties: { probe: { type: 'string', enum: ['drug', 'protein', 'plant', 'paper'] } } } },

  // ── AUTONOMY: WHAT IS OPEN, AND WHAT IS LIVE ───────────────────────────────────────────────────────────
  // Ten capabilities existed as scripts and NONE was reachable through MCP — including every one that reads
  // the network. A caller could be told what this deposit proves and could not ask what it still owes, nor
  // whether the release it describes is actually on the registry. Both are read-only.
  { name: 'leads', description: 'The deposit\'s own open questions, derived from the tree rather than listed: uncontrolled refusing gates, unminted depositions, theorems that read back a hand-set value, MCP tools an install cannot reach. Also CROSSES them by cause — publication, authority, instrument, derivation, environment — because two leads sharing a cause are one problem with two faces and only one of them may be closable. Reports and does not gate: an open question is work not done, which is not work that is wrong.',
    inputSchema: { type: 'object', properties: { area: { type: 'string' } } } },

  { name: 'readers', description: 'Ask the scientific and medical sources this deposit investigates through — Europe PMC, PubMed, PubChem, ChEMBL, UniProt, Ensembl, KEGG, Reactome, GBIF, RxNorm, openFDA, MeSH, ClinicalTrials.gov and more — whether each still answers with a fact known BEFORE it was asked. Three verdicts kept apart: PROVEN, WRONG (the reader is broken OR the expectation was), and NOT MEASURED (it did not answer — silence is not absence). 8 further sources are named as credential- or licence-gated rather than omitted, because an unrecorded gap becomes an implicit claim of completeness. CITATION INSTRUMENTS, NOT MEDICAL ADVICE: a documented traditional use is an anthropological fact, never evidence a use works, and never a dose.',
    inputSchema: { type: 'object', properties: { domain: { type: 'string' }, list: { type: 'boolean' } } } },

  { name: 'live', description: 'What this deposit has actually SHIPPED, asked of the registries rather than the tree: the npm version against package.json, the newest provenance tag, and the site against the ledger this tree holds. A green publish workflow says npm was called, not that the version on the registry is the one here — that gap has been real for three releases. Reports, never gates: network state must not decide whether a local build is allowed.',
    inputSchema: { type: 'object', properties: {} } },

  // ── AND THE LIVE CONNECTOR: this server calling ANOTHER MCP server ─────────────────────────────────────
  { name: 'connect', description: 'Call a declared live MCP server and return ITS answer, attributed. With no arguments, lists the connectors and what each one\'s answers do and do not establish. Currently one: qpu.uuidna.com, sixteen tools over the same JSON-RPC this server speaks — its state-vector circuit, its Lean rows, and the Shor run factoring 91 = 7 x 13 by period-finding. FORWARDS, NEVER MIRRORS: copying a remote answer into this tree would make a second source of one truth that drifts from the first and then disagrees silently. A connected answer is a third party\'s report of ITSELF on a date, carrying no more authority than that — and two services agreeing is a join key, never a truth.',
    inputSchema: { type: 'object', properties: { connector: { type: 'string' }, tool: { type: 'string' }, arguments: { type: 'object' } } } },

  { name: 'ledger_status', description: 'Composition of the ledger: total, live, lean-backed, revoked, portable-to-Lean, chain breaks, duplicate keys/receipts, octave remainder. Measurement only — writes nothing.',
    inputSchema: { type: 'object', properties: {}, required: [] } },
  { name: 'ledger_trial', description: 'Put every ledger entry in the dock and record a verdict with its ground — no bare verdicts. Writes src/proof/trial-all.json. Adjudicates, never removes: what follows from a refusal is the captain\'s to order.',
    inputSchema: { type: 'object', properties: {}, required: [] } },
  { name: 'pages', description: 'Regenerate README.md and the homepage from one generator. Every claim derives its sentence from the artefact it reads and must declare the values it read; a claim that measures nothing is refused and nothing is written.',
    inputSchema: { type: 'object', properties: {}, required: [] } },
]

export const LISTED = [
  {
    name: 'list_tools',
    description: "List this server's tools, or give one tool's description and inputSchema.",
    inputSchema: { type: 'object', properties: { name: { type: 'string' } } },
  },
  {
    name: 'call_tool',
    description: "Call one of this server's tools by name with its arguments. `list_tools` lists them.",
    inputSchema: { type: 'object', properties: { name: { type: 'string', enum: TOOLS.map((t) => t.name) }, arguments: { type: 'object' } }, required: ['name'] },
  },
]

/** ── WHAT EACH TOOL NEEDS BEYOND THE PUBLISHED PACKAGE ────────────────────────────────────────────────────
 *
 *  The deposit's standing claim is that a third party can check it "without an account, a key or a model".
 *  That is true of the CORE and it is not true of every tool on this surface, and the difference was nowhere
 *  written down — so a caller discovered it by getting an error, or worse, by getting a plausible answer.
 *
 *    core    nothing but this package: pure computation over values the caller passes in
 *    tree    the source tree — it reads src/proof/*.lean, or shells out to a script in scripts/
 *    lean    the Lean toolchain on PATH, over and above the tree
 *    ledger  src/proof/discovered.json, which the published package does not ship
 *    git     a git checkout with tags; the published package is not one
 *    net     the network, and therefore somebody else's server
 *    shared  a shared fusion directory that only exists where sibling sessions write
 *
 *  8 OF 25 ARE `core`. That is the honest size of the self-sufficient surface and it is worth stating plainly
 *  rather than leaving a reader to infer 25. scripts/mcp-gate.ts derives this same table from the handler
 *  source and fails on any disagreement, so the declaration cannot drift from what the code reaches — and its
 *  first derivation was three too GENEROUS, which is the direction an error about one's own self-sufficiency
 *  always goes. */
export type Need = 'core' | 'tree' | 'git' | 'lean' | 'ledger' | 'net' | 'shared'

export const NEEDS: Record<string, Need[]> = {
  novelty: ['net'],
  entanglements: ['tree'],
  leads: ['tree'],
  readers: ['net', 'tree'],
  live: ['net', 'tree'],
  connect: ['net'],
  // BOTH: it reaches other people's servers AND it runs a script from this tree. The first declaration said
  // only `net`, which was incomplete in the direction that flatters — a tool needing one thing looks more
  // portable than one needing two, and mcp-gate refused it.
  api_joins: ['net', 'tree'],
  coils: ['tree'],
  discoveries: ['tree'],
  formulas: ['tree'],
  handle: ['core'],
  lean_verify: ['lean', 'tree'],
  lean_seal: ['lean', 'tree'],
  lean_generate: ['lean', 'tree'],
  ledger_trial: ['tree'],
  pages: ['shared', 'tree'],
  metrics_face: ['tree'],
  verify_face: ['core'],
  peer_faces: ['shared'],
  ledger_status: ['ledger'],
  content_address: ['core'],
  honesty_gate: ['core'],
  merkle_fold: ['core'],
  probe: ['net'],
  verify: ['ledger'],
  lineage: ['git'],
  discover: ['core'],
  recompute: ['ledger'],
  rosetta: ['core'],
  forensics: ['ledger'],
  audit: ['core'],
}

/** The tools a caller can run from the published package alone — derived, so it cannot be overstated. */
export const SELF_SUFFICIENT = Object.entries(NEEDS)
  .filter(([, n]) => n.length === 1 && n[0] === 'core').map(([k]) => k).sort()
