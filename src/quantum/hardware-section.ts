// THE QUANTUM HARDWARE SECTION of README.md and the homepage — read from src/proof, the ledger, src/quantum/hardware.ts
// and the device receipt on every build, the way thousandBitSection() reads qpu_crypto.lean.
//
// The bound beside each theorem is authored — what it decides and, in the same sentence, what it does not — and keyed
// by the theorem's name, so a theorem that is renamed or withdrawn drops its line instead of keeping a sentence about
// nothing. Case counts, keys and receipts are the ledger's. The octave table is computed by mermin(), the cluster by
// cluster(), and the device verdict is the receipt scripts/quantum-hardware.ts wrote — or the plain fact that none exists.
import { existsSync, readFileSync } from 'node:fs'
import { leanTheorems, ledger, domainOf } from '../api/index.ts'
import { ACCEPTED_HARDWARE, mermin, cluster } from './hardware.ts'

/** theorem → [ISO/IEC 4879 clause or role, bound] */
const BOUNDS: Record<string, [string, string]> = {
  the_sent_circuits_reach_s_two_root_two: ['§3.4.13 circuit-based', 'the CHSH gates sent to IBM Quantum give S = 2√2 exactly — Tsirelson\'s maximum — for an ideal device, in ℤ[ω] with no float; it is the specification a run is checked against, not a run'],
  every_deterministic_local_strategy_gives_chsh_plus_or_minus_two: ['the classical line', 'every classical strategy gives S = ±2, so a device must cross 2 strictly; it says nothing about any device until its counts arrive'],
  one_count_above_s_two_is_above_classical: ['the verdict rule', 'a device\'s counts are judged on exact integers — one count past S = 2 is seen, one count short is refused (its control)'],
  one_way_measurement_applies_h_rz_for_every_angle_and_both_outcomes: ['§3.4.14 one-way', 'measuring a cluster qubit applies J(θ) = H·diag(1, e^{iθ}) to its neighbour with an X^m byproduct, every π/4 angle and both outcomes'],
  ising_anyon_braids_generate_exactly_the_twenty_four_clifford_classes: ['§3.4.16 topological', 'Ising braids generate exactly 24 classes up to phase, closed — the single-qubit Clifford group — so braiding alone is not universal'],
  every_balanced_beam_splitter_gives_a_full_depth_hong_ou_mandel_dip: ['§3.5.8 boson sampling', 'every balanced beam splitter on the π/4 phase grid is unitary with permanent 0 — the full Hong–Ou–Mandel dip; distinguishable photons coincide half the time'],
  the_adiabatic_gap_is_smallest_exactly_at_the_midpoint_at_every_resolution: ['§3.4.15 adiabatic', 'for every rational schedule point the one-qubit gap is never below √2 and reaches it at the midpoint — proved for every value, not sampled'],
  the_frustrated_triangle_has_a_six_fold_ground_state_at_minus_one: ['§3.4.31 annealer', 'the frustrated triangle\'s whole spectrum: ground state −1 six-fold, only all-up and all-down at +3'],
  octave_one_twenty_eight_qubits_the_uuid_width_leads_by_two_to_the_sixty_third: ['128 qubits', 'on the UUID width the GHZ state\'s Mermin value is 2¹²⁷ against the classical 2⁶⁴ — a lead of 2⁶³ — recombined from eight sealed particles; exact classical computation of the ideal state, not a device result'],
  the_group_generated_by_h_and_s_has_exactly_twenty_four_classes: ['textbook cross-check', 'qpu\'s Eastin–Knill 24 derived from ⟨H, S⟩ itself; quantum_textbooks.lean re-derives every qpu textbook number this way except Holevo\'s entropy, and each matches'],
}

const RUN = 'evidence/quantum-hardware/latest.json'

/** The quantum hardware section as markdown. */
export const hardwareSection = (): string => {
  const thms = leanTheorems() as { name: string; file: string; statement: string; tactic: string }[]
  const live = (ledger() as { key: string; receipt: string; revoked?: boolean }[]).filter((e) => !e.revoked)
  const run = existsSync(RUN) ? (JSON.parse(readFileSync(RUN, 'utf8')) as { status: string; backend?: string; job?: string; S?: number }) : null
  const hw = ACCEPTED_HARDWARE[0]
  let md = `## Quantum hardware — what ISO/IEC 4879 calls a quantum computer, and the Bell test that verifies one\n\n`
  md += `A **real quantum computer** is, by ISO, all three at once: **hardware** (ISO/IEC 2382:2015 — physical components `
    + `of an information system), a **quantum processor** (ISO/IEC 4879:2024 §3.4.8 — a tangible device processing `
    + `information held in physical qubits through superposition and entanglement) and a **computer** (§3.4.10 — fully `
    + `programmable, any unitary on its Hilbert space). A classical program computing the same numbers is §3.4.22, a `
    + `quantum simulator. What separates them is where the counts come from, so the test is **CHSH S > 2 from a device's `
    + `own counts**, decided on exact integers.\n\n`
  md += run
    ? `**Device verdict:** ${run.status} — ${hw.name} \`${run.backend ?? ''}\`, job \`${run.job ?? ''}\`${run.S !== undefined ? `, S = ${run.S}` : ''}.\n\n`
    : `**Device verdict: no run yet.** The accepted system is ${hw.attribution}; the run is \`npm run quantum:hardware\` with `
      + `the depositor's own ${hw.env.join(' and ')}. Until it runs, nothing below is hardware evidence: it is the exact `
      + `specification a run is checked against.\n\n`
  md += `Every quantum computing model ISO/IEC 4879 names is decided at its known optimum, each beside a control and each `
    + `cross-checked against a public source (linked on [/hardware](/hardware)):\n\n`
  for (const [name, [clause, bound]] of Object.entries(BOUNDS)) {
    const t = thms.find((x) => x.name === name), e = live.find((x) => x.key.endsWith('_' + name))
    if (!t || !e) continue
    // HOW IT IS PROVED, said only as far as it is read: domainOf counts a domain it can parse and answers 1 for the
    // list sweeps these files use, so a count is printed only when it read one — never a "1 case" that undercounts.
    const n = domainOf(t.statement)
    const how = t.tactic === 'by decide' ? (n > 1 ? `decided by exhaustion over ${n.toLocaleString('en-US')} cases` : 'decided by exhaustion')
      : /^\s*∀/.test(t.statement) ? 'proved for every value' : 'rewritten from sealed theorems, then decided'
    md += `- **${clause}** · \`${name}\` · ${how} — ${bound}.\n`
      + `  <sub>[\`${e.key}\`](/theorem/${e.key}) · receipt \`${e.receipt.slice(0, 13)}…\`</sub>\n`
  }
  md += `\n**Scaled in octaves.** Mermin's GHZ test doubles with the qubits — the quantum value 2ⁿ⁻¹ against the classical `
    + `2^(n/2) (arXiv:0905.0151 §2), computed here by the literal Node port of the Lean (\`npm run quantum:octave\`):\n\n`
  md += `| qubits | quantum | classical | lead |\n|---:|---:|---:|---:|\n`
  for (const n of [2, 4, 8, 16, 32, 64, 124, 128]) {
    const m = mermin(n), lg = (v: bigint) => v.toString(2).length - 1
    md += `| ${n}${n === 124 ? ' (128 − one hex digit)' : ''} | 2^${lg(m.quantum)} | 2^${lg(m.classical)} | 2^${lg(m.lead)} |\n`
  }
  const c = cluster(124)
  md += `\nThe **124-qubit cluster state** — the UUID minus its version hex digit — has ${c.stabilizers.length} stabilizers, `
    + `propagated through every CZ by a Pauli tableau: ${c.isCluster ? 'each is' : 'NOT each is'} Z·X·Z on its neighbourhood `
    + `and ${c.commute ? 'they all commute' : 'they do NOT all commute'}. Stabilizer states are exactly what a classical `
    + `computer describes in polynomial time (Gottesman–Knill), which is why 128 qubits fit here — and why only a device's `
    + `measured counts, never this computation, make "hardware" true.\n\n`
  return md
}
