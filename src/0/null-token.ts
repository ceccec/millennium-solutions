// No token is a token — in two exact senses.
//  (1) addressing: even the EMPTY input has a deterministic content-address — absence is addressable.
//  (2) security: there is NO secret token; that absence IS the posture — no key to steal or leak.
import { toUuid } from './index.ts'

export function report(): string {
  const empty = toUuid('')     // the address of nothing
  const zero = toUuid('0')     // the genesis / v0.0.0 seed
  const stable = toUuid('') === empty

  let o = 'no token is a token:\n\n'
  o += '  (1) the void has an address — even the empty input content-addresses (deterministic):\n'
  o += '    toUuid("")  = ' + empty.slice(0, 13) + '…   → "nothing" has a definite fingerprint (stable? ' + stable + ')\n'
  o += '    toUuid("0") = ' + zero.slice(0, 13) + '…   → the genesis (the v0.0.0 seed)\n'
  o += '    absence is still addressable; the null is a token.\n\n'
  o += '  (2) the security posture — there is NO secret token, and that IS the token:\n'
  o += '    nothing to steal, nothing to leak, nothing to expire. the strongest key is no key.\n'
  o += '    an open system\'s safety is that it keeps no secret (see security.ts).\n\n'
  o += 'HONEST: both are exact — the empty string maps to one fixed UUID, and "no secret" is a real\n'
  o += '(and for an open, public deposit, correct) security model. It does NOT mean "nothing is\n'
  o += 'everything" or that emptiness holds mystical power; it means absence is deterministically\n'
  o += 'addressable, and openness draws its safety from having no secret to lose. entails → 0/7.'
  return o
}
