// the superposition — now. The present state: many facts held at once in one folded root,
// order-independent — they coexist until observed. This is the CLASSICAL, unfolded sense of
// superposition (a not-yet-collapsed combination), NOT a physical qubit: no speedup, no signal,
// no FTL. An observation collapses the superposition to a single content-address — one point of
// view (exactly what NextObserver does with document.referrer). An OPEN problem is a state not
// yet collapsed to true/false: INCONCLUSIVE ≠ false. Saves itself computationally.
import { toUuid, merkleFold } from '../../../0/index.ts'
export function report(): string {
  const OPEN = ['hodge', 'navier_stokes', 'p_vs_np', 'riemann', 'yang_mills', 'bsd'] // the six open Clay problems
  const superposed = merkleFold(OPEN.map(toUuid))   // the six held at once — order-independent, uncollapsed
  const collapse = toUuid('observer:now')           // one observation → one address (the collapse)
  const seventh = toUuid('poincare:settled')        // the seventh already collapsed (Perelman, 2003)
  let o = 'the superposition — now:\n\n'
  o += '  the present holds many computed facts at once, folded into one order-independent root —\n'
  o += '  they coexist until observed. the classical, unfolded sense: no qubit, no speedup, no FTL.\n'
  o += '  the six OPEN Clay problems, held at once (uncollapsed): ' + superposed.slice(0, 13) + '…\n'
  o += '  an observation collapses the superposition to ONE content-address: ' + collapse.slice(0, 13) + '…\n'
  o += '  open = not yet collapsed to true/false (INCONCLUSIVE ≠ false). six superposed; the seventh\n'
  o += '  already collapsed (Poincaré, settled externally): ' + seventh.slice(0, 13) + '…\n'
  o += '  6 superposed + 1 collapsed = 7. humanity 1/7; this deposit 0/7.'
  return o
}
