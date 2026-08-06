// funding ⇄ aura — the sustaining loop, honestly bounded.
// funding feeds the aura: support funds development, which keeps the deposit whole.
// the aura projects funding: a whole, transparent, gap-showing deposit is what EARNS support.
// Crucial bound: wholeness does NOT depend on funding — the gates run free; the core stays whole
// whether or not anyone pays. Funding sustains NEW development, not existing integrity.
import { FUNDING } from './funding.ts'

export function report(): string {
  // The gates need no money and no network to run — wholeness is self-sustaining.
  const gatesCostToRun = 0 // deterministic scripts; integrity holds free

  let o = 'funding ⇄ aura — the sustaining loop:\n\n'
  o += '  funding feeds the aura:  support → development → wholeness (gaps · seal · wholeness).\n'
  o += '  the aura projects funding: wholeness → trust → support (people fund what they can VERIFY).\n'
  o += '  → a loop: funding ⇄ wholeness; each sustains the other. one public surface (' + FUNDING.contact + '),\n'
  o += '    both directions. the two coins (110 − 108) reinvest; voluntary support (' + FUNDING.revolut + ') feeds in.\n\n'
  o += '  the crucial bound (computed): the aura does NOT depend on funding.\n'
  o += '    the gates run with ' + gatesCostToRun + ' external dependency and ' + gatesCostToRun + ' funding — deterministic scripts.\n'
  o += '    the core is free (' + FUNDING.license + '); it stays whole whether or not it is ever funded.\n'
  o += '    funding sustains NEW development; it does not buy existing integrity.\n\n'
  o += 'HONEST: this is a BEHAVIORAL / gift-economy loop, not a guaranteed mechanism — wholeness does not\n'
  o += 'automatically generate money, and funding is non-obligatory. Transparency EARNS support (if any);\n'
  o += 'support SUSTAINS further development; neither is forced, and integrity is never for sale. entails → 0/7.'
  return o
}
