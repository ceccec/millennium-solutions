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
import { TERMS, SKILLS } from './terminology.ts'

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
  the_124_qubit_ghz_state_leads_every_classical_assignment_by_two_to_the_sixty_first: ['124 qubits', 'the UUID less its version hex digit: the GHZ state\'s Mermin value 2¹²³ against the classical 2⁶², a lead of 2⁶¹, recombined from eight sealed particles; the ideal state, not a device result'],
  every_generator_of_the_124_qubit_cluster_is_z_x_z_on_its_neighbours: ['124-qubit cluster', 'all 124 generators carried through the whole CZ chain become Z·X·Z on their neighbours; sealed particles prove the exact bit pattern, commutation and independence, beside a no-chain and a ring control'],
  the_group_generated_by_h_and_s_has_exactly_twenty_four_classes: ['textbook cross-check', 'qpu\'s Eastin–Knill 24 derived from ⟨H, S⟩ itself; quantum_textbooks.lean re-derives every qpu textbook number this way except Holevo\'s entropy, and each matches'],
}

/** the software / communication / error-correction layer — ISO/IEC 4879 terms BEYOND the computing models (so a
 *  separate list from BOUNDS, not mislabelled as a "model"). Each positive theorem's own control is folded into its
 *  bound, the way distinguishable_photons is folded into the Hong–Ou–Mandel bound above — not surfaced as its own row. */
const SOFTWARE_BOUNDS: Record<string, [string, string]> = {
  superdense_coding_sends_two_classical_bits_through_one_qubit: ['§3.6.1 quantum communication', 'with a shared Bell pair, Alice\'s X^x then Z^z on one qubit lets Bob\'s Bell measurement read all four two-bit messages on distinct basis states — two classical bits through one qubit; its control shows the same protocol on a product state leaves only two distinguishable distributions (one bit, the Holevo limit), so the entanglement is required — an exact-amplitude protocol on the ideal state, not a device channel'],
  the_bit_flip_code_corrects_every_single_bit_flip_on_every_state: ['§3.4.6 quantum error correction', 'the three-qubit code a|000⟩ + b|111⟩ with the Z₀Z₁, Z₁Z₂ syndrome names and undoes any single bit flip, every a, b in −2..2 and every error in {none, X₀, X₁, X₂} — 100 cases; its control shows two flips complete a logical X, so it corrects one bit-flip error exactly, not a phase error and not two flips'],
  the_phase_flip_code_corrects_every_single_phase_flip_on_every_state: ['§3.4.6 quantum error correction', 'the same code in the Hadamard basis names any single phase flip by the X₀X₁, X₁X₂ syndrome and undoes it, every a, b in −2..2 and every error in {none, Z₀, Z₁, Z₂}; with the bit-flip code these are the two halves Shor\'s nine-qubit code concatenates — one phase error, not two at once'],
  the_toffoli_gate_is_reversible_and_computes_and_which_no_affine_circuit_can: ['§3.4.13 circuit-based', 'on all eight basis states Toffoli is its own inverse and writes a ∧ b, and its control checks that no affine GF(2) function c₀ ⊕ c₁a ⊕ c₂b equals a ∧ b — so CNOTs and NOTs alone cannot compute it; a reversibility and universality fact over the basis, not a gate run on a device'],
  the_swap_test_reads_the_squared_overlap_on_every_pair_in_range: ['§3.3.10 state fidelity', 'H, controlled-swap, H make the ancilla\'s outcome weights 2(‖ψ‖²‖φ‖² ± ⟨ψ,φ⟩²) — P(0) = (1 + |⟨ψ|φ⟩|²)/2 — for all 625 real pairs in −2..2, with identical states never reading 1 and orthogonal ones reading 1 as often as 0 as its controls; the exact overlap on the ideal state, not a sampled estimate'],
  a_compilers_cnot_and_swap_rewrites_are_exact_and_dropping_a_gate_breaks_them: ['§3.4.21 quantum programming', 'CNOT run as (I⊗H)·CZ·(I⊗H) and SWAP as three alternating CNOTs agree with the gate they replace on every basis state, and the control shows dropping one H breaks it — the compiler rewrites are exact, a software-layer equivalence, not a claim about a device\'s native gates'],
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
  // THE LEAD, SURFACED AT THE TOP OF THE SECTION, NOT ONLY IN THE TABLE BELOW. The two numbers are computed by
  // mermin() — never typed — so a headline that disagreed with the table would be impossible, and the disclaimer
  // that these are ideal-state computations and not hardware is carried in the same sentence, where a reader meets it.
  const octave128 = live.find((x) => x.key.endsWith('_octave_one_twenty_eight_qubits_the_uuid_width_leads_by_two_to_the_sixty_third'))
  const octave124 = live.find((x) => x.key.endsWith('_the_124_qubit_ghz_state_leads_every_classical_assignment_by_two_to_the_sixty_first'))
  const L128 = mermin(128), L124 = mermin(124), lgv = (v: bigint) => v.toString(2).length - 1
  md += `**The lead, proved and bounded.** On the UUID's own 128-bit width the ideal GHZ state's Mermin value is `
    + `2^${lgv(L128.quantum)} against the best classical assignment's 2^${lgv(L128.classical)} — a lead of `
    + `**2^${lgv(L128.lead)}** (and **2^${lgv(L124.lead)}** on the 124-qubit cluster, the UUID less its version hex digit), `
    + `decided exactly over the cyclotomic integers and recombined from eight sealed particles each. It is the ideal state `
    + `computed classically (§3.4.22), the specification a device is checked against — never, by itself, hardware; that is `
    + `what the Bell test below decides. The two leads are the last rows of the octave table.`
    + (octave128 ? ` <sub>[\`${octave128.key}\`](/theorem/${octave128.key})${octave124 ? ` · [\`${octave124.key}\`](/theorem/${octave124.key})` : ''}</sub>` : '')
    + `\n\n`
  md += run
    ? `**Device verdict:** ${run.status} — ${hw.name} \`${run.backend ?? ''}\`, job \`${run.job ?? ''}\`${run.S !== undefined ? `, S = ${run.S}` : ''}.\n\n`
    : `**Device verdict: no run yet.** The accepted system is ${hw.attribution}; the run is \`npm run quantum:hardware\` with `
      + `the depositor's own ${hw.env.join(' and ')}. Until it runs, nothing below is hardware evidence: it is the exact `
      + `specification a run is checked against.\n\n`
  md += `Every quantum computing model ISO/IEC 4879 names is decided at its known optimum, each beside a control and each `
    + `cross-checked against a public source (linked on [/hardware](/hardware)):\n\n`
  // ONE RENDERER FOR BOTH LISTS. HOW IT IS PROVED is said only as far as it is read: domainOf counts a domain it can
  // parse and answers 1 for the list sweeps these files use, so a count is printed only when it read one — never a
  // "1 case" that undercounts. A theorem whose name is in the table but not in the tree or the live ledger drops its
  // line (the `continue`), so a renamed or withdrawn theorem never leaves a sentence about nothing.
  const renderBounds = (table: Record<string, [string, string]>) => {
    for (const [name, [clause, bound]] of Object.entries(table)) {
      const t = thms.find((x) => x.name === name), e = live.find((x) => x.key.endsWith('_' + name))
      if (!t || !e) continue
      const n = domainOf(t.statement)
      const how = t.tactic === 'by decide' ? (n > 1 ? `decided by exhaustion over ${n.toLocaleString('en-US')} cases` : 'decided by exhaustion')
        : /^\s*∀/.test(t.statement) ? 'proved for every value' : 'rewritten from sealed theorems, then decided'
      md += `- **${clause}** · \`${name}\` · ${how} — ${bound}.\n`
        + `  <sub>[\`${e.key}\`](/theorem/${e.key}) · receipt \`${e.receipt.slice(0, 13)}…\`</sub>\n`
    }
  }
  renderBounds(BOUNDS)
  md += `\n**The software, communication and error-correction layer** — the ISO/IEC 4879 terms beyond the computing `
    + `models, shipped as the quantum_software.lean octave, each decided exactly over its whole finite domain beside its control:\n\n`
  renderBounds(SOFTWARE_BOUNDS)
  md += `\n**Scaled in octaves.** Mermin's GHZ test doubles with the qubits — the quantum value 2ⁿ⁻¹ against the classical `
    + `2^(n/2) (arXiv:0905.0151 §2), computed here by the literal Node port of the Lean (\`npm run quantum:octave\`):\n\n`
  md += `| qubits | quantum | classical | lead |\n|---:|---:|---:|---:|\n`
  for (const n of [2, 4, 8, 16, 32, 64, 124, 128]) {
    const m = mermin(n), lg = (v: bigint) => v.toString(2).length - 1
    // The two widths that are sealed theorems carry a link on the lead itself — the row's headline fact pointing at its proof.
    const key = n === 128 ? octave128?.key : n === 124 ? octave124?.key : undefined
    md += `| ${n}${n === 124 ? ' (128 − one hex digit)' : ''} | 2^${lg(m.quantum)} | 2^${lg(m.classical)} | 2^${lg(m.lead)}${key ? ` [↗](/theorem/${key})` : ''} |\n`
  }
  const c = cluster(124)
  md += `\nThe **124-qubit cluster state** — the UUID minus its version hex digit — has ${c.stabilizers.length} stabilizers, `
    + `propagated through every CZ by a Pauli tableau: ${c.isCluster ? 'each is' : 'NOT each is'} Z·X·Z on its neighbourhood `
    + `and ${c.commute ? 'they all commute' : 'they do NOT all commute'}. Stabilizer states are exactly what a classical `
    + `computer describes in polynomial time (Gottesman–Knill), which is why 128 qubits fit here — and why only a device's `
    + `measured counts, never this computation, make "hardware" true.\n\n`
  md += `**Terminology.** The types are named by the standard's terms (\`QuantumGate\` §3.4.2, \`QuantumCircuit\` §3.4.5, `
    + `\`MeasurementCounts\` §3.2.16, \`AcceptedQuantumComputer\` §3.4.10), and all ${TERMS.length} terms of ISO/IEC 4879 are `
    + `listed once in \`src/quantum/terminology.ts\`, each a coin — the content address of its clause and term — with where `
    + `it is realised: ${TERMS.filter((t) => t.here.length).length} in this tree, the other ${TERMS.filter((t) => !t.here.length).length} `
    + `by a named check in qpu. Each coin holds its skill — its section of the standard, with the ESCO skills search — `
    + `and its tools: what computes or verifies it and the entry point that runs it, every one resolved in the tree; each `
    + `of the ${SKILLS.length} skill families is a coin too, the fold of its members' coins — on [/hardware](/hardware).\n\n`
  return md
}
