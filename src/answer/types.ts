// THE ANSWER TYPES — TRUE, FALSE, SOURCED, or UNKNOWN, and what each one must carry.
//
// A TRUE or FALSE answer is a value the type system accepts only with a certificate of the kind that can prove it:
// C1 (a Lean proof the kernel checks) or C2 (an exact arithmetic witness). A SOURCED answer needs a C3 (a DOI that resolves
// to the canonical record) and is never TRUE. An UNKNOWN answer needs the blocking step, and no certificate.
// docs/ANSWER-SYSTEM.md states the rules; this file makes the rules checkable by the compiler.

/** C1: a Lean proof checked by the kernel, with no sorry and no axiom beyond the kernel's own. */
export type C1 = { type: 'C1'; leanFile: string; axioms: 'kernel-only' }
/** C2: an exact arithmetic witness: a factor with its product check, or a base proving compositeness. */
export type C2 = { type: 'C2'; witness: { factor: string; cofactor: string } | { compositeBase: string } }
/** C3: a cited source. Evidence, not proof. */
export type C3 = { type: 'C3'; doi: string; record: string } | { type: 'C3'; arxiv: string; record: string }

/** The certificates that can prove a statement or its negation. */
export type ProofCertificate = C1 | C2

interface Checked {
  question: string
  /** The tool and date that produced this answer, so a reader can re-run it. */
  checkedBy: string
}

export type TrueAnswer = Checked & { value: 'TRUE'; certificate: ProofCertificate }
export type FalseAnswer = Checked & { value: 'FALSE'; certificate: ProofCertificate }
export type SourcedAnswer = Checked & { value: 'SOURCED'; certificate: C3 }
export type UnknownAnswer = Checked & { value: 'UNKNOWN'; blockingStep: string }

export type Answer = TrueAnswer | FalseAnswer | SourcedAnswer | UnknownAnswer
