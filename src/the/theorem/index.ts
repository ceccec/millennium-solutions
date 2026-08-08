// the theorem — computable is not solved.
import { toUuid } from '../../0/index.ts'
export function report(): string {
  let o = 'the theorem — computable is not solved:\n\n'
  o += '  the deposit computes a growing ledger of decidable facts, each re-verified every build.\n'
  o += '  none is a Clay Millennium result: the six open conjectures stay open; Poincaré is settled\n'
  o += '  externally (Perelman). humanity 1/7; this deposit 0/7.\n'
  o += '  the one theorem: computable is not solved — the calculator reaches the decidable, never the open.\n'
  o += '  address: ' + toUuid('the-theorem:computable-is-not-solved').slice(0, 13) + '… entails → 0/7.'
  return o
}
