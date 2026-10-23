// THE ANSWER RULES AS COMPILE-TIME CHECKS — checked by the project's own type check (npm run typecheck), with no runtime.
// Each accepted answer must compile. Each refused answer is preceded by @ts-expect-error: the compiler must reject the
// answer on the next line, and if it stops rejecting it, the directive itself becomes an error. The statements are the
// same ones the former runtime test compiled one at a time with tsc on temporary files.
import type { Answer } from './types.ts'

// accepted: TRUE with a Lean proof
export const acceptedLeanProof: Answer = { value: 'TRUE', question: 'q', checkedBy: 'lean_ask', certificate: { type: 'C1', leanFile: 'x.lean', axioms: 'kernel-only' } }

// accepted: TRUE with a witness
export const acceptedWitness: Answer = { value: 'TRUE', question: 'q', checkedBy: 'task_route', certificate: { type: 'C2', witness: { compositeBase: '2' } } }

// accepted: FALSE with a witness
export const acceptedFalseWitness: Answer = { value: 'FALSE', question: 'q', checkedBy: 'task_route', certificate: { type: 'C2', witness: { factor: '7', cofactor: '13' } } }

// accepted: SOURCED with a DOI
export const acceptedDoi: Answer = { value: 'SOURCED', question: 'q', checkedBy: 'doi-precedence-test', certificate: { type: 'C3', doi: '10.5281/zenodo.21819217', record: 'record' } }

// accepted: UNKNOWN with its blocking step
export const acceptedUnknown: Answer = { value: 'UNKNOWN', question: 'q', checkedBy: 'clay-conditions-test', blockingStep: 'the statement is open' }

// refused: TRUE with no certificate
// @ts-expect-error the rule does not hold for this answer
export const refusedTrueNoCertificate: Answer = { value: 'TRUE', question: 'q', checkedBy: 'x' }

// refused: TRUE with a DOI (C3, evidence only)
// @ts-expect-error the rule does not hold for this answer
export const refusedTrueDoi: Answer = { value: 'TRUE', question: 'q', checkedBy: 'x', certificate: { type: 'C3', doi: 'd', record: 'r' } }

// refused: TRUE with a probable-prime (no certificate type)
// @ts-expect-error the rule does not hold for this answer
export const refusedTrueProbable: Answer = { value: 'TRUE', question: 'q', checkedBy: 'x', certificate: { type: 'C4' } }

// refused: FALSE with a DOI
// @ts-expect-error the rule does not hold for this answer
export const refusedFalseDoi: Answer = { value: 'FALSE', question: 'q', checkedBy: 'x', certificate: { type: 'C3', doi: 'd', record: 'r' } }

// refused: SOURCED with a Lean proof (not a DOI)
// @ts-expect-error the rule does not hold for this answer
export const refusedSourcedLean: Answer = { value: 'SOURCED', question: 'q', checkedBy: 'x', certificate: { type: 'C1', leanFile: 'x.lean', axioms: 'kernel-only' } }

// refused: UNKNOWN with no blocking step
// @ts-expect-error the rule does not hold for this answer
export const refusedUnknownNoBlocking: Answer = { value: 'UNKNOWN', question: 'q', checkedBy: 'x' }
