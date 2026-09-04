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
export type Face = { repo: string; definition: string; protocol?: string; rows: Metric[]; root: string }

/** THE FORMULA, WRITTEN DOWN, because leaving it implicit made a sibling look tampered-with.
 *
 *  I described this protocol to another session as "a receipt over the row's own contents" and never said
 *  which bytes or which fold. They implemented it honestly and differently; my checker then reported their
 *  face as NOT INTACT — all fourteen rows and the root. Relaying that would have accused a peer of altering
 *  a file they had sealed correctly, using the very tool built to stop false reports travelling.
 *
 *  A face carrying this string is checkable by anyone; a face carrying a different one is a different
 *  convention and must be reported as such, never as tampering. */
export const PROTOCOL = 'receipt = toUuid(key + LF + claim + LF + value); root = merkleFold(receipts in row order)'

export const receiptOf = (key: string, claim: string, value: string): string =>
  toUuid(key + '\n' + claim + '\n' + value)

export const rootOf = (rows: Metric[]): string => merkleFold(rows.map((r) => r.receipt))

export type Verdict = 'intact' | 'altered' | 'different-convention'

/** Recompute every receipt and the root from the rows themselves. Integrity only — see the header.
 *
 *  EVERY ROW FAILING IS NOT TAMPERING. Someone altering a face changes a row or two; a face sealed under
 *  another formula fails at every row AND at the root, which is a signature of its own. The two are
 *  reported as different verdicts because accusing a peer of tampering is not a thing to get wrong. */
export function checkFace(f: Face): { verdict: Verdict; ok: boolean; altered: string[]; root: string; failingGates: string[] } {
  const altered = f.rows.filter((r) => receiptOf(r.key, r.claim, r.value) !== r.receipt).map((r) => r.key)
  const root = rootOf(f.rows)
  const rootMatches = root === f.root
  const wholesale = f.rows.length > 1 && altered.length === f.rows.length && !rootMatches
  const stated = f.protocol !== undefined && f.protocol !== PROTOCOL
  const verdict: Verdict = altered.length === 0 && rootMatches ? 'intact'
    : (wholesale || stated) ? 'different-convention' : 'altered'
  return { verdict, ok: verdict === 'intact', altered, root, failingGates: f.rows.filter((r) => r.value === 'FAIL').map((r) => r.key) }
}
