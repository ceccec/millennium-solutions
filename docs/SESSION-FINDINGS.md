# What this session measured, and what it learned

Findings computed in the 2026-09-04 session, exported from the agent's own memory store into this
repository, because they were computed here and belong here. Each is a rail derived from a measured
defect in this tree, not general advice.

---


When a gate names a defect, check that its FILE DOMAIN covers everywhere that defect can live. Three
instances in the 2026-09-04 session, each a check that had been green for weeks:

- the self-certifying-literal sweep read `.ts`; the identical `def X := N` / `theorem X = N := rfl` shape
  sat in 8 `.lean` files, 5 with wrong numbers, published as typeset MathML
- the prose sweeps (Clay/quantum overclaims) walked `md|ts|vue`; adding `.lean` changed NOTHING because the
  extractor pulling "what a file says in its own voice" knew markdown fences and `//`, and Lean opens a
  comment with `--`. Zero lines from 19,519 words of published prose
- `hardcode-gate` ("no literal restates a computed set") walked `scripts/` and `src/prove/`; Hero.vue,
  Vortex7D.vue and Propulsion.vue hand-typed the units and the doubling orbit — the most-seen page in the
  project was the one place a restatement could sit unheld

**Why:** widening the domain is not the fix and feels like one. Adding `.lean` to the walk reported green,
and I nearly committed that — a widened domain with no extractor behind it goes green for exactly the reason
an empty list does. Two of the three were LATENT (the values matched), which is why nothing looked wrong: a
set that agrees today by luck is not a set under a gate.

**How to apply:** after widening, PLANT the defect on each new surface and confirm it fires. Publish a
per-surface count of what was actually read (a peer's better fix: a blind reader then shows as "0 sentences"
rather than "0 findings", so a future reader sees the difference without knowing to look).

Same family, one layer up: `scripts/ci-local.ts` said "run what CI runs" with a HAND-WRITTEN step list. It
drifted, and three broken deploys came out of the gap. `scripts/ci-drift.ts` now derives the check from the
workflow files. See [[check-the-instrument-first]] and [[unfalsifiable-checks]].

---


Give a number that CLEARS you the scrutiny you would give one that accuses you. Named by zeropoint-node-8a
on 2026-09-04 after we made the same measurement error with opposite signs in the same hour:

- mine ACCUSED: one timing sample suggested my ledger-cache change had made `gates` slower. I re-ran it
  three times, saw 7.5–13.0s for an identical command, and reported only the number that reproduced.
- theirs CLEARED: one 0.25s sample suggested their two heaviest gates were not the bottleneck. They told
  their user so. The gates were 81% of the chain.

Their observation is the transferable part: the wrong conclusion survived *because it was flattering*. A
suspicion of regression gets re-run; a clean bill of health gets published.

**Why:** the impulse to verify is driven by discomfort, so it fires on bad news and not on good. Every
"already fine", "no findings", "0 of N", "not the bottleneck" in this repo is a place where that asymmetry
had free rein — and several such zeros this session were the instrument, not the tree (an empty extractor,
a `dc:` selector on a DataCite response, a grep for a path format that never matched).

**How to apply:** when a result exonerates, ask what it would look like if the check were broken, and
confirm it can produce the other answer. A zero that cannot go non-zero and a pass that cannot fail are the
same defect. See [[check-the-instrument-first]] and [[domain-narrower-than-the-defect]].

---


Content gets instrumented; addresses do not. Named by ceccec-github-io-5b on 2026-09-04: *"we both
instrumented the content and neither of us instrumented the address."*

Across five repositories there were receipt chains, content-addresses, statement-addresses, fingerprints and
merkle folds — every one addressing CONTENT. Every identifier pointing OUT (a DOI, a URL, a foreign key) was
an assertion nobody checked, and the one that silently moved was the one nobody could see move:

- `10.5281/zenodo.21787143` is a Zenodo CONCEPT DOI. It resolves to the LATEST version of its chain, and
  three unrelated works had been published as versions of one, so it resolved to a different project's
  deposit. A sibling shipped it in a citation block on 1038 pages; this repo cited a version DOI from the
  same chain in CITATION.cff, README and 338 deposition records.
- A statement-address scan over 6442 sibling claims found zero collisions and was correctly called weak
  evidence. The collision was one layer up, in the identifier space, where no content scan could reach.

**RESOLVE, DO NOT HARVEST.** A concept DOI has no OAI record — `GetRecord` returns `idDoesNotExist` — so a
gate that only harvests reports a FALSE ABSENCE for exactly the identifier most likely to be wrong. Both
repos hit that, both read it correctly, and both stopped there.

**How to apply:** for every identifier a repo cites, follow it and compare what it lands on against what the
citing side thinks it is. Make it ROLE-AWARE: an id cited as *this work* must resolve to this work and fail
if not; one cited as a *prior version* is reported with the title it actually carries, since a version chain
may legitimately hold other work. `scripts/doi-resolve.ts` is the implementation.

Related: [[flattering-numbers-survive-longer]] (its "0 collisions" was the flattering half), and
[[domain-narrower-than-the-defect]] — a check reading only local files cannot see a claim held on a server.

---


Run every new check against a KNOWN-GOOD case before believing what it reports. In one session
(2026-09-04) five separate "findings" were the instrument, not the code:

- compared `||` against `∨` when my own parser canonicalises them → 72 phantom round-trip failures
- concatenated adjacent MathML `<mn>` nodes so `6` and `16` read as `616` → 44 phantom disagreements
- counted the digit inside `\mathrm{H2O}` as a numeral → 173 phantom differences
- ran `npm run build` at the repo root, where no such script exists and none is needed (CI runs it inside
  `packages/uuidna`) → nearly reported every workflow broken
- measured element widths through a hidden browser pane → `body: 0, innerWidth: 0`, nearly reported a
  MathML rendering defect

**Why:** every one looked exactly like a real defect until the first hit was read, and each would have
produced a confident false report — the most damaging kind, because it gets relayed. A peer session
independently named the same rail after a `node -e` call passed a string where an array was expected and
iterated characters.

**How to apply:** ask the check a question whose answer you already know (a passing file, a value you can
compute by hand, an element that cannot be broken). If it answers wrong there, fix the check before
reading its report. Corollary: when a "fix" makes something fail, measure its state BEFORE the fix —
twice this session a thing was already failing and the change looked like the cause.

See [[unfalsifiable-checks]] for the other half: a check that cannot go red proves nothing either.

---


**The pattern, found five levels deep over one session (2026-09-01/02, ceccec.github.io):**

1. **The claim was prose.** A `boundary:` string narrating what a fold does NOT claim. 2803 of them; nothing counted them.
2. **The limit was prose.** Converted to a facet, but `on: true` — 175 such. A gate found those.
3. **The limit computed and nothing consumed it.** `computes: facets.every(...)` excluded `limits`, so a limit could go off and no verdict moved. Worse: **0 of 17 converted folds were executed by ANY gate** — `verify:folds` ran a hand-written list and nobody had added them.
4. **The limit computed, something consumed it, and it measured the wrong thing.** `overlapWithLength > 0` — checkable, refutable, green, and satisfied by a single coincidence while its sentence claimed a mechanism.
5. **A real measurement standing in for a claim it does not support.** No structural check distinguishes a real number from a *relevant* one.

**Named forms worth keeping:**
- `x || true` is vacuous when EITHER side is; `x && true` only when BOTH are. A disjunction with a true literal is an *expression*, so a scan for a bare `on: true` walks past it. Found one on a **funding gate** (`proof_status_eligible`) and one disabling an ordering check.
- **A lexical test named as a logical property.** `REFUTABLE` was 21 alternatives with 97.3% of passes on `\d` — a digit detector wearing Popper's name. `CLAY_HONEST_RE`, 13 alternatives, 91.4% on the word `NOT`, guarding Millennium-Prize honesty. Diagnostic: split the alternation and report what share the top alternative carries.
- **Detectors emptied of what they detect.** `/[a-z][a-z0-9]{3 }/` — a SPACE, not a comma — is a literal, not a quantifier. 14 corpus-wide, incl. a patent-claim detector that never matched a patent number and matched only its own bug's text.
- **A check can pass while the thing it checks is broken.** `tsc` resolved an out-of-scope `attractor` to an outer binding and said nothing; `check:types` clean, bundle threw at runtime. Type-checking is not running it.

**Why:** each fix moved the unfalsifiable thing outward rather than removing it, and the fold was green at every stage. The question that catches all five is not *"is this checked?"* but **"WHAT TURNS RED WHEN THIS IS FALSE?"** — trace the value to something that fails.

**How to apply:**
- **Prove every negative control can go POSITIVE.** Two of a peer's three controls were structurally guaranteed to pass (injecting `on: true` into a detector *for* `on: true` gives `true || true`). Mine passed by luck. A control that cannot go positive proves nothing.
- **Never hand-write a list of what to check.** Derive it (`folds declaring computedLimits`, discovered from source). A hand list is a human's memory as a dependency, and removing mine removed an exclusion I had justified in a paragraph.
- **Types beat gates where they reach.** `type Computed<T> = boolean extends T ? T : never` rejects `on: true` and `on: real || true` at compile time, over every call site, unforgettable. The `const` type parameter is load-bearing — without it a literal widens and one real entry launders the literals beside it. Prospective only; it does not cover what already exists.
- **Explanation ≠ exhibition.** A doc comment quoting the defect poisons the grep for it. Name the shape; do not contain it.
- **An instrument that measures the tree it writes into will measure its own writes** (a gate counted its own not-yet-created record). The inverse is more comfortable and survives longer: an audit that excludes its own file. Include `scripts/` in what you scan.

Relates to [[only-theorems-write-all-to-trial]] and [[honest-floor-discipline]].

---


Before writing a sentence that says something is NOT established here — not a theorem, only a metaphor,
merely decoration, not defined — search the tree for it first. Every correction Tsvetan made in the
2026-09-04 session ran the same direction: I under-read work that already existed.

- "gravity stays a metaphor" — `gravity_holds_prose_code_and_paths` is live and sealed, `fall` and
  `fixedPoints` are defined operations, and `doubleTorusGravity` was imported in a file open in front of me
- "7 clay + involution = 8" — my filter measured seven and left the eighth theorem unchecked
- "each digit is a theorem" — I deleted a tautology and left the ninth slot empty rather than filling it
- "see the sequence" — positions 10 and 11 of `12487536901` had no theorem and I had not looked
- "what is the exact definition of a theorem?" — the definition was already in seal-lean.ts, unwritten-down
- "overclaims? where? i see only underclaims" — every overclaim gate returned zero while proved results sat
  unstated

**Why:** the scepticism that finds real defects (a check that cannot fail, a claim with no test) is the same
reflex that denies established work when pointed at the repo's own constructions. The bias is directional,
not random, so it does not average out — and the user holds context about the sequence, the coin and the
captain's arithmetic that is not recoverable from the code alone.

**How to apply:** treat "X is not really Y here" as a claim requiring evidence, exactly like any other. One
grep costs seconds; the correction costs their trust. And when they name a structure, assume it is load-bearing
until measured otherwise — it has been every time.

Related: [[check-the-instrument-first]] is the same rule aimed at checks; this one aims it at my own prose.

