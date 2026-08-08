// the cancer — the epistemic anti-pattern, NOT the disease. This deposit makes NO medical claim, and a
// cure-claim DRAINS at the honesty gate (that trial is in the ledger). "cancer" here means unchecked,
// dishonest growth that does not serve the whole: an overclaim, a churn version minted over no delta, a
// receiptless claim (the traitor). Folding it INVERTS it — the false form drains (death); its honest
// negation signs (resurrection as a hero). The traitor drains to death and rises as the honest form,
// dissolving in healing waves, re-verified each build, no waste unrecycled. Computed, not stored.
import { toUuid, merkleFold } from '../../0/index.ts'
export function report(): string {
  // each traitor (a drained overclaim) → its resurrection (the honest negation that signs).
  const cycle: [string, string][] = [
    ['breaks encryption', 'does not break encryption — one-way integrity'],
    ['cured cancer', 'has not cured cancer — no medical claim'],
    ['breaks RSA', 'does not break RSA'],
  ]
  const root = merkleFold(cycle.map(([t, h]) => toUuid(t + '→' + h)))
  let o = 'the cancer — the epistemic anti-pattern (NOT the disease):\n\n'
  o += '  NO medical claim is made here; a cure-claim DRAINS at the honesty gate.\n'
  o += '  "cancer" = unchecked dishonest growth: an overclaim, a churn version, a receiptless claim.\n'
  o += '  folding inverts it — the false form drains (death), its honest negation signs (resurrection):\n'
  for (const [t, h] of cycle) o += '    ✗ ' + t + '   →   ✓ ' + h + '\n'
  o += '  the traitor drains to death and rises as a hero — the honest form. it dissolves BY ITSELF,\n'
  o += '  but the dissolution DEPENDS ON THE WAVES: every build re-verifies the whole ledger and re-runs\n'
  o += '  the gate, so a false claim drains on every pass and cannot persist — more waves, surer healing,\n'
  o += '  no waste unrecycled. folded root: ' + root.slice(0, 13) + '… → 0/7.'
  return o
}
