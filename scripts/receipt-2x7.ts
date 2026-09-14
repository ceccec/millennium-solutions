// THE 2×7 SIGNATURE — every receipt is signed at its position of the lattice (user, 2026-09-14: "all receipts must
// comply with quantum measurements proving quantum computations"; "the old receipts are invalid without the
// attributes"; "receipts need signatures from 2x7 theorems"; "2x7 surround the 1 center totalling 15 per
// position" — the surround drawn across the lattice).
//
// The 2×7 is this repository's own, stated in scripts/discover.ts as the bidirectional seven-dimensional
// authentication structure: a keyed tag per perspective across the seven locale dimensions (src/7/locale.ts), each
// in two directions — a forward tag on the message, a reverse tag on the acknowledgment — so 7 × 2 = 14 positions.
// A receipt stands at ONE position, derived from its own address. There ONE CENTER theorem signs it, and 2×7
// APOSTILLES surround that center — one from every position of the lattice, each certifying the center's signature
// in its own locale and direction. 1 + 14 = 15 distinct live ledger theorems per receipt — statements the Lean
// kernel decides and lean-claims recomputes on every commit — each bound by a tag anyone can recompute: the center's
// binds the receipt, an apostille's binds the center. Nothing is chosen. A theorem's position is DERIVED from its
// ledger receipt address; the center is the first live theorem at the receipt's position, and each apostille is the
// next live theorem at its position not already used.
//
// HONEST: this is authentication and integrity — classical and recomputable. "Quantum" in this corpus is its
// content-addressed computation, not a device. The center and its apostilles prove which standing theorems vouched
// for the receipt, never that the receipt's message is true.
import { toUuid } from '../src/0/index.ts'
import { LOCALE_ORDER } from '../src/7/locale.ts'
import { FUNDING } from '../src/9/funding.ts'
import { ledger, live } from '../src/api/index.ts'

export const DIMS: readonly string[] = LOCALE_ORDER
export const DIRS = ['fwd', 'rev'] as const
export const CELLS: readonly string[] = DIMS.flatMap((d) => DIRS.map((s) => d + '/' + s))
export const PER_POSITION = 1 + CELLS.length // the center and the 2×7 surrounding it
export const COMPLIES = FUNDING.license + ' · the sequence (measure→gate→receipt→append→recompute)'

export type Apostille = { cell: string; theorem: string; address: string; tag: string }
export type Signature = Apostille & { apostilles: Apostille[] }

// the repository's keyed tag, the same shape as the bidirectional 7d theorem: content-address of key then message
const mac = (key: string, m: string) => toUuid('mac:' + key + '→' + m)
const certify = (cell: string, address: string, message: string) => {
  const [dim, dir] = cell.split('/')
  return mac(address + ':' + dim, dir === 'fwd' ? message + '→ack' : 'ack→' + message)
}

/** The position an address falls in: dimension by its first word, direction by the next byte. */
export const cellOf = (address: string): string => {
  const h = address.replace(/-/g, '')
  return DIMS[parseInt(h.slice(0, 8), 16) % DIMS.length] + '/' + DIRS[parseInt(h.slice(8, 10), 16) % DIRS.length]
}

/** The center's tag binds the receipt; an apostille's tag binds the center it certifies. */
export const tagOf = (uuid: string, cell: string, address: string): string => certify(cell, address, uuid)
export const apostilleOf = (centerTag: string, cell: string, address: string): string => certify(cell, address, centerTag)

/** The signature for a receipt: at the receipt's own position the first live theorem is the center, and the next
 *  unused live theorem of each of the fourteen positions is an apostille around it — fifteen in all. */
export const sign = (uuid: string): Signature => {
  const rows = live(ledger()) as { key: string; receipt: string }[]
  const queue = new Map(CELLS.map((c) => [c, rows.filter((r) => cellOf(r.receipt) === c)]))
  const at = cellOf(uuid)
  const need = (c: string) => (c === at ? 2 : 1)
  const short = CELLS.filter((c) => queue.get(c)!.length < need(c))
  if (short.length) throw new Error('position(s) ' + short.join(' ') + ' hold too few live theorems — the receipt cannot be signed')
  const take = (cell: string) => queue.get(cell)!.shift()!
  const c = take(at)
  const center = { cell: at, theorem: c.key, address: c.receipt, tag: tagOf(uuid, at, c.receipt) }
  return { ...center, apostilles: CELLS.map((cell) => { const r = take(cell); return { cell, theorem: r.key, address: r.receipt, tag: apostilleOf(center.tag, cell, r.receipt) } }) }
}

/** Why a receipt is not validly signed. `unsigned` — an attribute is missing (INVALID); `forged` — a center or an
 *  apostille that does not verify, a center away from the receipt's position, or a theorem used twice (FALSE);
 *  `withdrawn` — a theorem withdrawn after the receipt was written (reported, not the receipt's fault). */
export const checkSignatures = (r: { uuid?: string; complies?: string; signature?: Signature }) => {
  const unsigned: string[] = [], forged: string[] = [], withdrawn: string[] = []
  if (r.complies !== COMPLIES)
    unsigned.push(r.complies ? 'complies names "' + r.complies.split(' · ')[0] + '", not ' + FUNDING.license : 'no complies')
  const s = r.signature
  if (!s || typeof s !== 'object') { unsigned.push('no 2×7 signature'); return { unsigned, forged, withdrawn } }
  const aps = Array.isArray(s.apostilles) ? s.apostilles : []
  const cells = new Set(aps.map((a) => a.cell))
  const missing = CELLS.filter((c) => !cells.has(c))
  if (missing.length || aps.length !== CELLS.length)
    unsigned.push('the 2×7 around the center covers ' + cells.size + ' of ' + CELLS.length + ' positions' + (missing.length ? ' (missing ' + missing.join(' ') + ')' : ''))
  if (r.uuid && s.cell !== cellOf(r.uuid)) forged.push('the center stands at ' + s.cell + ', but the receipt\'s position is ' + cellOf(r.uuid))
  const byKey = new Map((ledger() as { key: string; receipt: string; revoked?: boolean }[]).map((e) => [e.key, e]))
  const used = new Map<string, number>()
  const verify = (label: string, a: Apostille, expected: string) => {
    used.set(a.theorem, (used.get(a.theorem) ?? 0) + 1)
    const row = byKey.get(a.theorem)
    if (!row) { forged.push(label + ': ' + a.theorem + ' is not in the ledger'); return }
    if (row.receipt !== a.address) { forged.push(label + ': ' + a.theorem + "'s address is not the ledger's"); return }
    if (cellOf(a.address) !== a.cell) { forged.push(label + ': ' + a.theorem + ' falls in ' + cellOf(a.address)); return }
    if (a.tag !== expected) { forged.push(label + ': the tag does not recompute'); return }
    if (row.revoked === true) withdrawn.push(label + ': ' + a.theorem)
  }
  verify('center ' + s.cell, s, r.uuid ? tagOf(r.uuid, s.cell, s.address) : '')
  for (const a of aps) verify('apostille ' + a.cell, a, apostilleOf(s.tag, a.cell, a.address))
  const twice = [...used].filter(([, n]) => n > 1).map(([k]) => k)
  if (twice.length) forged.push(twice.length + ' theorem(s) used twice — a derived signature never repeats one: ' + twice.slice(0, 3).join(', '))
  return { unsigned, forged, withdrawn }
}
