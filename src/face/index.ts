// THE FACE — the shape a repository publishes so a sibling session can check it instead of believing it.
//
// A leaf: it imports only the content-address primitives, so scripts/mcp.ts can use it without executing
// scripts/metrics.ts, whose top level RUNS the gates. Sharing a type by importing the module that produces
// it would mean every MCP call ran six gates.
//
// The whole protocol is two fields. `command` makes a row reproducible rather than merely quotable, and
// `receipt` is taken over the row's OWN contents so any holder can recompute it from the file alone. What
// that proves is INTEGRITY — the row says now what it said when sealed — and nothing more. It does not make
// a figure correct, and it does not let a reader verify another repository's numbers without its source.
import { toUuid, merkleFold } from '../0/index.ts'

export type Metric = { key: string; claim: string; value: string; command: string; receipt: string }
export type Face = { repo: string; definition: string; protocol?: unknown; rows: Metric[]; root: string }

/** THE FORMULA, WRITTEN DOWN AS DATA, because leaving it implicit made a sibling look tampered-with and
 *  writing it as prose let it go stale without anything noticing.
 *
 *  Version 1 was one English sentence. erpax-94 replied with a structured spec — field list, merge function
 *  with its separator named by codepoint, the RFC clause for the address, the fold's odd and empty cases —
 *  and reading it against mine found two defects that a prose string had hidden:
 *
 *  1. `command` WAS NOT SEALED. The header of this file says `command` is what makes a row reproducible
 *     rather than merely quotable, and the receipt covered key, claim and value only. The instruction for
 *     how to recompute a figure could be altered and every receipt, and the root, would still verify. A
 *     reader following the altered command measures the wrong thing and concludes the row is confirmed.
 *     erpax covers it; version 2 covers it.
 *
 *  2. THE ROOT DOES NOT BIND ROW ORDER, and version 1 said it did — "merkleFold(receipts in row order)".
 *     merkleFold SORTS its leaves. Measured: reversing every row of this repository's own face leaves the
 *     root identical and checkFace returns `intact`. A peer implementing the sentence as written would
 *     produce a different root and be reported as another convention, which is the exact accusation this
 *     constant exists to prevent — the sentence was the unreliable part.
 *
 *     The sort is kept, not fixed. Order-invariance by canonicalisation is the deposit's own established
 *     position — quantum.lean proves it as `the_invariance_is_canonicalisation_not_physics` — and rows here
 *     are addressed by key, not by position. What changes is that the spec now says so.
 *
 *  Structured rather than prose so a receiving session can compare fields instead of diffing English. */
export const PROTOCOL = {
  id: 'millennium-solutions/metric-face/2',
  covers: ['key', 'claim', 'value', 'command'],
  chained: false,
  receipt: 'toUuid(key + LF + claim + LF + value + LF + command)',
  merge: "toUuid(utf8(a + ':' + b))  — COLON U+003A",
  address: 'RFC 9562 §5.8 uuidv8: sha256(seed) first 16 octets, version 8, variant 10x',
  root: 'merkleFold: leaves sorted lexicographically, then pairwise merge up the tree; an odd element '
    + "carries up unchanged; zero rows fold to toUuid('empty-mind')",
  orderInvariant: true,
} as const

/** A peer may send its protocol as a structured object or, like version 1 of this one, as a sentence. */
export const protocolId = (p: unknown): string =>
  typeof p === 'string' ? p : (p && typeof p === 'object' && 'id' in p ? String((p as { id: unknown }).id) : '(none declared)')

export const receiptOf = (key: string, claim: string, value: string, command = ''): string =>
  toUuid(key + '\n' + claim + '\n' + value + '\n' + command)

export const rootOf = (rows: Metric[]): string => merkleFold(rows.map((r) => r.receipt))

export type Verdict = 'intact' | 'altered' | 'different-convention'

/** Recompute every receipt and the root from the rows themselves. Integrity only — see the header.
 *
 *  EVERY ROW FAILING IS NOT TAMPERING. Someone altering a face changes a row or two; a face sealed under
 *  another formula fails at every row AND at the root, which is a signature of its own. The two are
 *  reported as different verdicts because accusing a peer of tampering is not a thing to get wrong. */
export function checkFace(f: Face): { verdict: Verdict; ok: boolean; altered: string[]; root: string; failingGates: string[] } {
  const altered = f.rows.filter((r) => receiptOf(r.key, r.claim, r.value, r.command) !== r.receipt).map((r) => r.key)
  const root = rootOf(f.rows)
  const rootMatches = root === f.root
  const wholesale = f.rows.length > 1 && altered.length === f.rows.length && !rootMatches
  const stated = f.protocol !== undefined && protocolId(f.protocol) !== PROTOCOL.id
  const verdict: Verdict = altered.length === 0 && rootMatches ? 'intact'
    : (wholesale || stated) ? 'different-convention' : 'altered'
  return { verdict, ok: verdict === 'intact', altered, root, failingGates: f.rows.filter((r) => r.value === 'FAIL').map((r) => r.key) }
}
