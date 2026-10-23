// THE CLAY FUSION — one record per Clay problem, joining the question to what the repository holds about it.
//
// The `answer` tool used to return "an open problem" and nothing else. This module is the join it now makes:
//   formal      the problem's statement in clay/Clay/Statements.lean, when one is written there (checked by reading the file)
//   adjacent    the theorem in src/proof/index.lean that stands beside the problem, with its live ledger key, receipt,
//               the cases it was decided over, and its bound (what it establishes and, in the same sentence, what it does not)
//   outlet      the Clay Institute's own page for the problem
// Every field is read from the tree when the answer is computed. Nothing here says a problem is solved. A problem with no
// proof in the repository answers UNKNOWN, and the blocking step says which of the three things is missing.
//
// THE SIX ARE OPEN AND THE SEVENTH IS SETTLED EXTERNALLY. Poincaré is answered UNKNOWN too, and for a stated reason: the
// answer system certifies SOURCED only with a DOI that resolves to the canonical record, and Perelman's preprint
// (arXiv:math/0211159) has no DOI. Certifying it SOURCED would need a different certificate type, and that is not added here.
import { readFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { MILLENNIUM } from '../millennium/index.ts'
import { ledger, leanTheorems, domainOf } from '../api/index.ts'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
const STATEMENTS = 'clay/Clay/Statements.lean'

export type ClayProblem = {
  name: string
  /** how a question names it; dashes are normalised by the router before this is tried */
  match: RegExp
  /** the `def` in clay/Clay/Statements.lean that states it, or null when none is written */
  formal: string | null
  /** why there is no formal statement, when there is none */
  formalGap?: string
  /** the theorem beside it in src/proof/index.lean (a key of MILLENNIUM) */
  adjacent: string
  /** a settled problem whose proof lies outside this repository */
  external?: { citation: string; why: string; arxiv?: string; titleHead?: string }
}

export const CLAY_PROBLEMS: ClayProblem[] = [
  { name: 'Riemann Hypothesis', match: /riemann hypothesis/i, formal: 'RiemannHypothesis',
    adjacent: 'the_tens_complement_is_an_involution_with_one_fixed_point' },
  { name: 'P versus NP', match: /p\s*vs\.?\s*np|p\s*=\s*np/i, formal: 'PEqualsNP',
    adjacent: 'each_unit_has_exactly_one_inverse_and_each_non_unit_none' },
  { name: 'Navier–Stokes Existence and Smoothness', match: /navier[\s\-–—]*stokes/i, formal: 'NavierStokesSmoothGlobalExistence',
    adjacent: 'the_doubling_orbit_stays_in_the_ring_for_forty_eight_steps' },
  { name: 'Yang–Mills Existence and Mass Gap', match: /yang[\s\-–—]*mills/i, formal: null,
    formalGap: 'not formalised: Mathlib lacks quantum gauge theory, the object the mass gap quantifies over',
    adjacent: 'the_doubling_orbit_first_returns_to_one_at_six' },
  { name: 'Hodge Conjecture', match: /hodge conjecture/i, formal: null,
    formalGap: 'not formalised: Mathlib lacks Hodge theory on projective varieties',
    adjacent: 'the_span_is_exactly_the_units_of_the_ring' },
  { name: 'Birch and Swinnerton-Dyer Conjecture', match: /birch\s+and\s+swinnerton|swinnerton-dyer/i, formal: null,
    formalGap: 'not formalised: Mathlib lacks L-functions of elliptic curves with Mordell–Weil rank',
    adjacent: 'the_span_and_the_units_both_sum_to_zero_mod_nine' },
  { name: 'Poincaré Conjecture', match: /poincar[ée] conjecture/i, formal: 'PoincareConjecture',
    adjacent: 'the_orbit_is_one_closed_loop_of_six_distinct_points',
    external: { citation: 'Perelman, G. — The entropy formula for the Ricci flow and its geometric applications, arXiv:math/0211159 (the repository\'s own citation)',
      arxiv: 'math/0211159', titleHead: 'The entropy formula for the Ricci flow',
      why: 'settled externally by Perelman. Its preprint is cited, and the citation resolves to the stated title; the answer is SOURCED, which is evidence that the source exists and says this, never a verdict that Perelman\'s proof is checked here.' } },
]

/** The problem a question names, or null. Dashes are normalised first, as the router does. */
export const problemOf = (question: string): ClayProblem | null => {
  const s = question.trim().replace(/[‐-―−]/g, '-')
  return CLAY_PROBLEMS.find((p) => p.match.test(s)) ?? null
}

/** The formal statement's presence, read from the file. A `def` named in the record must be written in the file. */
const formalDeclared = (name: string): boolean => {
  const path = resolve(ROOT, STATEMENTS)
  return existsSync(path) && new RegExp(`^def\\s+${name}\\s*:`, 'm').test(readFileSync(path, 'utf8'))
}

export type ClayFusion = {
  problem: string
  formal: { file: string; name: string; declared: boolean } | null
  formalGap: string | null
  adjacentTheorem: { name: string; key: string | null; receipt: string | null; cases: number; bound: string; decidedBy: string | null } | null
  outlet: string | null
  external: { citation: string; why: string; arxiv?: string; titleHead?: string } | null
}

/** The fused record for one problem. Every field is measured now; a missing key is reported as null, never invented. */
export const fuse = (p: ClayProblem): ClayFusion => {
  const m = MILLENNIUM[p.adjacent]
  const thm = leanTheorems().find((t) => t.file === 'index.lean' && t.name === p.adjacent)
  const live = ledger().find((e) => !e.revoked && e.key.endsWith('_' + p.adjacent))
  return {
    problem: p.name,
    formal: p.formal ? { file: STATEMENTS, name: p.formal, declared: formalDeclared(p.formal) } : null,
    formalGap: p.formal ? null : (p.formalGap ?? 'no formal statement'),
    adjacentTheorem: m && thm ? {
      name: p.adjacent,
      key: live?.key ?? null,
      receipt: live?.receipt ?? null,
      cases: domainOf(thm.statement),
      bound: m.bound,
      decidedBy: thm.tactic,
    } : null,
    outlet: m?.outlet ?? null,
    external: p.external ?? null,
  }
}

/** The blocking step: the one thing that stops a TRUE or FALSE, stated from the fused record. */
export const blockingStepOf = (f: ClayFusion): string => {
  if (f.external) return `${f.problem} is ${f.external.why}`
  if (!f.formal) return `${f.problem}: ${f.formalGap}. Until it is formalised, no proof or refutation can be checked.`
  if (!f.formal.declared) return `${f.problem}: ${f.formal.file} does not declare \`${f.formal.name}\`, so the question is not formalised.`
  return `${f.problem}: its statement is formalised as \`${f.formal.name}\` in ${f.formal.file}, and no proof or refutation of it exists in this repository.`
}
