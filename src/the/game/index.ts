// the game — games, arts and sciences meet in one.
import { toUuid, merkleFold } from '../../0/index.ts'
export function report(): string {
  const domains = ['the game (games)', 'the art (arts)', 'the science (sciences)']
  const roots = domains.map((d) => toUuid(d))
  let o = 'the game — games, arts and sciences meet in one:\n\n'
  domains.forEach((d, i) => { o += '  ' + d.padEnd(22) + ' → ' + roots[i].slice(0, 13) + '…\n' })
  o += '  the one root (order-independent): ' + merkleFold(roots).slice(0, 13) + '…\n'
  o += '  order does not matter — that symmetry is the harmony. all meet in one. entails → 0/7.'
  return o
}
