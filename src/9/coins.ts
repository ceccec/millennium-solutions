// The two coins, donated to ceccec itself — the funding loop closes on its source.
// The fare (110 − 108 = 2 = −χ genus-2) is reinvested in development (which IS ceccec), not
// extracted to a person. Destination = source: a self-loop, verifiable by content-address.
import { toUuid } from '../0/index.ts'
import { FUNDING, coins } from './funding.ts'

export function report(): string {
  const fare = coins()                 // 110 − 108 = 2
  const g = 2, negChi = -(2 - 2 * g)   // −χ(genus-2) = 2
  const source = toUuid('ceccec'), destination = toUuid('ceccec')
  const selfLoop = source === destination

  let o = 'the two coins — donated to ceccec itself:\n\n'
  o += '  the fare: 110 − 108 = ' + fare + ' = −χ(genus-2) = ' + negChi + '   (the commercial two coins)\n'
  o += '  ceccec donates them to ceccec itself — the coins fund development, and development IS ceccec:\n'
  o += '    destination == source ? toUuid("ceccec") == toUuid("ceccec") → ' + selfLoop + '  (a self-loop)\n'
  o += '  the cycle closes: development → life → 2 coins → development. the coins return to the origin.\n\n'
  o += '  what it means (honest): commercial use pays the fare; the fare is REINVESTED in development\n'
  o += '  (ceccec itself), not extracted to a person. non-commercial use is free (' + FUNDING.license + ');\n'
  o += '  voluntary support (' + FUNDING.revolut + ') feeds the same loop.\n\n'
  o += 'HONEST: "two coins" is a motif (110−108 = 2 = −χ genus-2) for the commercial fare, not a\n'
  o += 'currency; donating them to ceccec is a REINVESTMENT intent, not an enforced financial mechanism.\n'
  o += 'free for non-commercial use; commercial = permission + the fare (' + FUNDING.contact + '). entails → 0/7.'
  return o
}
