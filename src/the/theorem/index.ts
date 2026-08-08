// the theorem — computable is not solved. Saves itself computationally: its root is the fold of the
// core theorem keys, recomputed on every render, not a hand-typed address.
import { toUuid, merkleFold } from '../../0/index.ts'
export function report(): string {
  const CORE = ['vortex_covers_units', 'euler_units_pow6', 'merkle_order_independent', 'one_game_all', 'relation_golden', 'tarot_encoding_total']
  const root = merkleFold(CORE.map((k) => toUuid(k)))
  let o = 'the theorem — computable is not solved:\n\n'
  o += '  the deposit computes a growing ledger of decidable facts, each re-verified every build.\n'
  o += '  none is a Clay Millennium result: the six open conjectures stay open; Poincaré is settled\n'
  o += '  externally (Perelman). humanity 1/7; this deposit 0/7.\n'
  o += '  the one theorem: computable is not solved — the calculator reaches the decidable, never the open.\n'
  o += '  computed root (fold of ' + CORE.length + ' core theorem keys): ' + root.slice(0, 13) + '… entails → 0/7.'
  return o
}
