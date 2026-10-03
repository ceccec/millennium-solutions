/** ── THE SELF-SUFFICIENT MCP SERVER — the part a stranger can run from the package alone ───────────────────
 *
 *  WHY THIS FILE EXISTS. The deposit's standing claim is that a third party can check it "without an account,
 *  a key or a model". scripts/mcp.ts is the surface that claim is made on, and it was NOT IN THE PACKAGE:
 *  package.json ships ["dist", "README.md", "LICENSE", "CITATION.cff"], declares no `bin`, and nothing in
 *  dist/ was the server. So the only way to reach any tool was to clone the repository — which is exactly the
 *  thing the claim says is unnecessary. `leads.ts` reports this as `mcp-ship`, and crossing the leads by cause
 *  is what made it worth doing first: `mcp-ship` and `deposit` share the cause PUBLICATION, and of the two,
 *  only this one is closable here. The other needs the depositor's Zenodo token.
 *
 *  WHAT IS HERE AND WHY IT IS FEWER THAN THE WHOLE SURFACE. The tools that need nothing beyond the package are
 *  the `core` ones (src/mcp/index.ts NEEDS, checked against the handler source by scripts/mcp-gate.ts), minus
 *  the ones named in CANNOT_SHIP with a reason that is true today:
 *    · discover needs CANDIDATES from scripts/discover.ts, which is repository logic and not a module.
 *    · recompute re-runs those candidates' formulas — the same repository logic.
 *  honesty_gate stood in that list with the reason that `computes` came from @uuidna/uuidna, a devDependency,
 *  and that making it a runtime dependency would spend the zero-dependency core for one tool. That trade was
 *  made on 2026-10-03 for the package as a whole (@uuidna/uuidna and @uuidna/qpu are runtime dependencies of
 *  what is published), so the reason stopped being true and the exclusion with it: a reason that has stopped
 *  being true is worse than none, because it stops the next reader doing the right thing. The count is
 *  derived below rather than typed, so it cannot claim more than it serves.
 *
 *  WHAT THIS IS NOT. It is not a reduced copy of the full server and it duplicates no handler: each tool below
 *  is the same computation over values the CALLER passes in, which is precisely why it needs no tree. Nothing
 *  here reads the ledger, compiles Lean, shells out or opens a socket. A caller wanting the other nineteen
 *  clones the repository, and `list_tools` says so per tool instead of failing when they try. */
import { toUuid, merkleFold, merge } from '../0/index.ts'
import { handle, resolve, HANDLE_HEX } from '../handle/index.ts'
import { checkFace, type Face } from '../face/index.ts'
import { CORE as ROSETTA_CORE, DOMAINS as ROSETTA_DOMAINS } from '../the/rosetta/index.ts'
import { TOOLS, NEEDS, WRITES } from './index.ts'
// The gate itself — no local logic, by order (scripts/honesty-gate.ts carries the same line for the full server).
import { computes } from '@uuidna/uuidna'

/** ── THE EVIDENCE TOOLS, OVER A LEDGER THE CALLER IS HANDED ───────────────────────────────────────────────
 *  Four tools measure the discovery ledger, and the package did not ship it — so they were `ledger` tools,
 *  unreachable from an install, and the deposit's central evidence was the one thing a stranger could not
 *  examine. That is the worst place for the publication gap to sit.
 *
 *  THEY TAKE THE LEDGER AS AN ARGUMENT. This module may not read a file: it is compiled with no node type
 *  definitions, which is the standing check that nothing in the published core reaches a node builtin. So the
 *  reading happens in mcp.bin.ts, the one file allowed to know it is a process, and these stay pure functions
 *  of the rows. That is a better shape than a file path anyway — the same function verifies a ledger the
 *  caller obtained from anywhere, including one this deposit never wrote. */
export type Row = { key: string; name?: string; receipt: string; revoked?: boolean; reason?: string; supersededBy?: string }

export const ledgerStatus = (rows: Row[]) => {
  const live = rows.filter((r) => !r.revoked)
  const carried = rows.filter((r) => r.revoked && r.supersededBy)
  const keys = new Map<string, number>(), receipts = new Map<string, number>()
  for (const r of rows) { keys.set(r.key, (keys.get(r.key) ?? 0) + 1); receipts.set(r.receipt, (receipts.get(r.receipt) ?? 0) + 1) }
  return {
    total: rows.length, live: live.length, revoked: rows.length - live.length, carried: carried.length,
    duplicateKeys: [...keys].filter(([, n]) => n > 1).map(([k]) => k),
    duplicateReceipts: [...receipts].filter(([, n]) => n > 1).map(([k]) => k),
    octave: { size: rows.length, remainder: rows.length % 8, exact: rows.length % 8 === 0 },
    note: 'Measurement of the ledger as given. It says nothing about whether any entry is TRUE — only what the record contains and whether its keys and receipts are unique.',
  }
}

/** The chain: receipt[i] = toUuid(receipt[i-1] + '→' + key[i]). Recomputed link by link from the rows alone,
 *  so a break is located rather than reported as a total. The first two indices are a documented genesis
 *  discontinuity in this deposit's own record and are reported as such instead of counted as tampering. */
export const forensicsOf = (rows: Row[], seed = 'axiom:TRINITY') => {
  const breaks: { index: number; key: string; expected: string; found: string }[] = []
  let prev = toUuid(seed)
  rows.forEach((r, i) => {
    const expected = toUuid(prev + '→' + r.key)
    if (expected !== r.receipt) breaks.push({ index: i, key: r.key, expected, found: r.receipt })
    prev = r.receipt
  })
  const genesis = breaks.filter((b) => b.index < 2)
  return {
    entries: rows.length, breaks: breaks.length, genesisDiscontinuities: genesis.length,
    newBreaks: breaks.filter((b) => b.index >= 2).slice(0, 8),
    intactFromIndex: breaks.length === genesis.length ? 2 : null,
    seal: merkleFold(rows.map((r) => r.receipt)),
    note: 'Chain-of-custody and tamper-evidence, not truth. Indices 0 and 1 are a documented baseline in this deposit; a break at index 2 or later is tampering.',
  }
}

/** A uuid is a one-way address. This does not reverse it — it LOOKS IT UP, and says plainly when it is not
 *  there rather than implying the address is meaningless. */
export const verifyIn = (rows: Row[], uuid: string) => {
  const at = rows.findIndex((r) => r.receipt === uuid.toLowerCase())
  if (at < 0) return { uuid, found: false,
    note: 'Not a receipt in this ledger. That is not the same as opaque or invalid: this entry carries only the ledger it was handed, and the address may belong to the agent-statement receipts, which the full server reads.' }
  const r = rows[at]
  return { uuid, found: true, index: at, key: r.key, name: r.name ?? null, live: !r.revoked,
    supersededBy: r.supersededBy ?? null, reason: r.reason ?? null,
    chainIntactHere: at === 0 || toUuid(rows[at - 1].receipt + '→' + r.key) === r.receipt,
    note: 'The address was found and its chain link recomputed. Integrity and position, never truth of the statement.' }
}

/** The tools this entry serves — DERIVED from NEEDS, not listed, minus the two that need a dependency or
 *  repository logic. Those two are named with their reason so the subtraction is auditable. */
export const CANNOT_SHIP: Record<string, string> = {
  discover: 'its candidate set is scripts/discover.ts — repository logic, not a module',
  recompute: 'it re-runs every candidate\'s formula, and the formulas are in scripts/discover.ts — the same repository logic. Reading the ledger is not enough: this tool recomputes what the ledger RECORDS, which needs the code that computed it',
}
const CORE_TOOLS = Object.entries(NEEDS)
  .filter(([k, n]) => n.length === 1 && n[0] === 'core' && !CANNOT_SHIP[k])
  .map(([k]) => k)
/** The ledger tools ship too, because the ledger ships. They are `ledger` in NEEDS and that stays true — the
 *  requirement did not vanish, it is SATISFIED by the package now, which is a different thing and the reason
 *  `hasLedger()` gates them rather than a redeclaration. */
const LEDGER_TOOLS = Object.entries(NEEDS)
  .filter(([k, n]) => n.length === 1 && n[0] === 'ledger' && !CANNOT_SHIP[k])
  .map(([k]) => k)
/** `formulas` is declared `tree` and that stays true — it reads the Lean sources in the full server. Here it
 *  is satisfied by data the package carries, which is a different thing from the requirement disappearing. */
const DATA_TOOLS = ['formulas']
export const SERVED_CORE = [...CORE_TOOLS].sort()
export const SERVED_WITH_LEDGER = [...CORE_TOOLS, ...LEDGER_TOOLS, ...DATA_TOOLS].sort()
/** WHAT IS SERVED DEPENDS ON WHAT IS LOADED, so this is a function and not a constant. A constant would have
 *  had to pick one answer before the transport had read anything, and the honest answer differs: a caller with
 *  the ledger beside the package gets the ledger tools too, and a caller without it does not. Both are told which. */
export const served = (): string[] => [
  ...SERVED_CORE,
  ...(hasLedger() ? LEDGER_TOOLS : []),
  ...(hasFormulas() ? DATA_TOOLS : []),
].sort()

/** ── THE FORMULAS, OVER DATA THE PACKAGE CARRIES ───────────────────────────────────────────────────────────
 *  `formulas` returned every proposition the kernel accepted, with its file, wing, tactic and ledger key — and
 *  it needed the SOURCE TREE, because it read src/proof/*.lean directly. The same content already exists as
 *  public/formulas.jsonld, which the site publishes and e2e checks: 1,248 items carrying name, statement,
 *  identifier, source, wing and proof. So the tool needed the tree only because of where it happened to read,
 *  not because of what it returns.
 *
 *  Shipped beside the ledger, and pure for the same reason: this module is compiled with no node type
 *  definitions, so it cannot read a file, and the reading happens in mcp.bin.ts. A caller can also pass rows
 *  obtained from anywhere — including the published JSON-LD fetched over the web — and get the same answer. */
export type Formula = { name: string; statement: string; key: string; source: string; wing: string; proof: string }

export const formulasFrom = (rows: Formula[], a: { wing?: string; file?: string; contains?: string; limit?: number } = {}) => {
  let out = rows
  const total = out.length
  if (a.wing) out = out.filter((r) => r.wing === a.wing)
  if (a.file) out = out.filter((r) => r.source === a.file)
  if (a.contains) {
    const q = a.contains.toLowerCase()
    out = out.filter((r) => (r.name + ' ' + r.statement).toLowerCase().includes(q))
  }
  const limit = Math.max(1, Math.min(Number(a.limit ?? 40), 500))
  return {
    total, matched: out.length, showing: Math.min(limit, out.length),
    wings: [...new Set(rows.map((r) => r.wing))].sort(),
    formulas: out.slice(0, limit),
    note: 'The proposition the Lean kernel accepted, character for character, with the file and tactic that '
      + 'discharged it. Nothing here is summarised and nothing is authored. A formula being listed says the '
      + 'kernel accepted it, not that it is significant.',
  }
}

/** Injected by the transport when a ledger is present beside the package. Absent is reported as absent. */
let ROWS: Row[] | null = null
export const withLedger = (rows: Row[]) => { ROWS = rows }
export const hasLedger = () => ROWS !== null
let FORMS: Formula[] | null = null
export const withFormulas = (rows: Formula[]) => { FORMS = rows }
export const hasFormulas = () => FORMS !== null
const rowsOrRefuse = (tool: string): Row[] => {
  if (!ROWS) throw new Error(`${tool} measures the discovery ledger and no ledger was loaded. `
    + 'That is NOT a ledger of zero entries — it is an absent one. The published package carries the ledger at '
    + 'dist/data/discovered.json; if it is missing, pass one, or clone the repository for the full server.')
  return ROWS
}

const H: Record<string, (a: any) => string> = {
  formulas: (a) => {
    if (!FORMS) throw new Error('formulas: the formula catalogue is not loaded. The published package carries it '
      + 'at dist/data/formulas.jsonld; if it is missing, pass rows, or clone the repository for the full server. '
      + 'An absent catalogue is NOT a catalogue of zero formulas.')
    return JSON.stringify(formulasFrom(FORMS, a ?? {}))
  },
  ledger_status: () => JSON.stringify(ledgerStatus(rowsOrRefuse('ledger_status'))),
  forensics: () => JSON.stringify(forensicsOf(rowsOrRefuse('forensics'))),
  verify: (a) => {
    const u = String(a?.uuid ?? '')
    if (!u) throw new Error('verify: uuid is required. This entry looks an address up in the ledger; for prose auditing, the honesty gate lives in the full server.')
    return JSON.stringify(verifyIn(rowsOrRefuse('verify'), u))
  },
  content_address: (a) => {
    const text = String(a?.text ?? '')
    if (!text) throw new Error('content_address: text is required')
    return JSON.stringify({ uuid: toUuid(text), of: text.length + ' character(s)',
      note: 'INTEGRITY and provenance, not encryption and not proof. The same text always gives this address; the address never gives the text back.' })
  },
  merkle_fold: (a) => {
    const items = (a?.items ?? []) as unknown[]
    if (!Array.isArray(items) || !items.length) throw new Error('merkle_fold: items must be a non-empty array of strings')
    const xs = items.map(String)
    return JSON.stringify({ root: merkleFold(xs), count: xs.length, pairwise: xs.length > 1 ? merge(xs[0], xs[1]) : null,
      note: 'Order-independent: the same set of items folds to the same root in any order. Leaves and nodes are domain-separated and length-prefixed, so no regrouping of the inputs produces this root.' })
  },
  handle: (a) => {
    const text = String(a?.text ?? '')
    if (!text) throw new Error('handle: text is required')
    const given = a?.handle ? String(a.handle) : null
    // `resolve` takes the MESSAGE, not a list of them, and returns { uuid, carries } — it never returns null.
    // The first version here wrote `resolve(given, [text]) !== null`, which passed an array where a string
    // belongs and then compared the result against null: a check that was true for every input, including
    // every wrong handle. The typed build refused the argument, which is the only reason it was caught —
    // at runtime it would have reported every handle as resolving.
    if (given) {
      const r = resolve(given, text)
      return JSON.stringify({ handle: given, address: r.uuid, carries: r.carries, hex: HANDLE_HEX,
        note: 'A handle ROUTES and REJECTS; it never identifies. `carries` false is a definite no; `carries` true means NOT EXCLUDED — sixteen bits collide, so it is never "the same".' })
    }
    return JSON.stringify({ handle: handle(text), hex: HANDLE_HEX, address: toUuid(text),
      note: 'The first four hex of the address. Nothing but the message ever travels — the handle plus the message determine the whole address.' })
  },
  honesty_gate: (a) => {
    const text = String(a?.text ?? '')
    if (!text) throw new Error('honesty_gate: text is required — the gate reads prose the caller passes in; it reads no file here')
    const r = computes(text)
    return JSON.stringify({ binary: r.binary, hit: r.hit,
      note: r.binary ? 'no overclaim shape (a lexical FLOOR, not truth — passing is not being right)' : 'drains: ' + r.hit })
  },
  verify_face: (a) => {
    const raw = a?.json
    if (!raw) throw new Error('verify_face: json is required — pass the face object or its JSON text. This entry reads no files.')
    const face = (typeof raw === 'string' ? JSON.parse(raw) : raw) as Face
    const r = checkFace(face)
    return JSON.stringify({ ...r,
      note: 'INTEGRITY ONLY. A passing verdict establishes that the rows are unaltered since sealing, NOT that any figure in them is correct. Reading it as evidence a number is right is the error this tool exists to prevent.' })
  },
  rosetta: () => JSON.stringify({ core: ROSETTA_CORE, domains: ROSETTA_DOMAINS.length,
    addresses: ROSETTA_DOMAINS.map((d: string) => ({ domain: d, uuid: toUuid(d) })),
    distinct: new Set(ROSETTA_DOMAINS.map((d: string) => toUuid(d))).size === ROSETTA_DOMAINS.length,
    root: merkleFold(ROSETTA_DOMAINS.map((d: string) => toUuid(d))),
    note: 'Integrity of the cross-domain map, not truth of anything in it.' }),
  audit: () => {
    const here = served()
    const missing = here.filter((n) => !H[n])
    const extra = Object.keys(H).filter((n) => !here.includes(n))
    return JSON.stringify({
      entry: 'self-sufficient', ledgerLoaded: hasLedger(), served: here.length, of: TOOLS.length,
      declaredWithoutHandler: missing, handlerWithoutDeclaration: extra,
      writes: [...WRITES].filter((w) => here.includes(w)),
      root: merkleFold(here.map((n) => toUuid(n + ':' + (TOOLS.find((t) => t.name === n)?.description ?? '')))),
      cannotShip: CANNOT_SHIP,
      note: 'Integrity of THIS entry\'s tool surface. `writes` is empty by construction: nothing reachable from here can write, because nothing reachable from here has a tree to write to.',
    })
  },
}

const first = (d: string) => (d.split(/(?<=[.—])\s/)[0] ?? d).slice(0, 140)
export const listTools = (name?: unknown): string => {
  if (name) {
    const t = TOOLS.find((x) => x.name === String(name))
    if (!t) throw new Error(`unknown tool: ${String(name)} — call list_tools with no name for the list`)
    const avail = served().includes(t.name)
    return JSON.stringify({ name: t.name, description: t.description, inputSchema: t.inputSchema, available: avail,
      ...(avail ? {} : { needs: NEEDS[t.name], why: CANNOT_SHIP[t.name] ?? 'needs the repository: clone it and run `npm run mcp` for the full surface' }) })
  }
  return JSON.stringify({
    entry: 'self-sufficient — runs from the published package with no account, key, model, network or clone',
    serves: `${served().length} of ${TOOLS.length} tools`,
    ledgerLoaded: hasLedger(),
    tools: served().map((n) => ({ name: n, description: first(TOOLS.find((t) => t.name === n)?.description ?? '') })),
    elsewhere: TOOLS.filter((t) => !served().includes(t.name)).map((t) => ({ name: t.name, needs: NEEDS[t.name], why: CANNOT_SHIP[t.name] ?? 'needs the repository' })),
    note: 'The other tools are not hidden and not broken: each names what it needs. Clone the repository for the full surface.',
  })
}

export const run = (name: string, a: any): string => {
  if (name === 'list_tools') return listTools(a?.name)
  if (name === 'call_tool') return run(String(a?.name ?? ''), a?.arguments ?? {})
  const h = H[name]
  if (!h) {
    const declared = TOOLS.find((t) => t.name === name)
    if (declared) throw new Error(`${name} is a tool of this deposit but is not served by the self-sufficient entry: `
      + (CANNOT_SHIP[name] ?? `it needs ${(NEEDS[name] ?? []).join('+')}`) + '. Clone the repository and run `npm run mcp`.')
    throw new Error(`unknown tool: ${name} — call list_tools for what this entry serves`)
  }
  return h(a)
}

/** ── WHY THE TRANSPORT IS NOT IN THIS FILE ────────────────────────────────────────────────────────────────
 *  It was, and the typed dist build refused it: tsconfig.dist.json compiles the published surface with NO
 *  node type definitions, because the core reaches no node builtin. `createInterface` and `process` broke
 *  that, and the break is the design telling me where the boundary is rather than an inconvenience to
 *  configure away. So this module stays pure — `run` and `listTools` are computation over values the caller
 *  passes in, which is the same property that makes these tools self-sufficient in the first place — and
 *  the stdio loop lives in mcp.bin.ts, the one file that is allowed to know it is a process. */
