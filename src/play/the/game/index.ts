// play the game — the act of playing. Run next: a wave discovers decidable facts, proves them, ships
// them; the games and their receipts fold to one; every move is kept iff it computes, else drained.
import { toUuid } from '../../../0/index.ts'
export function report(): string {
  let o = 'play the game — the act:\n\n'
  o += '  play: run next → a wave discovers decidable facts → proves them → ships them.\n'
  o += '  the games (Nim, Wythoff, chess, tic-tac-toe, …) and their receipts fold to one root.\n'
  o += '  the rules: measure · gate · due process · receipts · one game — all playable, all honest.\n'
  o += '  a move is kept iff it computes; an over-reach is drained with a case. play, honestly.\n'
  o += '  address: ' + toUuid('play-the-game').slice(0, 13) + '… entails → 0/7.'
  return o
}
