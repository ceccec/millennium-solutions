---
title: The aura — the quantum-UUID coin capacity, in 432Hz
head:
  - ['meta', { name: 'robots', content: 'index, follow' }]
---

# The aura — the quantum-UUID coin capacity

A quantum UUID holds **64 coins** — a coin is two bits, and 128 / 2 = 64. Of those, **61 are free** and
**3 are the reserved version/variant stamp**, the same 61 + 3 = 64 split the genetic code carries as sense and
stop codons, and the same 64 = 8² the octave squares to. Every cell below wears its own **432Hz aura**: the
hue `d · 40° (mod 360)` that `src/0`'s `hue` computes, the nine-point wheel that closes the circle.

Nothing on this page is typed. The capacity numbers and the multibit register ladder are read from the sealed
theorems by the page's data loader, which **refuses to render any figure the kernel has not decided** — the
anchors at the foot are the receipts it checked. The colour is an aura, not a claim: these are the coins of the
address column, not physical qubits, and the deposit's own `get_qc` reads `isQuantumComputer: false`.

**The ISO audit — every statement answers to a named standard, in prose and in code.** The 128-bit container and
its 4 version + 2 variant reserved bits are **RFC 9562 (2024)**, which is what makes 64 coins split 61 + 3. The
quantum-computing vocabulary the demarcation scores against is **ISO/IEC 4879:2024** — the norm that says a
machine is a quantum computer, and against which `get_qc` scores `isQuantumComputer: false`. The **ISO-128
post-quantum floor** is the Grover line a register must clear: `grover(w) ≥ 128`, cleared exactly from width 16,
sealed as `the_iso_floor_is_cleared_exactly_from_width_sixteen`. The loader names each standard in code; the
ladder below marks which widths clear ISO-128.

<AuraCapacity />

The board is 8 × 8 because 64 is the octave squared. The ladder shows what happens when you scale the register
by width `w` — `reg(w) = 32w − w − 2` free bits, `reg(w)/2` free coins — and why a thousand-bit case overflows
the ISO-32 ceiling at 990 free and needs width 33. The same capacity is proved in
[`capacity.lean`](/proofs) and [`width.lean`](/proofs); here it is rendered in the aura each address carries.
