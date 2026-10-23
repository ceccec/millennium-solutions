-- title: Interference: GHZ cancels on odd parity, a classical coin does not
-- wing: the floor
-- prior_art: named
-- prior_art_domain: GHZ states and the X-basis parity witness (Greenberger, Horne, Zeilinger 1989)
-- prior_art_note: the GHZ state, its X-basis parity, and the fact that a classical mixture cannot reproduce it are
--   established physics. This file adds no discovery. It states the mechanism over the three-qubit domain and
--   decides it, so the captain's coin of coin.lean is placed on one side of the line by a theorem and not by prose.
-- prior_art_search: none performed for this file; the claims are the standard three-qubit computation.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHAT QUANTUM MEANS HERE, IN ONE SENTENCE: amplitudes add, and two paths that reach the same outcome can cancel.
-- A classical mixture adds probabilities, which are never negative, so nothing cancels.
--
-- THE CAPTAIN'S COIN (coin.lean) flips the three bits together: |000⟩ or |111⟩, each with weight 1/2. In the
-- computational basis its statistics are those of GHZ, and so are its marginals (quantum.lean records this). So the
-- coin is not, by itself, evidence of entanglement. The difference shows only in the X basis.
--
-- Encoding. The Hadamard transform on three qubits sends |x⟩ to a sum over outcomes s of (-1)^{parity(x ∧ s)}|s⟩.
-- A branch contributes a PLUS at s when that parity is even, and a MINUS when it is odd. The GHZ state has two
-- branches, |000⟩ and |111⟩, and they add on s when their signs agree and cancel when they differ.
--
-- Everything is Nat and Bool, so each theorem is closed by `decide` and carries no axiom beyond the kernel's.

namespace Interference

/-- Bit i of n: 0 or 1. -/
def bit (n i : Nat) : Nat := n / (2 ^ i) % 2

/-- The parity of the three bits of n. -/
def par3 (n : Nat) : Nat := (bit n 0 + bit n 1 + bit n 2) % 2

/-- The parity of x ∧ s over three bits, as a sum of products of bits (no bitwise operator: those carry propext). -/
def dot (x s : Nat) : Nat := (bit x 0 * bit s 0 + bit x 1 * bit s 1 + bit x 2 * bit s 2) % 2

/-- True when the X-basis branch of |x⟩ carries a PLUS on outcome s, that is, when the parity of x ∧ s is even. -/
def plus (x s : Nat) : Bool := dot x s == 0

/-- How many of the two GHZ branches, |000⟩ and |111⟩, carry a PLUS on outcome s. Two pluses add (amplitude 2);
    one plus and one minus cancel (amplitude 0); two minuses add (amplitude -2). -/
def ghzPlus (s : Nat) : Nat := (plus 0 s).toNat + (plus 7 s).toNat

/-- The GHZ state cancels on s exactly when one branch is a plus and the other a minus. -/
def ghzCancels (s : Nat) : Bool := ghzPlus s == 1

-- ── 1 · GHZ CANCELS, AND ONLY ON ODD PARITY ──────────────────────────────────────────────────────────────
-- On every odd-parity outcome the two GHZ branches have opposite signs and cancel exactly; on every even-parity
-- outcome they agree and add. This is the interference a classical mixture does not have.
theorem ghz_cancels_exactly_on_odd_parity :
  (List.range 8).all (fun s => ghzCancels s == (par3 s == 1)) = true := by decide

-- ── 2 · THE OUTCOMES GHZ REACHES ─────────────────────────────────────────────────────────────────────────
-- Over the eight outcomes, GHZ reaches exactly the four even-parity ones. Its X-basis support is half the space,
-- and the four it misses are the odd-parity strings.
theorem ghz_reaches_exactly_the_four_even_outcomes :
  ((List.range 8).filter (fun s => !ghzCancels s)).length = 4
  ∧ (List.range 8).all (fun s => !ghzCancels s == (par3 s == 0)) = true := by decide

-- ── 3 · WHAT THIS DOES NOT SAY ──────────────────────────────────────────────────────────────────────────
-- It does not say the coin is a physical object, nor that any device realises either state. It does not decide
-- that the classical coin reaches all eight outcomes: that needs the weights of the mixture, which are sums of
-- squares and so never cancel, and a theorem stating it needs signed arithmetic, which this file keeps out so that
-- every theorem here stays axiom-free. The computational-basis agreement of coin and GHZ is recorded in quantum.lean.
-- A reading of coin.lean as quantum must hold this line: the coin alone is not evidence of entanglement.

end Interference
