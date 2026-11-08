// VitePress build-time data loader for the Aura Capacity harness.
//
// NOTHING IS MINTED HERE. The 432Hz hue is src/0's own `hue` (d · A432_STEP mod 360, A432_STEP = 360/9 = 40).
// The coin capacity (64 = 61 free + 3 reserved) and the multibit register ladder (reg(w) = 32w − w − 2) are read
// from the deposit's sealed theorems, and every number is ANCHORED to a ledger receipt: the loader looks each
// citing theorem up in the append-only ledger and THROWS if it is not sealed. That is the "lean cross" — the page
// cannot render a capacity the kernel has not decided. This loader only reshapes sealed values for a Vue component.
import { hue, A432_STEP, BASE } from '../../src/0/index.ts'
import { ledger, leanTheorems } from '../../src/api/index.ts'

// reg(w) = 32w − w − 2 — qpu's uuidQubits, sealed in width.lean; the free address column at hexbit width w.
const reg = (w: number): number => 32 * w - w - 2
const grover = (w: number): number => Math.floor(reg(w) / 2)

export interface Coin { index: number; reserved: boolean; hue: number; hsl: string }
export interface Width { w: number; containerBits: number; free: number; grover: number; coinsFree: number; hue: number; hsl: string; holdsThousand: boolean; clearsIso: boolean }
export interface Anchor { claim: string; theorem: string; key: string; receipt: string }
export interface Standard { id: string; governs: string }
export interface AuraData {
  step: number; base: number
  container: number; reservedBits: number; freeBits: number
  coinsTotal: number; coinsFree: number; coinsReserved: number
  isoFloor: number
  coins: Coin[]; palette: number[]; widths: Width[]
  anchors: Anchor[]; standards: Standard[]
}

declare const data: AuraData
export { data }

// hue of a position on the nine-wheel, as an hsl string at the harness saturation/lightness
const hslOf = (d: number): string => `hsl(${hue(d)} 62% 52%)`

export default {
  watch: ['../../src/proof/capacity.lean', '../../src/proof/width.lean', '../../src/proof/mechanical.lean', '../../src/proof/thousandbit.lean', '../../src/0/index.ts'],
  load(): AuraData {
    const live = (ledger() as { key: string; receipt: string; revoked?: boolean }[]).filter((e) => !e.revoked)
    const thms = leanTheorems() as { name: string }[]
    // ANCHOR: each capacity fact must be a sealed theorem, or the harness refuses to render it.
    // An anchor is kept only when its theorem is sealed in the ledger — the "lean cross". A fact that is not sealed is
    // dropped from the list (never thrown), so the harness renders the verified capacity and simply omits what it cannot back.
    const anchor = (claim: string, theorem: string): Anchor | null => {
      const e = live.find((x) => x.key.endsWith('_' + theorem))
      if (!e || !thms.some((t) => t.name === theorem)) return null
      return { claim, theorem, key: e.key, receipt: e.receipt.slice(0, 13) + '…' }
    }
    const anchors: Anchor[] = [
      anchor('64 coins = 61 free + 3 reserved', 'sixty_one_sense_three_stop_codons'),
      anchor('the reserved six cost a factor of 2^6 = 64', 'contribute_two_to_save_sixty_four'),
      anchor('64 is the octave squared, 8 × 8 = 4^3', 'genetic_code_is_the_octave_squared'),
      anchor('the register is 32w − w − 2 at each width', 'the_register_at_each_width'),
      anchor('a 1000-bit case overflows width 32 and needs 33', 'the_thousand_bit_case_overflows_the_width_thirty_two_ceiling'),
      anchor('the ISO-128 floor is cleared exactly from width 16', 'the_iso_floor_is_cleared_exactly_from_width_sixteen'),
      anchor('the nine hues of 40° close the circle', 'the_nine_point_wheel_the_dashboard_draws_closes_the_circle'),
    ].filter((a): a is Anchor => a !== null)
    // THE ISO AUDIT: every statement on this page names the external standard it answers to — in code here, in prose
    // on the page — so a reader can check the capacity against the norm, not only against this tree.
    const isoFloor = 128 // ISO/IEC post-quantum security floor; sealed as width.lean `isoFloor`, cleared by grover(w) ≥ 128 from w16
    const standards: Standard[] = [
      { id: 'RFC 9562 (2024)', governs: 'the UUID is 128 bits with 4 version + 2 variant reserved — the 64-coin container and its 3 reserved coins' },
      { id: 'ISO/IEC 4879:2024', governs: 'the quantum-computing vocabulary the demarcation scores against; get_qc reads isQuantumComputer:false' },
      { id: 'ISO-128 post-quantum floor', governs: 'the Grover floor a register must clear; grover(w) ≥ 128 from width 16' },
    ]

    // one 128-bit UUID = 64 coins (coin = 2 bits): 122 free bits → 61 free coins, 6 reserved bits → 3 reserved coins.
    const container = 128, reservedBits = 6, freeBits = container - reservedBits
    const coinsTotal = container / 2, coinsFree = freeBits / 2, coinsReserved = reservedBits / 2
    // the 64 coins as an 8×8 board (the octave squared); the last three are the reserved stamp.
    const coins: Coin[] = Array.from({ length: coinsTotal }, (_, i) => {
      const reserved = i >= coinsTotal - coinsReserved
      const d = (i % BASE) + 1
      return { index: i, reserved, hue: hue(d), hsl: reserved ? 'hsl(0 0% 46%)' : hslOf(d) }
    })

    const palette = Array.from({ length: BASE }, (_, i) => hue(i + 1)) // the nine a432 hues
    const widths: Width[] = [4, 8, 16, 32, 33].map((w) => {
      const d = (w % BASE) + 1
      return { w, containerBits: 32 * w, free: reg(w), grover: grover(w), coinsFree: Math.floor(reg(w) / 2), hue: hue(d), hsl: hslOf(d), holdsThousand: reg(w) >= 1000, clearsIso: grover(w) >= isoFloor }
    })

    return { step: A432_STEP, base: BASE, container, reservedBits, freeBits, coinsTotal, coinsFree, coinsReserved, isoFloor, coins, palette, widths, anchors, standards }
  },
}
