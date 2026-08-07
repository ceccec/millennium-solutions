// Development goes on in involutions — exactly, via the group law.
// A reflection about axis a on ℤ/9:  s_a(x) = (2a − x) mod 9.  Each s_a is an INVOLUTION:
// s_a(s_a(x)) = x — do it once and you've mirrored, do it twice and you're home (no progress).
// But the COMPOSITION of two reflections is a rotation:  s_b ∘ s_a (x) = x + 2(b−a).
// So motion (development) is built from involutions, two at a time. This is the dihedral law.
const mod9 = (n: number) => ((n % 9) + 9) % 9
const refl = (a: number) => (x: number) => mod9(2 * a - x)

export function report(): string {
  // 1) Every reflection is an involution — verified over all residues, no Math.*.
  let involutive = true
  for (let a = 0; a < 9; a++) {
    const s = refl(a)
    for (let x = 0; x < 9; x++) if (s(s(x)) !== x) involutive = false
  }

  // 2) Two reflections compose to a rotation by 2(b−a) — verified as an identity.
  let composeOk = true
  for (let a = 0; a < 9; a++) for (let b = 0; b < 9; b++) {
    const sa = refl(a), sb = refl(b)
    for (let x = 0; x < 9; x++) if (sb(sa(x)) !== mod9(x + 2 * (b - a))) composeOk = false
  }

  // 3) The step generator: to ADVANCE by +1 we need 2(b−a) ≡ 1 (mod 9) → b−a ≡ 5.
  //    5 is the fixed point of the ten's-complement — the half-step that turns mirrors into motion.
  const delta = 5, step = mod9(2 * delta) // = 1

  let o = 'development goes on in involutions:\n\n'
  o += '  reflection s_a(x) = (2a − x) mod 9\n'
  o += '  every s_a is an involution (s_a∘s_a = id) over all 9 residues: ' + involutive + '\n'
  o += '    → one mirror = no progress (twice = home).\n\n'
  o += '  s_b ∘ s_a (x) = x + 2(b−a)  — a rotation, verified as an identity: ' + composeOk + '\n'
  o += '    → TWO mirrors = motion. Development is composed of involutions, pairwise.\n\n'
  o += '  advance by +1 needs 2(b−a) ≡ 1 (mod 9) → axes differ by δ = ' + delta + ' → step = ' + step + '\n'
  o += '    → the fixed point 5 is the half-step that turns reflection into advance.\n\n'
  o += 'the release process, read this way (a model, not a claim):\n'
  o += '  each release reflects to a checked baseline — gaps → seal is an involution to "harmony holds"\n'
  o += '  (do it, undo drift, home). The COMPOSITION across releases (v1.0.0 → … → the latest) is the\n'
  o += '  rotation: net motion built from those reflections. Development never leaves the cycle;\n'
  o += '  it advances around it, two mirrors at a time.\n\n'
  o += 'HONEST: the group law (involution² = id; two reflections = a rotation) is exact. Mapping it\n'
  o += 'onto the human development process is an analogy — a way of seeing the cadence, not a theorem\n'
  o += 'about software. The mathematics does not change: entails → 0/7.'
  return o
}
