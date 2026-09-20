/** ── THE HANDLE — four hex, and the message does the rest ──────────────────────────────────────────────
 *
 *  Captain's instruction: "exactly computable by uuid four hex leaving handle and message do the rest
 *  without need to payload".
 *
 *  `src/receipts/` has always worked this way: `uuid = toUuid(message)`, so the address IS the message and
 *  nothing else travels. This names the short form. A handle is the first FOUR HEX of that address, and a
 *  handle together with the message determines the whole address exactly — recompute and compare. No
 *  payload is ever sent, because the message is the payload and the address is a function of it.
 *
 *  WHICH FOUR HEX IS NOT A MATTER OF TASTE — MEASURED 2026-09-20 over the 2,912 ledger receipts.
 *  `toUuid` forces the version and variant bits at bytes 6 and 8, which land at hex 12 and hex 16. A
 *  four-hex window overlapping them carries less than sixteen bits, and the loss is visible:
 *
 *      hex  0.. 4   2840 distinct        hex 12..16   2092 distinct  ← forced version nibble
 *      hex  4.. 8   2850 distinct        hex 16..20   2651 distinct  ← forced variant bits
 *      hex  8..12   2850 distinct        hex 20..24   2835 distinct
 *
 *  The trap is the display form. A uuid is shown as 8-4-4-4-12, so the obvious way to take "four hex" is
 *  to grab a dash-delimited group — and the THIRD group is hex 12..16, the worst window of the eight, at
 *  roughly a quarter of the handle space. Two of the three four-character groups are degraded. The handle
 *  is taken from the FRONT, off the undashed hex, for that reason and not for looks.
 *
 *  WHAT A HANDLE IS NOT. Sixteen bits over 2,912 entries is a birthday problem, and it has already
 *  happened: 71 collisions covering 143 entries, largest bucket 3. Theory predicts 64.7 for this
 *  population; the measurement is 71. A handle therefore ROUTES and REJECTS, it does not identify:
 *
 *    · it routes — 65,536 buckets, about 2.2 entries each at today's size, located without reading;
 *    · it rejects cheaply — a substituted or corrupted message fails on sixteen bits before any work;
 *    · it does NOT name one thing, and it is NOT a proof. Only the full address does the first, and
 *      nothing here does the second: an address fixes WHICH bytes, never that they are true.
 *
 *  The collision-free minimum over this ledger today is SEVEN hex. That is a measurement with a date, not
 *  a constant — the ledger grows, so `scripts/handle-gate.ts` recomputes it and says when four no longer
 *  routes usefully. */
import { toUuid } from '../0/index.ts'

/** The width, in hex digits, of a handle. Four, per the instruction. */
export const HANDLE_HEX = 4

/** The front window, as an explicit offset rather than an implied zero — the whole point of this module is
 *  that WHICH window was chosen is a decision someone made for a measured reason. */
export const HANDLE_OFFSET = 0

/** The handle of an address. Dashes are stripped first: a handle read off the dashed display form would
 *  silently be a different window, which is the trap this module exists to close. */
export const handleOf = (uuid: string): string =>
  uuid.replace(/-/g, '').slice(HANDLE_OFFSET, HANDLE_OFFSET + HANDLE_HEX)

/** The handle of a message — the short form anyone can recompute from the message alone. */
export const handle = (message: string): string => handleOf(toUuid(message))

/** Does this message carry this handle? A cheap rejection, sixteen bits wide, before any full comparison.
 *  Passing does NOT establish that the message is the one meant: 143 of 2,912 sealed entries share a
 *  handle with another. It establishes that the message has not been replaced by an unrelated one. */
export const carries = (h: string, message: string): boolean => handle(message) === h.toLowerCase()

/** THE WHOLE POINT, AS A FUNCTION. Given a handle and a message and nothing else, recompute the address
 *  and say whether it is the one the handle came from. Returns the full address so the caller never has to
 *  be sent it — that is what "without need to payload" means here. */
export const resolve = (h: string, message: string): { uuid: string; carries: boolean } => {
  const uuid = toUuid(message)
  return { uuid, carries: handleOf(uuid) === h.toLowerCase() }
}
