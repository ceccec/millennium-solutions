# Application — NLnet Foundation — NGI Zero Commons Fund

**Applicant.** Tsvetan Rouschev, independent researcher. Independent research. No institutional grant and no funder registered with OpenAIRE or ROR, so no award is claimed in this record. Development is supported by direct contribution: https://revolut.me/ceccec

**The work.** A machine-checked deposit: 1148 theorems accepted by the Lean 4 kernel, sorry-free with no Mathlib dependency — 961 closing by exhaustion over a finite domain with no axiom, 187 proved for every value on the standard axioms propext and Quot.sound. Concept DOI [10.5281/zenodo.21819217](https://doi.org/10.5281/zenodo.21819217). Source: https://github.com/ceccec/millennium-solutions. Pages: https://ceccec.psg.bg/millennium-solutions.

**What is not asserted.** No quantum speedup. The verification advantage is classical and structural: 20 rounds against 1048576 recomputations, a ratio of 567971×, proved in speed.lean.

**Why it is fundable.** Every claim on every page recomputes from source, and the build fails when prose and
proof tree disagree. The reusable parts are the verifier, the Lean→LaTeX/MathML layer with round-trip
checking, the per-theorem deposition pipeline, and an axiom index checked against a negative control.

**Requirements met**, each decided rather than asserted:

- free and open source, publicly available — the whole tree is public under CC BY-NC-ND 4.0 with the reference implementation on npm
- a concrete technical deliverable, not a research promise — 1148 kernel-accepted theorems (961 closing by exhaustion, 187 proved for every value), plus a working verifier, an MCP server and a published package — all recomputable from source
- grant size 5,000–50,000 EUR fits the work proposed — the deliverables are tooling-scale: the verifier, the deposition pipeline and the axiom index
- the deadline has not passed — today is 2026-09-25; the call closes 2026-11-03

**Window.** call opened 2026-09-03, deadline 2026-11-03. Generated 2026-09-25.
