# src/iso — the proofs, grouped by the ISO standard they formalise

Each folder holds the Lean proofs for one ISO standard's domain; there is no "proof" catch-all. Crypto and
quantum proofs stay beside their code in `src/crypto` and `src/quantum`. The ledger and the deposit's data
live in `src/ledger`. A proof's identity is its basename, so a file is found wherever it lives.

## ISO/IEC 4879:2024 — `src/iso/iec-4879-quantum/` (3)
quantum computing — vocabulary & models.

- `qec.lean`
- `resources.lean`
- `synthesis.lean`

## ISO 80000-5 / 80000-10 — `src/iso/80000-physics/` (5)
quantities and units — physics.

- `dimensions.lean`
- `energy.lean`
- `light.lean`
- `nucleus.lean`
- `planck.lean`

## ISO 22739:2024 — `src/iso/22739-ledger/` (7)
blockchain and distributed ledger.

- `capacity.lean`
- `coin.lean`
- `demand.lean`
- `demand2.lean`
- `demand3.lean`
- `discount.lean`
- `ledgerclaims.lean`

## ISO/IEC 9834-8 — `src/iso/iec-9834-8-identifiers/` (8)
UUID / object identifiers & addressing.

- `address.lean`
- `handle.lean`
- `hexbit_route.lean`
- `imprint.lean`
- `merkle.lean`
- `rays.lean`
- `width.lean`
- `widths.lean`

## ISO 690 / ISO 26324 — `src/iso/690-record/` (7)
bibliographic references & DOI.

- `priorart.lean`
- `ranking.lean`
- `reached.lean`
- `recovered.lean`
- `rights.lean`
- `settled.lean`
- `verdict.lean`

## ISO/IEC 2382:2015 — `src/iso/iec-2382-computing/` (6)
information technology — vocabulary.

- `generated.lean`
- `mechanical.lean`
- `nim.lean`
- `preimage.lean`
- `reflection.lean`
- `reversal.lean`

## ISO 9001 — `src/iso/9001-governance/` (11)
quality management — the floor (governance).

- `answer_gate.lean`
- `answer_route.lean`
- `apis.lean`
- `authority.lean`
- `cern.lean`
- `index.lean`
- `instruments.lean`
- `lanes.lean`
- `leads.lean`
- `phenomena.lean`
- `reach.lean`

## ISO 80000-2 — `src/iso/80000-2-mathematics/` (57)
quantities and units — mathematics.

- `answer.lean`
- `arith.lean`
- `asymmetry.lean`
- `bridge.lean`
- `closure.lean`
- `coils.lean`
- `combinatorics.lean` — also ISO/IEC 4879:2024
- `counting-rocks.lean`
- `diagonal.lean`
- `diamond.lean`
- `digits.lean`
- `domain.lean`
- `elementary.lean`
- `entangled.lean`
- `equivalence.lean`
- `extension.lean`
- `families.lean`
- `flow.lean`
- `group.lean`
- `imagined.lean`
- `imagined_10.lean`
- `imagined_11.lean`
- `imagined_12.lean`
- `imagined_13.lean`
- `imagined_14.lean`
- `imagined_15.lean`
- `imagined_16.lean`
- `imagined_17.lean`
- `imagined_18.lean`
- `imagined_19.lean`
- `imagined_2.lean`
- `imagined_20.lean`
- `imagined_21.lean`
- `imagined_22.lean`
- `imagined_23.lean`
- `imagined_24.lean`
- `imagined_25.lean`
- `imagined_3.lean`
- `imagined_4.lean`
- `imagined_5.lean`
- `imagined_6.lean`
- `imagined_7.lean`
- `imagined_8.lean`
- `imagined_9.lean`
- `involution.lean`
- `merkaba.lean`
- `mirror.lean`
- `retained.lean`
- `separation.lean`
- `sequences.lean`
- `speed.lean` — also ISO 9001, ISO 80000-5
- `split.lean`
- `theology.lean` — also ISO 9001
- `thousandbit.lean` — also ISO/IEC 4879:2024, ISO/IEC 18033
- `turns.lean`
- `z9.lean`
- `z9plus.lean`

### Cross-cutting proofs
Four proofs the captain classified under *all* their applicable standards; they home in the
mathematics foundation and are listed here with every standard they satisfy:

- `thousandbit.lean` — ISO 80000-2, ISO/IEC 4879:2024, ISO/IEC 18033
- `speed.lean` — ISO 80000-2, ISO 9001, ISO 80000-5
- `theology.lean` — ISO 80000-2, ISO 9001
- `combinatorics.lean` — ISO 80000-2, ISO/IEC 4879:2024
