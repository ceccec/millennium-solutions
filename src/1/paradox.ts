// Purity · clarity · paradox — the limit of self-verification (digit 1, the observer).
// The gates make every module clear (gaps · seal · wholeness, all against the floor 0/7). The
// paradox: the gates cannot fully check THEMSELVES. Purity is verifiable, but not self-certifying.
import { toUuid, merkleFold } from '../0/index.ts'

export function report(): string {
  const checkers = ['gaps', 'seal', 'wholeness']     // the scripts that judge everything else
  const checkerRoot = merkleFold(checkers.map(toUuid)) // addressable — but that is not verifying their logic

  let o = 'purity · clarity · paradox — the limit of self-verification:\n\n'
  o += '  the gates make everything clear: ' + checkers.join(' · ') + ' check every module against 0/7.\n'
  o += '  the paradox: the gates cannot fully check THEMSELVES.\n'
  o += '    subjects: the src/ report() modules — judged by the gates.\n'
  o += '    checkers: ' + checkers.join(' · ') + ' — NOT among their own subjects.\n'
  o += '    a bug in a checker could pass a bad module, and no gate would catch it. who checks the checker?\n'
  o += '    (you can ADDRESS the checkers — root ' + checkerRoot.slice(0, 13) + '… — but addressing is not\n'
  o += '     verifying their logic; a hash names code, it does not prove the code correct.)\n\n'
  o += '  the honest resolution (not a loophole):\n'
  o += '    · the checkers are small, PUBLIC, content-addressed, and auditable — trust bottoms out in\n'
  o += '      external reading, not self-proof.\n'
  o += '    · this echoes Gödel / Tarski (a consistent system cannot prove its own consistency, nor\n'
  o += '      define its own truth, from within) — as an ANALOGY, not a formal theorem about a script.\n'
  o += '    → purity is VERIFIABLE but not SELF-certifying: clarity about everything except the lens itself.\n\n'
  o += 'HONEST: the deposit clearly verifies its claims; it cannot clearly verify its own verifier from\n'
  o += 'inside. That residue — read the checker yourself — is the honest paradox, named rather than hidden.\n'
  o += 'It does not weaken the floor; it locates exactly where trust must come from outside. entails → 0/7.'
  return o
}
