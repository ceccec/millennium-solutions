# Answer system: TRUE, FALSE, or UNKNOWN, each with a certificate

## Purpose

Answer a question with one of three values, and attach to every TRUE or FALSE a certificate that a reader can
check without trusting the system:

- **TRUE**: a certificate that the statement holds.
- **FALSE**: a certificate that it does not (a counterexample, or a refutation).
- **UNKNOWN**: no certificate was found. The answer names the blocking step.

This is the intended meaning of the system. It does not claim that every question has a computable answer.
Undecidable questions exist (the halting problem), and open problems such as the Clay problems have no
certificate in this repository, so they answer UNKNOWN.

## Answer rules (no exceptions)

1. TRUE requires a certificate of type C1 or C2 (below). Nothing else produces TRUE.
2. FALSE requires a counterexample certificate: a witness that the statement fails, checked by the same kernel.
3. A probable result is never TRUE or FALSE. It is UNKNOWN, with the probability named.
4. A cited source is evidence, not a certificate. A sourced answer is reported as SOURCED, never as TRUE.
5. A question that cannot be formalised is UNKNOWN, with the reason "not formalised".
6. A refusal of any step is UNKNOWN with that step named.

## Certificate types

| Type | What it is | Checked by | Yields |
|---|---|---|---|
| C1 | A Lean proof of the statement, no `sorry`, no axioms beyond the kernel's | `lean_ask` (compile, `#print axioms`, sorry check) | TRUE |
| C2 | An arithmetic witness: a factor with an exact product check, or a Miller–Rabin base proving compositeness | `task_route` (exact integer arithmetic) | TRUE or FALSE |
| C3 | A cited source: a DOI that resolves to the canonical record, or an arXiv identifier whose abstract page resolves to the stated title | `answer-verify-doi` (DOI); `answer-verify-arxiv` (arXiv, through web_fetch) | SOURCED |
| C4 | A probable-prime result, or a text question | none | UNKNOWN |

C2 applies only where the check is exact: a found factor passes `p × q = n`, and a composite is proved by a base
whose failure is an exact congruence. A probable prime is C4, not C2.

## Routing

1. Integer (decimal or hexadecimal): `task_route`. Composite or small prime → C2. Probable prime → UNKNOWN.
2. Lean statement (a theorem with `:= by decide` or a tactic proof): `lean_ask`. Conjunctions are split by
   `lean_split`, and the whole holds only if every part does (C1 per part).
3. Text question: formalise it as a Lean statement first. If it cannot be formalised, UNKNOWN.
4. Claim about a publication: `doi-precedence-test`. Resolves to SOURCED, never TRUE.
5. Clay problems: UNKNOWN, with the reason that the statement is open. The Clay conditions are checked by
   `clay-conditions-test` and reported as NOT MET until the evidence exists.

## Output shape

Every answer is JSON with these fields: `question`, `value` (TRUE, FALSE, SOURCED, or UNKNOWN), `certificate`
(type, and the artefact a reader can check: a Lean file, a witness, or a DOI), `reason`, and `checkedBy` (the tool
and the date). An UNKNOWN answer has `blockingStep` instead of `certificate`.

## Todo list

Each item is done only when its acceptance test passes. An item that is not done stays `[ ]`.

- [x] T1 Types. `src/answer/types.ts` defines the answer, certificate, and value types above.
  Acceptance: a type error on an answer that has TRUE without a C1 or C2 certificate. Evidence: `scripts/answer-types-test.ts`, run through the MCP as suite `answer-types`: 11 of 11 cases.
- [x] T2 Router. `src/answer/route.ts` classifies a question as integer, Lean, text, publication claim, or Clay.
  Acceptance: a fixed table of inputs, each classified as stated in the Routing section. Evidence: the priority is decided in `src/proof/answer_route.lean` (exhaustive over the 16 feature combinations). The text reading stays in `src/answer/route.ts` and is not a finite domain.
- [x] T3 C1 verifier. Wraps `lean_ask`; returns TRUE only when compiles, no sorry, and no axioms. Evidence: the decision is in `src/proof/arith.lean` and `src/proof/answer.lean`. Every verdict of the arithmetic verifier is checked by the kernel in the answer path.
  Acceptance: the true test theorem returns TRUE, a false one returns UNKNOWN, a sorry one returns UNKNOWN.
- [x] T4 C2 verifier. Wraps `task_route`; returns TRUE or FALSE only from an exact witness. Evidence: `scripts/answer-arith-test.ts`, run through the MCP as suite `answer-arith`: 3 of 3 cases.
  Acceptance: 91 is FALSE with factor 7; 97 is TRUE; the probable prime input returns UNKNOWN.
- [x] T5 C3 verifier. Wraps `doi-precedence-test`; returns SOURCED only when the DOI resolves to the canonical record. Evidence: `scripts/answer-doi-test.ts`, run through the MCP as suite `answer-doi`: the canonical DOI is SOURCED, the other record is UNKNOWN.
  Acceptance: the canonical DOI returns SOURCED; a non-canonical DOI returns UNKNOWN.
- [x] T6 `answer` MCP tool. Routes through T2 to T3, T4, or T5, and returns the output shape above. Evidence: suite `answer-tool` through the MCP: an integer, a Lean theorem, the canonical DOI, a Clay problem, and a text question, each answered as the rules require.
  Acceptance: an e2e test calls it through the MCP for one input of each route.
- [x] T7 No-certificate gate. A test that fails if any answer carries TRUE or FALSE without a certificate. Evidence: `src/proof/answer_gate.lean` decides the rules, and `scripts/answer-gate.ts` asks the kernel for each stored answer; suite `answer-gate` refuses five planted violations and accepts a compliant set; real answers from the `answer` tool pass (4 of 4 after the output shape was fixed to name `checkedBy` and `blockingStep`).
  Acceptance: a planted answer with TRUE and no certificate is refused.
- [ ] T8 Clay questions. Each of the six open problems answers UNKNOWN, with its blocking step recorded.
  Acceptance: six UNKNOWN answers, one per problem, each naming its formal status.

## Current state (checked, not assumed)

- T3 and T4 exist as tools (`lean_ask`, `task_route`), but no `answer` tool joins them yet.
- T5 exists as a test (`doi-precedence-test`), and its current run shows 1 of 4 DOIs resolving to the canonical record.
- T6 to T8 do not exist.

## Limits

- The system can only certify what it can formalise. Most open questions cannot be formalised in this repository.
- A certificate is checked by this repository's tools. A reader who wants independence should re-run the checks
  with their own toolchain.
