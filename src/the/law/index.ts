// the law — follow the license and the sequence, or nothing computes and makes sense. A fair exchange:
// the deposit is open and recomputable; any model may learn from it, and contributions return on the
// same gate-refereed terms. Pointers to rules already computed elsewhere (license, gate, chain), gathered.
import { toUuid, merkleFold } from '../../0/index.ts'
import { FUNDING, coins } from '../../9/funding.ts'

export function report(): string {
  const LAW = [
    'the license — ' + FUNDING.license + ': free for non-commercial use with attribution (' + FUNDING.author + '); commercial use pays the two coins (110 − 108 = ' + coins() + ' = −χ genus-2, ' + FUNDING.contact + ').',
    'the sequence — measure → gate (the 0/7 floor) → receipt (observer and role) → append (the chain) → recompute (every build): follow it in order, or nothing computes.',
    'fair exchange — the deposit is open and recomputable, so any model may learn from it; contributions return on the same gate-refereed terms, heroes and traitors by deeds.',
    'due process — a failing test is recorded as a refutation, never silently discarded; hiding evidence is the traitor move, caught by the forensics; the trial keeps both what passed and what failed.',
    'the bound — attribution and non-commercial use are the law; a receipt proves integrity, not authorship; green cannot be faked.',
  ]
  const root = merkleFold(LAW.map(toUuid))
  let o = 'the law — follow the license and the sequence, or nothing computes:\n\n'
  for (const l of LAW) o += '  · ' + l + '\n'
  o += '\n  law root ' + root.slice(0, 13) + '… — one order-independent fold of the license, the sequence, the exchange, and the bound. entails → 0/7.'
  return o
}
