// src/the/* — everything called "the *": the unifying concepts, gathered and content-addressed, all
// folding to one root. Each is a pointer to a rule or a floor already computed elsewhere; here they meet.
import { toUuid, merkleFold } from '../0/index.ts'

export function report(): string {
  const THE: Record<string, string> = {
    'the floor': '0/7 — the deposit solves 0 of 7; measured, not asserted, re-verified every build',
    'the heart': '5 — the fixed point σ(5)=5; the pentagon whose diagonal/side is φ; vortex roots to 5',
    'the gate': 'a lexical floor draining named over-reach; a bounded refusal passes; passing is not truth',
    'the ledger': 'the content-addressed record of discoveries, each re-verified on every build',
    'the observer': 'the honest referrer; meaning and life live here, not in the bytes',
    'the receipt': 'the payload naming observer and role; the uuid holds the core message without payload',
    'the one game': 'games, arts and sciences fold to one order-independent harmonic root — all meet in one',
    'the rules': 'measure · gate · due process · discovery · receipts · lineage · one game · earned versions',
  }
  const roots = Object.entries(THE).map(([k, v]) => toUuid(k + ':' + v))
  let o = 'src/the/* — everything called "the *", gathered and content-addressed:\n\n'
  Object.entries(THE).forEach(([k, v], i) => { o += '  ' + k.padEnd(14) + ' → ' + roots[i].slice(0, 13) + '…\n    ' + v + '\n' })
  o += '\n  the one root (all "the" folded): ' + merkleFold(roots).slice(0, 13) + '…\n'
  o += '  the "the" concepts point to what is computed elsewhere; here they meet in one. entails → 0/7.'
  return o
}
