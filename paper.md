---
title: "The paper — the theorems"
aside: false
---

<div class="paper paper-collected" itemscope itemtype="https://schema.org/ScholarlyArticle">

<div class="paper-masthead">
<h1 class="paper-title">The collected theorems of the ℤ/9 vortex framework</h1>
<div class="paper-byline">Rouschev, T. · <em>Millennium Solutions</em> · DOI <a href="https://doi.org/10.5281/zenodo.21819217">10.5281/zenodo.21819217</a> · CC BY-NC-ND 4.0</div>
<div class="paper-addr">26,133 theorems by exhaustion + 224 proved for every value + 0 rfl declarations · 128 sources · content-address <code>6fad7ad7-dc3c-8127-8c79-233c64ecd9cb</code></div>
</div>

<h2 class="paper-h">Abstract</h2>

This document collects the 26,357 declarations of the ℤ/9 vortex framework that the Lean 4 kernel accepts — 26,133 of them THEOREMS closing by exhaustion, 224 PROVED for every value, and 0 rfl declarations shown and marked as such, across 128 source files. Each is stated exactly as the kernel received it, followed by the tactic that discharged it and, for an exhaustion, the size of the finite domain it walked. Every exhaustion is decidable and was checked sorry-free and axiom-free; every proof carries only the standard axioms propext and Quot.sound, printed per file. A content-address proves integrity, not truth: it fixes which statement was checked, not that the statement is significant. <h2 class="paper-h">The size of what was checked</h2>

The domains sum to 82,089,011,515,213,400,000,000,000,000,000,000,000,000,000,000,000,000 cases, and that total should not be read as the weight of this work: **one theorem carries 100.000% of it**. The median theorem walks **2** cases, and **12,905** of 26,357 walk a single point — a check by evaluation, not by exhaustion. The honest summary is a distribution, not a sum, so it is drawn below rather than reported as one number.

The distribution figures (every theorem as one mark, and theorems per wing) live on their own page so this index stays under a megabyte: [Figure 1 & 2 — domain sizes](/paper/distribution).

<h2 class="paper-h">Method</h2>

Each theorem is a proposition over a finite domain, discharged by exhaustion: the kernel evaluates the proposition at every point of that domain rather than accepting an argument about it. **26,133** of 26,357 are closed by `by decide` and are sealed in the append-only ledger. **224** are PROVED for every value — a proof, not an exhaustion, resting on the standard axioms that core Lean's lemmas carry — and are sealed as proofs, never as decisions. The remaining **0** are settled by `rfl` — a declaration that unfolds to itself — and are deliberately **not sealed**: they are shown here, and marked, because a definitional unfolding is not an exhaustion and must not be counted as one. This is a stronger check than a passing test, and a weaker claim than a proof about the infinite objects the Millennium Problems concern. No Mathlib, no `native_decide`, no `sorry`.

<h2 class="paper-h">How to read this document</h2>

Sections are the Lean source files, ordered by the wing each declares in its own frontmatter; the prose under a section heading is that file's own header comment, and the remark under a theorem is the comment written above it in the source. Nothing here is authored: it is read out of the deposit's Lean sources on every build, so the paper cannot drift from the proofs it describes — a statement that differs from its source stops the build. A remark under a theorem is printed only when the source comment is that theorem's own: **25,785** of 26,357 have one. A comment that belongs to the enclosing section is not repeated under each theorem it precedes, because it is context for the section and not a statement about any one of them. Integrity, not truth.

<h2 class="paper-h">Contents</h2>

Each Lean source is its own page — the collected paper is an index, not an 11&nbsp;MB monolith.

**the address** — 173 theorems
- [Addressing](/paper/address) · `address.lean` · 33
- [What a signature is for, and where it cannot go](/paper/asymmetric) · `asymmetric.lean` · 11
- [The capacity a reserved bit costs, and the birthday bound that follows](/paper/capacity) · `capacity.lean` · 16
- [FNV-1a, the address function](/paper/fnv) · `fnv.lean` · 14
- [The imprint — a uuid that carries a message and gives it back](/paper/imprint) · `imprint.lean` · 9
- [What the ledger claims](/paper/ledgerclaims) · `ledgerclaims.lean` · 8
- [The fold](/paper/merkle) · `merkle.lean` · 16
- [The uuid as a container — a checksum, a program, and a message](/paper/program) · `program.lean` · 21
- [The rays, read forward and reverse, and the mark a life carries](/paper/rays) · `rays.lean` · 13
- [The register is a dial — a wider hexbit width clears the ISO floor, and costs exactly that much more to simulate](/paper/width) · `width.lean` · 8
- [The byte constants and the bit constants are one fact, and neither file knew it](/paper/widths) · `widths.lean` · 24

**unassigned** — 64 theorems
- [answer](/paper/answer) · `answer.lean` · 8
- [arith](/paper/arith) · `arith.lean` · 7
- [diamond](/paper/diamond) · `diamond.lean` · 1
- [The quantum-computer status as a gap taxonomy — incomplete, not false; software-complete is not true](/paper/qc_status) · `qc_status.lean` · 40
- [The content-address correspondence — the deposit's primitives and ZFS share one shape and one efficiency](/paper/sdk_correspondence) · `sdk_correspondence.lean` · 8

**the floor** — 366 theorems
- [The certificate gate, as kernel-checked rules](/paper/answer_gate) · `answer_gate.lean` · 7
- [The router's priority, as kernel-checked rules](/paper/answer_route) · `answer_route.lean` · 6
- [The API layer, as numbers the kernel decides](/paper/apis) · `apis.lean` · 4
- [Who may speak, decided](/paper/authority) · `authority.lean` · 8
- [The CERN Open Data corpus, as measured, checked by its own arithmetic](/paper/cern) · `cern.lean` · 9
- [Enumerative combinatorics, the decidable laws — learned from qpu's Combinatorics](/paper/combinatorics) · `combinatorics.lean` · 8
- [What is actually being asked for](/paper/demand) · `demand.lean` · 11
- [The next tier of what is asked for](/paper/demand2) · `demand2.lean` · 12
- [The named theorems people ask for](/paper/demand3) · `demand3.lean` · 19
- [The water loop](/paper/energy) · `energy.lean` · 28
- [Four hex, exactly computed — and what the handle has to carry instead](/paper/handle) · `handle.lean` · 8
- [The hexbit route's combinatorics](/paper/hexbit_route) · `hexbit_route.lean` · 3
- [Seven decidable windows over one finite structure](/paper/lean-index) · `index.lean` · 11
- [The instruments, and the three rules they are allowed to have](/paper/instruments) · `instruments.lean` · 28
- [Interference: GHZ cancels on odd parity, a classical coin does not](/paper/interference) · `interference.lean` · 2
- [How many checkers may run at once, decided](/paper/lanes) · `lanes.lean` · 8
- [The open leads, named](/paper/leads) · `leads.lean` · 0
- [Light, space and time — arithmetic on numbers a standards body fixed](/paper/light) · `light.lean` · 17
- [The three facts the unchecked files held alone](/paper/nucleus) · `nucleus.lean` · 8
- [Pauli paths — the conjugation rules that let any Clifford+T circuit be computed exactly at any width, decided against the matrices in ℤ[ω], with the T-count as the only cost](/paper/pauli_paths) · `pauli_paths.lean` · 8
- [Every phenomenon this deposit touches, and the rule for the rest](/paper/phenomena) · `phenomena.lean` · 4
- [The Planck length, and what a lattice may say about it](/paper/planck) · `planck.lean` · 35
- [Quantum error-correcting codes, the decidable parameters — learned from qpu's Surfacecode and Stabilizer](/paper/qec) · `qec.lean` · 8
- [Order-invariance](/paper/quantum) · `quantum.lean` · 11
- [The rest of the quantum ideas, and the software layer — superdense coding, the two repetition codes correcting a state, the Toffoli gate, the swap test, and a compiler's rewrites, each decided exactly beside a control](/paper/quantum_software) · `quantum_software.lean` · 8
- [What exhaustion reaches, and what lies outside it](/paper/reach) · `reach.lean` · 12
- [Annealer topology, QFT resource counts, and π's rational convergents — learned from qpu's Annealing, Qft, Pi](/paper/resources) · `resources.lean` · 8
- [The constants, derived from what they are](/paper/roots) · `roots.lean` · 7
- [Why verification is fast, and what it is not](/paper/speed) · `speed.lean` · 28
- [Gate synthesis and fault-tolerance counts — learned from qpu's Clifford, Anyon, Magic and Qaoa](/paper/synthesis) · `synthesis.lean` · 8
- [The T-count wall — why a classical Pauli-path computation, which has no width limit, still cannot run Shor's circuit on a thousand-bit modulus, and why a physical processor is needed there: a statement about cost, not a factoring](/paper/t_count_wall) · `t_count_wall.lean` · 8
- [The readings, and the arithmetic under them](/paper/theology) · `theology.lean` · 8
- [The thousand-bit case, decided — its octave/trinity/cube structure and its utilisation of the register](/paper/thousandbit) · `thousandbit.lean` · 16

**the ring** — 536 theorems
- [Two kinds of cross formula — one that runs both ways and one that does not](/paper/asymmetry) · `asymmetry.lean` · 8
- [The named properties of this ring are not closed under their own diagonal](/paper/closure) · `closure.lean` · 8
- [Expressions that compute the same residues, clustered](/paper/coils) · `coils.lean` · 50
- [The two-sided coin](/paper/coin) · `coin.lean` · 12
- [Counting Rocks — the counting identities](/paper/counting-rocks) · `counting-rocks.lean` · 9
- [No ring of labels addresses the subject built from its own diagonal](/paper/diagonal) · `diagonal.lean` · 7
- [The reflection lifts digitwise, and the constant it adds to is ten times a repunit](/paper/digits) · `digits.lean` · 8
- [The Planck exponents are the only ones the dimensions permit](/paper/dimensions) · `dimensions.lean` · 8
- [A coverage figure is worth what its control does not already explain](/paper/discount) · `discount.lean` · 6
- [The reach of the diagonal is the domain you read against, and nine folds past nine](/paper/domain) · `domain.lean` · 8
- [Elementary arithmetic](/paper/elementary) · `elementary.lean` · 40
- [Where a practical subject and a science are the same statement](/paper/entangled) · `entangled.lean` · 8
- [Substitution inside a coil is sound and across coils is not](/paper/equivalence) · `equivalence.lean` · 8
- [Why an array is the criterion of a cross formula and a hash cannot be one](/paper/extension) · `extension.lean` · 11
- [Families over the ring](/paper/families) · `families.lean` · 63
- [The doubling flow, for every step](/paper/flow) · `flow.lean` · 16
- [What every involution gives, and what it does not](/paper/involution) · `involution.lean` · 8
- [The merkaba](/paper/merkaba) · `merkaba.lean` · 8
- [The reflection is four pairs and one centre, and zero is the one that folds instead](/paper/mirror) · `mirror.lean` · 8
- [What qpu.uuidna.com and this deposit independently count the same way](/paper/qpu) · `qpu.lean` · 24
- [What qpu.uuidna.com's cryptographic surface is, decided on its own integers](/paper/qpu_crypto) · `qpu_crypto.lean` · 64
- [qpu's coin is a function of a 64-bit fold, so it spans at most 2^64 of its 2^122 layout](/paper/qpu_fold) · `qpu_fold.lean` · 8
- [The two gateway bits are constant, so the teleport analogy has no bits to send](/paper/qpu_gateway) · `qpu_gateway.lean` · 8
- [A reading that does not vary with what it reads separates nothing](/paper/separation) · `separation.lean` · 8
- [Sequences](/paper/sequences) · `sequences.lean` · 28
- [The digit split](/paper/split) · `split.lean` · 22
- [Doubling is two loops and both close at three hundred and sixty degrees](/paper/turns) · `turns.lean` · 8
- [The ring ℤ/9](/paper/z9) · `z9.lean` · 24
- [Entanglement in the ring](/paper/z9plus) · `z9plus.lean` · 48

**the imagined** — 24773 theorems
- [The enumerated family](/paper/imagined-the-imagined) · `imagined*.lean` · 24742 (summarised)
- [The subjects and the group are the same object](/paper/bridge) · `bridge.lean` · 8
- [The structure the statements live in](/paper/group) · `group.lean` · 8
- [Sealed before the vocabulary moved, and still decided](/paper/retained) · `retained.lean` · 15

**the machine** — 285 theorems
- [Generated at scale](/paper/generated) · `generated.lean` · 13
- [Mechanically translated](/paper/mechanical) · `mechanical.lean` · 127
- [Nim](/paper/nim) · `nim.lean` · 28
- [A fold that returns a lone leaf unchanged admits a second preimage](/paper/preimage) · `preimage.lean` · 8
- [The CHSH circuits sent to a quantum device give exactly 2√2, decided over the cyclotomic integers](/paper/quantum_circuits) · `quantum_circuits.lean` · 8
- [When a quantum device's counts are above the classical bound, decided on exact integers](/paper/quantum_hardware) · `quantum_hardware.lean` · 8
- [Every quantum computing model ISO/IEC 4879 names, one exact instance each, decided over the cyclotomic integers](/paper/quantum_models) · `quantum_models.lean` · 8
- [The 124-qubit Mermin sum — the UUID minus one hex digit — as eight UUID particles](/paper/quantum_octave_124) · `quantum_octave_124.lean` · 8
- [The 128-qubit octave, split into eight UUID particles — the Mermin lead 2⁶³ at the UUID width](/paper/quantum_octave_128) · `quantum_octave_128.lean` · 9
- [The Bell test scaled in octaves — 2, 4, 8 … 128 qubits — with the quantum lead doubling its exponent](/paper/quantum_octaves) · `quantum_octaves.lean` · 15
- [qpu's quantum textbook numbers, each derived exactly from the quantum mechanics that produces it](/paper/quantum_textbooks) · `quantum_textbooks.lean` · 8
- [124 qubits from the UUID — the Mermin lead 2⁶¹, the odd bound, and the 124-qubit cluster state, as coins](/paper/quantum_uuid_cluster) · `quantum_uuid_cluster.lean` · 8
- [The universal reflection, and where it stops being one](/paper/reflection) · `reflection.lean` · 8
- [Digit reversal](/paper/reversal) · `reversal.lean` · 29

**the record** — 41 theorems
- [Prior art, and what novelty is claimed](/paper/priorart) · `priorart.lean` · 9
- [The discovery ranking is monotone, and it is far coarser than it looks](/paper/ranking) · `ranking.lean` · 8
- [Rights](/paper/rights) · `rights.lean` · 8
- [What each file says it settles, checked against what it does](/paper/settled) · `settled.lean` · 8
- [The prior-art verdict is total, exclusive, and never improved by silence](/paper/verdict) · `verdict.lean` · 8

**the returned** — 95 theorems
- [What the ledger marked reachable, reached by the kernel](/paper/reached) · `reached.lean` · 80
- [Recovered — claims that computed and were withdrawn for want of a proof](/paper/recovered) · `recovered.lean` · 15

**the mind** — 24 theorems
- [The trinity and its observer](/paper/trinity) · `trinity.lean` · 24


<h2 class="paper-h">Index of theorems</h2>

Every printed theorem by name: [index of theorems](/paper/theorem-index) (26,357 entries, letter-bucketed).


<h2 class="paper-h">Verification</h2>

Clone the repository and run `node scripts/lean.ts` to re-check every statement above against the Lean 4 kernel, or `npm run forensics` to re-verify the append-only receipt chain. The sources are [src/proof/](https://github.com/ceccec/millennium-solutions/tree/main/src/proof), and each sealed theorem also has its own page carrying the same statement. A content-address proves integrity, not truth.

</div>
