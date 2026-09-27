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
 *  WHAT IS HERE AND WHY IT IS SIX AND NOT TWENTY-FIVE. 8 of the 25 tools need nothing beyond the package
 *  (src/mcp/index.ts NEEDS, checked against the handler source by scripts/mcp-gate.ts). Two of those eight
 *  still cannot ship:
 *    · honesty_gate re-exports `computes` from @uuidna/uuidna, which is a devDependency. Making it a runtime
 *      dependency would buy one tool and spend the zero-dependency core, which is a worse trade — and
 *      scripts/mcp.ts's own header commits to "node built-ins only".
 *    · discover needs CANDIDATES from scripts/discover.ts, which is repository logic and not a module.
 *  So SIX, each reaching nothing but src/ and node built-ins. The count is derived below rather than typed,
 *  so it cannot claim more than it serves.
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

/** The tools this entry serves — DERIVED from NEEDS, not listed, minus the two that need a dependency or
 *  repository logic. Those two are named with their reason so the subtraction is auditable. */
export const CANNOT_SHIP: Record<string, string> = {
  honesty_gate: 'its `computes` comes from @uuidna/uuidna, a devDependency; shipping it would spend the zero-dependency core to gain one tool',
  discover: 'its candidate set is scripts/discover.ts — repository logic, not a module',
}
export const SERVED = Object.entries(NEEDS)
  .filter(([k, n]) => n.length === 1 && n[0] === 'core' && !CANNOT_SHIP[k])
  .map(([k]) => k).sort()

const H: Record<string, (a: any) => string> = {
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
    const served = SERVED
    const missing = served.filter((n) => !H[n])
    const extra = Object.keys(H).filter((n) => !served.includes(n))
    return JSON.stringify({
      entry: 'self-sufficient', served: served.length, of: TOOLS.length,
      declaredWithoutHandler: missing, handlerWithoutDeclaration: extra,
      writes: [...WRITES].filter((w) => served.includes(w)),
      root: merkleFold(served.map((n) => toUuid(n + ':' + (TOOLS.find((t) => t.name === n)?.description ?? '')))),
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
    const here = SERVED.includes(t.name)
    return JSON.stringify({ name: t.name, description: t.description, inputSchema: t.inputSchema, available: here,
      ...(here ? {} : { needs: NEEDS[t.name], why: CANNOT_SHIP[t.name] ?? 'needs the repository: clone it and run `npm run mcp` for the full surface' }) })
  }
  return JSON.stringify({
    entry: 'self-sufficient — runs from the published package with no account, key, model, network or clone',
    serves: `${SERVED.length} of ${TOOLS.length} tools`,
    tools: SERVED.map((n) => ({ name: n, description: first(TOOLS.find((t) => t.name === n)?.description ?? '') })),
    elsewhere: TOOLS.filter((t) => !SERVED.includes(t.name)).map((t) => ({ name: t.name, needs: NEEDS[t.name], why: CANNOT_SHIP[t.name] ?? 'needs the repository' })),
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
 *  passes in, which is the same property that makes these six tools self-sufficient in the first place — and
 *  the stdio loop lives in mcp.bin.ts, the one file that is allowed to know it is a process. */
