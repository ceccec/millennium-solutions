-- title: qpu's coin is a function of a 64-bit fold, so it spans at most 2^64 of its 2^122 layout
-- wing: the ring
-- prior_art: named
-- prior_art_domain: FNV-1a (Fowler, Noll, Vo, 1991), a 64-bit non-cryptographic hash; the pigeonhole
--   principle (Dirichlet, 1834); the birthday bound, that a collision among values drawn from a space of size
--   2^n appears near 2^(n/2) draws; and Grover search (Grover, 1996), whose preimage cost on a space of size N
--   is about √N. qpu's own README states the coin's Grover cost as 2^61 by taking the search space to be the
--   122-bit layout.
-- prior_art_note: NONE OF THESE IS THIS DEPOSIT'S. FNV-1a, pigeonhole, the birthday bound and Grover are all
--   named prior work. What is this deposit's is the decision — on qpu's own fold, read from
--   ~/github/uuidna/qpu/src/quantum/uuid/index.ts at 4ce19dde6 on 2026-11-09 — that the content UUID is a
--   function of a 64-bit state, so the coins qpu actually emits number at most 2^64, not the 2^122 the layout
--   leaves open; and that the search floor a reader would measure is therefore the fold's width (64), not the
--   layout's (122). The bound is an UPPER bound and needs only the fold's WIDTH: it does not depend on any
--   property of FNV beyond that it produces a 64-bit value, so FNV's permutation is not modelled here. One
--   step of the fold IS transcribed, and checked against the value qpu's code computes, so the width is read
--   from the real function and not assumed.
-- prior_art_search: not performed — every ingredient is named above and none is claimed as new.
-- prior_art_pool: bounded
-- prior_art_own: the transcription of one fold step checked against qpu's output, the structural bound that a
--   content address factoring through a 64-bit state reaches at most 2^64 values (modelled at small width with
--   a control that removes the bound by widening the intermediate), and the arithmetic that places the real
--   search floor at the fold width.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHY THIS FILE EXISTS.
--
-- src/proof/capacity.lean decides that a UUID leaves 122 free bits, and qpu's README reads that as 2^122
-- values and a Grover cost of 2^61 = √(2^122). But qpu's coins are not drawn from the 122-bit layout. They are
-- content addresses: `uuid(text)` folds the text to a 64-bit FNV-1a state and lays every output digit out from
-- that state (the high half is the state; the low half is `foldFrom(state, '\u0000shape')`, a function of the
-- state; the version nibble is decided by the other 31). So the whole 122-bit address is a function of a
-- 64-bit value, and a function of a 64-bit value takes at most 2^64 outputs however wide its codomain is. The
-- 122-bit layout is the codomain; the 64-bit fold is the domain; 2^122 − 2^64 of the layout's addresses are
-- never the content address of anything.
--
-- WHAT THIS MEANS FOR A SEARCH, which the question raised. A coin may of course be searched, and a search
-- MEASURES a floor rather than proving a strength: it is the width that sets the floor, and the width here is
-- 64, not 122. Classical preimage of a content coin costs at most 2^64, its Grover preimage about 2^32 = √2^64,
-- and a birthday collision about 2^32 — each below the 2^61 the README quotes against the full layout. This
-- file decides that gap. It does not call the coin broken: 2^32 is real work, and the coin is an identifier,
-- not a key (RFC 9562 §8). It states where the floor is, measured from qpu's own fold.
--
-- THE BOUND IS MODELLED AT SMALL WIDTH, by the deposit's rule: 2^64 cannot be enumerated, so the mechanism —
-- a narrow intermediate caps the image, and widening it lifts the cap — is decided at four bits against eight,
-- and the real 64-against-122 is carried as arithmetic. No step claims to enumerate 2^64.
--
-- No axioms, no Mathlib, no sorry.
set_option exponentiation.threshold 200
set_option maxRecDepth 4000000

namespace QpuFold

-- ── THE FOLD, ONE STEP, TRANSCRIBED FROM qpu's CODE ───────────────────────────────────────────────────────
-- qpu's `foldFrom` keeps the 64-bit FNV-1a state in four 16-bit limbs and, per input byte c, computes
--   h0 ^= c; t0 = h0·0x1b3; t1 = h1·0x1b3 + (t0>>16); t2 = h2·0x1b3 + (h0<<8) + (t1>>16);
--   h3 = (h3·0x1b3 + (h1<<8) + (t2>>16)) & 0xffff; h0 = t0 & 0xffff; h1 = t1 & 0xffff; h2 = t2 & 0xffff.
-- Here >>16 is /mask, <<8 is ·256, &0xffff is %mask, and XOR is the structural xor16 below (Nat.xor would drag
-- propext through well-founded recursion; this one is arithmetic over sixteen bits and carries no axiom).
def mask : Nat := 65536
def prime : Nat := 435
def bit (n i : Nat) : Nat := n / 2 ^ i % 2
def xor16 (a b : Nat) : Nat := (List.range 16).foldl (fun acc i => acc + ((bit a i + bit b i) % 2) * 2 ^ i) 0
def t0 (h0 c : Nat) : Nat := xor16 h0 c * prime
def t1 (h0 h1 c : Nat) : Nat := h1 * prime + t0 h0 c / mask
def t2 (h0 h1 h2 c : Nat) : Nat := h2 * prime + xor16 h0 c * 256 + t1 h0 h1 c / mask
def newH3 (h0 h1 h2 h3 c : Nat) : Nat := (h3 * prime + h1 * 256 + t2 h0 h1 h2 c / mask) % mask

-- ── 1 · THE TRANSCRIBED STEP REPRODUCES qpu's OUTPUT ──────────────────────────────────────────────────────
-- The OFFSET limbs are 0x2325, 0x8422, 0x9ce4, 0xcbf2 = 8997, 33826, 40164, 52210. Folding one byte 'a'
-- (0x61 = 97) gives the limbs 60556, 34305, 56396, 44899, which qpu's code prints as af63dc4c8601ec8c. The
-- XOR control: xor16 agrees with the three fixed points every XOR has (x⊕x = 0, x⊕0 = x).
theorem the_transcribed_fold_step_reproduces_qpus_output :
  xor16 8997 97 = 9028 ∧ xor16 255 255 = 0 ∧ xor16 1234 0 = 1234
  ∧ t0 8997 97 % mask = 60556 ∧ t1 8997 33826 97 % mask = 34305
  ∧ t2 8997 33826 40164 97 % mask = 56396 ∧ newH3 8997 33826 40164 52210 97 = 44899 := by decide

-- ── 2 · THE STATE IS FOUR SIXTEEN-BIT LIMBS, SO SIXTY-FOUR BITS ───────────────────────────────────────────
-- mask = 2^16, four limbs multiply to 2^64, and the concrete 'a' state, assembled low-limb first, is < 2^64.
-- This is where the 64 comes from: the fold's own width, read from the limbs, not assumed.
theorem the_fold_state_is_four_sixteen_bit_limbs_so_sixty_four_bits :
  mask = 2 ^ 16 ∧ mask * mask * mask * mask = 2 ^ 64 ∧ 4 * 16 = 64 ∧ 64 / 4 = 16
  ∧ (t0 8997 97 % mask) + (t1 8997 33826 97 % mask) * 2 ^ 16
      + (t2 8997 33826 40164 97 % mask) * 2 ^ 32 + (newH3 8997 33826 40164 52210 97) * 2 ^ 48 < 2 ^ 64 := by decide

-- ── A SCALED ANALOGUE OF THE LAYOUT: A w-BIT FOLD FEEDING A p-BIT ADDRESS ──────────────────────────────────
-- The real figures are a 64-bit fold into a 122-bit layout. They cannot be enumerated, so the MECHANISM is
-- decided at w = 4 into p = 8, and the real numbers are carried as arithmetic in theorems 7 and 8.
def W : Nat := 4
def Pbits : Nat := 8
def coinOf (state : Nat) : Nat := state          -- the address as a function of the state (an embedding)
def stateOf (text : Nat) : Nat := text % 2 ^ W   -- distinct texts collapse onto 2^W states
def coin (text : Nat) : Nat := coinOf (stateOf text)

-- ── 3 · THE COIN IS A FUNCTION OF THE STATE, SO TEXTS COLLAPSE ────────────────────────────────────────────
-- coin factors through stateOf: texts with the same state give the same coin. A concrete collapse: text 3 and
-- text 3 + 2^W are different inputs with one coin. Control: it holds for every pair with equal state.
theorem the_coin_depends_only_on_the_state_so_distinct_texts_share_it :
  (List.range 40).all (fun t => coin t == coin (stateOf t))
  ∧ coin 3 = coin (3 + 2 ^ W) ∧ (3 : Nat) ≠ 3 + 2 ^ W
  ∧ (List.range 40).all (fun a => (List.range 40).all (fun b => !(stateOf a == stateOf b) || coin a == coin b)) := by decide

-- ── 4 · A NARROW FOLD REACHES FEW OF THE MANY ADDRESSES ──────────────────────────────────────────────────
-- Over the 2^W states the reached addresses number exactly 2^W, against a layout of 2^Pbits, so 2^Pbits − 2^W
-- addresses are never reached. At w = 4, p = 8 that is 256 − 16 = 240 unreachable of 256.
theorem a_narrow_fold_reaches_few_of_the_layouts_addresses :
  ((List.range (2 ^ Pbits)).filter (fun v => (List.range (2 ^ W)).any (fun s => coinOf s == v))).length = 2 ^ W
  ∧ (List.range (2 ^ Pbits)).length = 2 ^ Pbits
  ∧ 2 ^ Pbits - 2 ^ W = 240 ∧ 2 ^ W < 2 ^ Pbits := by decide

-- ── 5 · THE CONTROL: WIDEN THE INTERMEDIATE AND THE WHOLE LAYOUT IS REACHED ───────────────────────────────
-- Fill the same p-bit address from TWO independent w-bit fields and every one of the 2^(2W) = 2^Pbits
-- addresses is reached. So it is the factoring through ONE w-bit state that caps the image, not the layout.
def pairFill (a b : Nat) : Nat := a * 2 ^ W + b
theorem two_independent_fields_reach_every_address_so_the_fold_is_the_cap :
  ((List.range (2 ^ Pbits)).filter (fun v => (List.range (2 ^ W)).any (fun a => (List.range (2 ^ W)).any (fun b => pairFill a b == v)))).length = 2 ^ Pbits
  ∧ 2 * W = Pbits := by decide

-- ── 6 · MORE TEXTS THAN STATES FORCE A COLLISION ─────────────────────────────────────────────────────────
-- Pigeonhole: 2^W + 1 texts into 2^W states share a state, so two share a coin — the collision a search finds.
-- Control: among exactly 2^W texts chosen to be one per state (the identity on 0..2^W−1), none collide.
theorem more_texts_than_states_force_a_coin_collision :
  (List.range (2 ^ W + 1)).any (fun i => (List.range (2 ^ W + 1)).any (fun j => i < j && stateOf i == stateOf j))
  ∧ (List.range (2 ^ W)).all (fun i => (List.range (2 ^ W)).all (fun j => !(i < j) || stateOf i != stateOf j))
  ∧ (List.range (2 ^ W + 1)).length = 2 ^ W + 1 := by decide

-- ── 7 · THE REAL FOLD IS SIXTY-FOUR BITS AGAINST A HUNDRED-TWENTY-TWO-BIT LAYOUT ──────────────────────────
-- The numbers the model stands in for: 2^64 coins at most, 2^122 addresses, a gap of 58 bits, and 2^122 − 2^64
-- addresses that no content reaches. 2^64 · 2^58 = 2^122 states the gap as a factor, not an impression.
theorem the_real_fold_is_sixty_four_bits_against_the_hundred_twenty_two_bit_layout :
  2 ^ 64 < 2 ^ 122 ∧ 2 ^ 64 * 2 ^ 58 = 2 ^ 122 ∧ 122 - 64 = 58
  ∧ 2 ^ 122 - 2 ^ 64 > 0 ∧ mask * mask * mask * mask = 2 ^ 64 := by decide

-- ── 8 · THE SEARCH FLOOR IS THE FOLD WIDTH, NOT THE LAYOUT WIDTH ──────────────────────────────────────────
-- A Grover preimage or a birthday collision costs about the square root of the search space. qpu's README takes
-- the space to be 2^122 and reads 2^61. The content space is 2^64, so the measured floor is 2^32 = √2^64:
-- below the README's 2^61, and far below the 2^122 layout. The exponents are each half their width.
theorem the_search_floor_is_the_fold_width_not_the_layout_width :
  32 * 2 = 64 ∧ 61 * 2 = 122
  ∧ 2 ^ 32 * 2 ^ 32 = 2 ^ 64
  ∧ 2 ^ 32 < 2 ^ 61 ∧ 2 ^ 61 < 2 ^ 122 ∧ 2 ^ 64 < 2 ^ 122 := by decide

end QpuFold
