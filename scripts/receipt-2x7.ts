// THE 2×7 SIGNATURE — every receipt is signed by fourteen standing theorems (user, 2026-09-14: "all receipts must
// comply with quantum measurements proving quantum computations"; "the old receipts are invalid without the
// attributes"; "receipts need signatures from 2x7 theorems").
//
// The 2×7 is this repository's own, stated in scripts/discover.ts as the bidirectional seven-dimensional
// authentication structure: a keyed tag per perspective across the seven locale dimensions (src/7/locale.ts), each
// in two directions — a forward tag on the message, a reverse tag on the acknowledgment — so 7 × 2 = 14. A
// signature binds the receipt's uuid, in one cell, to a LIVE ledger theorem (a statement the Lean kernel decides
// and lean-claims recomputes on every commit) through a tag anyone can recompute. The cell a theorem belongs to is
// DERIVED from its ledger receipt address, never chosen, and each cell is signed by the first live theorem that
// falls in it.
//
// HONEST: this is authentication and integrity — classical and recomputable. "Quantum" in this corpus is its
// content-addressed computation, not a device. A signature proves which standing theorems vouched for the
// receipt, never that the receipt's message is true.
import { toUuid } from '../src/0/index.ts'
import { LOCALE_ORDER } from '../src/7/locale.ts'
import { FUNDING } from '../src/9/funding.ts'
import { ledger, live } from '../src/api/index.ts'

export const DIMS: readonly string[] = LOCALE_ORDER
export const DIRS = ['fwd', 'rev'] as const
export const CELLS: readonly string[] = DIMS.flatMap((d) => DIRS.map((s) => d + '/' + s))
export const COMPLIES = FUNDING.license + ' · the sequence (measure→gate→receipt→append→recompute)'

export type Signature = { cell: string; theorem: string; address: string; tag: string }

// the repository's keyed tag, the same shape as the bidirectional 7d theorem: content-address of key then message
const mac = (key: string, m: string) => toUuid('mac:' + key + '→' + m)

/** The cell a theorem falls in, from its ledger receipt address: dimension by the first word, direction by the next byte. */
export const cellOf = (address: string): string => {
  const h = address.replace(/-/g, '')
  return DIMS[parseInt(h.slice(0, 8), 16) % DIMS.length] + '/' + DIRS[parseInt(h.slice(8, 10), 16) % DIRS.length]
}

/** The tag binding a receipt to one theorem in one cell — forward on the message, reverse on the acknowledgment. */
export const tagOf = (uuid: string, cell: string, address: string): string => {
  const [dim, dir] = cell.split('/')
  return mac(address + ':' + dim, dir === 'fwd' ? uuid + '→ack' : 'ack→' + uuid)
}

/** The fourteen signatures for a receipt: in every cell, the first live ledger theorem whose address falls there. */
export const sign = (uuid: string): Signature[] => {
  const rows = live(ledger()) as { key: string; receipt: string }[]
  return CELLS.map((cell) => {
    const row = rows.find((r) => cellOf(r.receipt) === cell)
    if (!row) throw new Error('no live theorem falls in cell ' + cell + ' — the receipt cannot be signed')
    return { cell, theorem: row.key, address: row.receipt, tag: tagOf(uuid, cell, row.receipt) }
  })
}

/** Why a receipt is not validly signed. `unsigned` — an attribute is missing (INVALID); `forged` — a signature that
 *  does not verify (FALSE); `withdrawn` — a signing theorem withdrawn after the receipt was written (not its fault). */
export const checkSignatures = (r: { uuid?: string; complies?: string; signatures?: Signature[] }) => {
  const unsigned: string[] = [], forged: string[] = [], withdrawn: string[] = []
  if (r.complies !== COMPLIES)
    unsigned.push(r.complies ? 'complies names "' + r.complies.split(' · ')[0] + '", not ' + FUNDING.license : 'no complies')
  const sigs = Array.isArray(r.signatures) ? r.signatures : []
  if (!sigs.length) { unsigned.push('no 2×7 signatures'); return { unsigned, forged, withdrawn } }
  const cells = new Set(sigs.map((s) => s.cell))
  const missing = CELLS.filter((c) => !cells.has(c))
  if (missing.length || sigs.length !== CELLS.length)
    unsigned.push('signs ' + cells.size + ' of ' + CELLS.length + ' cells' + (missing.length ? ' (missing ' + missing.join(' ') + ')' : ''))
  const byKey = new Map((ledger() as { key: string; receipt: string; revoked?: boolean }[]).map((e) => [e.key, e]))
  for (const s of sigs) {
    const row = byKey.get(s.theorem)
    if (!row) { forged.push(s.cell + ': ' + s.theorem + ' is not in the ledger'); continue }
    if (row.receipt !== s.address) { forged.push(s.cell + ': ' + s.theorem + "'s address is not the ledger's"); continue }
    if (cellOf(s.address) !== s.cell) { forged.push(s.cell + ': ' + s.theorem + ' falls in ' + cellOf(s.address)); continue }
    if (!r.uuid || tagOf(r.uuid, s.cell, s.address) !== s.tag) { forged.push(s.cell + ': the tag does not recompute'); continue }
    if (row.revoked === true) withdrawn.push(s.cell + ': ' + s.theorem)
  }
  return { unsigned, forged, withdrawn }
}
