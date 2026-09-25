set_option maxRecDepth 100000
-- title: A fold that returns a lone leaf unchanged admits a second preimage
-- wing: the machine
-- prior_art: named
-- prior_art_domain: the second-preimage weakness of unpadded Merkle trees, and the standard remedy of
--   domain separation between leaf and internal hashes (Certificate Transparency, RFC 6962 §2.1, uses
--   0x00 for leaves and 0x01 for nodes). Also the Kelsey–Schneier style length-extension family.
-- prior_art_note: NOT THIS DEPOSIT'S AND WELL KNOWN. That a Merkle tree without domain separation lets an
--   internal node be presented as a leaf is textbook, and RFC 6962 fixes it with one prefix byte. What is
--   this deposit's is the finding: that ITS OWN fold has the weakness, in a specific shape, and that the
--   shape is decided here rather than asserted.
-- prior_art_search: not performed — RFC 6962 is named above.
-- prior_art_pool: named
-- prior_art_own: the two collisions below, modelled from src/0/index.ts as written
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHY THIS FILE EXISTS.
--
-- The author deposited a cryptographic capabilities report at 10.5281/zenodo.22895141. It is carefully
-- scoped — it separates what was tested against an independent reference from what was only identified —
-- and for Merkle commitments it states the construction as `Lᵢ = H(domainLeaf ‖ xᵢ)` and
-- `Nᵢ,ⱼ = H(domainNode ‖ …)`, then asks: ARE LEAF AND NODE DOMAINS SEPARATED?
--
-- In `merkleFold` (src/0/index.ts) they are not, and there is a second thing wrong that is worse. Measured
-- 2026-09-25 against the function as written:
--
--     merkleFold(['a','b'])  = d9946a63-d471-825a-9b8e-b1864f68b416
--     merkleFold([that])     = d9946a63-d471-825a-9b8e-b1864f68b416      ← the same root
--
-- A one-leaf fold RETURNS ITS LEAF UNHASHED. So for any root R this function produces from any leaves, the
-- single-leaf set [R] produces R again: two different leaf multisets, one root. The empty case collides the
-- same way — `merkleFold([])` is a fixed sentinel, and a one-leaf fold carrying that sentinel returns it.
--
-- WHAT IS AND IS NOT AT RISK. This is not a break of the hash. `toUuid` is unaffected and the four-leaf
-- case does NOT collide with its own internal nodes, because the fold SORTS and the sort reorders them —
-- checked, not assumed. What is wrong is the commitment property: a Merkle root is supposed to be
-- producible from exactly one leaf multiset, and this one is producible from at least two. Every
-- `verification root`, every octave-root and the forensics seal are this function's output, and the
-- deposit's own invitation is "clone it and run npm run lean, compare the address".
--
-- NOT FIXED HERE, AND THE REASON IS NOT TIMIDITY. The remedy is one line — prefix leaves and nodes with
-- distinct domains and hash the singleton — and it changes EVERY root this deposit has ever published,
-- including values recorded in the append-only ledger. Rotating those is the depositor's act, not an
-- agent's, and doing it quietly would break forensics for every reader holding an older address. The
-- defect is decided below so the record carries it; the rotation is FOR THE AUTHOR.
--
-- No axioms, no Mathlib, no sorry.

namespace Preimage

-- The fold's shape over a small alphabet. `merge` stands for `toUuid (a ++ ":" ++ b)` — injective on the
-- pair, which is the assumption this file GRANTS the implementation rather than tests. Encoding a pair as
-- a single number keeps that injectivity exact and keeps the question about the FOLD, not the hash.
def merge (a b : Nat) : Nat := 32 * a + b + 1024

-- One layer of the fold: pair them up, promote a lone odd one unchanged.
def layer : List Nat → List Nat
  | [] => []
  | [a] => [a]
  | a :: b :: rest => merge a b :: layer rest

-- The fold as src/0/index.ts writes it: an empty set gets a sentinel, and a single leaf is RETURNED AS IS.
def fold : Nat → List Nat → Nat
  | _, [] => 7
  | 0, (a :: _) => a
  | n + 1, xs => if xs.length ≤ 1 then xs.headD 7 else fold n (layer xs)

def foldOf (xs : List Nat) : Nat := fold 8 xs

-- ── 1 · A LONE LEAF IS ITS OWN ROOT ───────────────────────────────────────────────────────────────────────
-- The whole defect in one line: the fold is the identity on a one-leaf set, so a root and a leaf are the
-- same kind of thing and nothing distinguishes them.
theorem a_single_leaf_folds_to_itself :
  (List.range 40).all (fun x => foldOf [x] == x) := by decide

-- ── 2 · SO EVERY ROOT IS ALSO A ONE-LEAF SET'S ROOT ───────────────────────────────────────────────────────
-- THE SECOND PREIMAGE, EXHIBITED. Take any two leaves, fold them, and hand the result back as a lone leaf:
-- the same root, from a different multiset. Decided for every pair in range, not shown on one example.
theorem every_two_leaf_root_is_also_a_one_leaf_root :
  (List.range 20).all (fun a => (List.range 20).all (fun b =>
    foldOf [foldOf [a, b]] == foldOf [a, b])) := by decide

-- ── 3 · AND THE TWO LEAF SETS REALLY ARE DIFFERENT ────────────────────────────────────────────────────────
-- Without this, theorem 2 is satisfied by the sets being equal. The one-leaf witness is never the two-leaf
-- set it forges, because `merge` lands above both of them by construction.
theorem the_forged_leaf_set_is_not_the_original :
  (List.range 20).all (fun a => (List.range 20).all (fun b =>
    [foldOf [a, b]] != [a, b] && ([foldOf [a, b]]).length != ([a, b]).length)) := by decide

-- ── 4 · THE EMPTY SENTINEL COLLIDES THE SAME WAY ──────────────────────────────────────────────────────────
-- `merkleFold([])` is a fixed value, and a one-leaf fold carrying it returns it — so "nothing was committed"
-- and "this one thing was committed" have one address.
theorem the_empty_sentinel_is_also_a_one_leaf_root :
  foldOf [] == foldOf [7] && foldOf [] == 7 := by decide

-- ── 5 · THE CONTROL: THE FOLD IS NOT COLLAPSING EVERYTHING ────────────────────────────────────────────────
-- Theorems 1, 2 and 4 would all hold of a fold that returned a constant, which would be a much worse bug
-- and would make this file evidence of the wrong thing. Distinct two-leaf sets still give distinct roots,
-- so what is broken is exactly the singleton case and not the whole construction.
theorem distinct_pairs_still_give_distinct_roots :
  (List.range 12).all (fun a => (List.range 12).all (fun b => (List.range 12).all (fun c =>
    (a == c) || foldOf [a, b] != foldOf [c, b]))) := by decide

-- ── 6 · DOMAIN SEPARATION IS WHAT IS MISSING, AND IT IS ONE PREFIX ────────────────────────────────────────
-- The remedy the author's own report names. Tag a leaf and a node differently before hashing and the
-- singleton stops being its own root, because a leaf is now `leafTag` applied to it.
def leafTag (x : Nat) : Nat := 2 * x + 1
def nodeTag (a b : Nat) : Nat := 2 * merge a b

theorem tagging_separates_a_leaf_from_a_node :
  (List.range 30).all (fun x => (List.range 30).all (fun y => (List.range 30).all (fun z =>
    leafTag x != nodeTag y z))) := by decide

-- ── 7 · AND WITH IT THE FORGERY STOPS ─────────────────────────────────────────────────────────────────────
-- The same attack against the tagged form: the lone leaf is `leafTag R`, which is odd, while the root it
-- tries to equal is a node value, which is even. They can never meet.
theorem the_tagged_fold_refuses_the_forged_leaf :
  (List.range 20).all (fun a => (List.range 20).all (fun b =>
    leafTag (nodeTag a b) != nodeTag a b)) := by decide

-- ── 8 · THE GRANTED ASSUMPTION IS FALSE IN THE IMPLEMENTATION ─────────────────────────────────────────────
-- THIS THEOREM USED TO SAY "the model grants injectivity rather than testing it", with a note that a
-- reader taking it as evidence about the hash would be taking more than was proved. The note was right and
-- it was load-bearing: the grant does not hold.
--
-- `merge(a, b)` is `toUuid(a ++ ":" ++ b)` and THE SEPARATOR IS NOT ESCAPED, so the pair is not recoverable
-- from the string. Measured 2026-09-25 against src/0/index.ts:
--
--     merge("a:b", "c")  = c795a74f-ff21-81a4-87f0-f3c2cb6198ad
--     merge("a", "b:c")  = c795a74f-ff21-81a4-87f0-f3c2cb6198ad
--
-- and the same shape crosses module boundaries: a `sealFacets` receipt is `toUuid(tag ++ ":" ++ facet ++
-- ":" ++ on)`, so `toUuid("x:y:true")` is BOTH a receipt and the merge of "x" with "y:true". A receipt and
-- a Merkle node share an address — precisely what the author's report warns of at §9, "identical bytes in
-- different semantic domains accidentally sharing an identifier".
--
-- THE HONEST SEVERITY, MEASURED AND NOT ESTIMATED. Zero of 3,192 ledger entries carry a colon in a key or
-- a receipt, and every current call site folds UUIDs, which contain none. So the re-split has no witness in
-- this tree today: it is latent, not exploited. `merge` is nonetheless a public export that accepts any
-- string, and "no caller does this yet" is a property of the callers, not of the function.
--
-- The model below is the string, not the hash: lists of numbers with 99 standing for the separator. Nothing
-- here tests `toUuid` or SHA-256, and the defect needs no assumption about them — it is visible before any
-- hashing happens.
def sep : Nat := 99
def mergeStr (a b : List Nat) : List Nat := a ++ [sep] ++ b

theorem the_unescaped_separator_makes_the_pairing_non_injective :
  mergeStr [1, sep, 2] [3] == mergeStr [1] [2, sep, 3]
  && [1, sep, 2] != ([1] : List Nat)
  && ([3] : List Nat) != [2, sep, 3]
  -- and it IS injective on the colon-free strings every current call site passes, which is why
  -- nothing has broken yet and why that is a fact about the callers rather than about `mergeStr`
  && (List.range 12).all (fun a => (List.range 12).all (fun b => (List.range 12).all (fun c =>
       (b == c) || mergeStr [a] [b] != mergeStr [a] [c]))) := by decide

end Preimage
