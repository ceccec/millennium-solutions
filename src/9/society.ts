// Live society — society is alive to the degree it PARTICIPATES, not to the degree it accepts.
// The reflection 1 ↔ 9 (ten's-complement): the one who accepts (src/1/acceptance.ts) reflects
// to the many who verify and build. A passive society takes claims on authority; a live one
// recomputes them. This is the honest form of "societal acceptance" — earned, not granted.
import { toUuid, merkleFold } from '../0/index.ts'

export function report(): string {
  const reflects = 10 - 1 // = 9: acceptance (1) reflects to society (9)

  // The participation surface — what anyone can actually do, each real and open.
  const channels = [
    'recompute — every claim renders from source on /compute',
    'verify — the version-seal folds all releases to one address',
    'extend — the vision package is open; everyone adds their vision',
    'sustain — the gift economy (life funds development), non-obligatory',
  ]
  const surfaceRoot = merkleFold(channels.map(toUuid))

  let o = 'live society — alive by participation, not by acceptance:\n\n'
  o += '  reflection 1 ↔ ' + reflects + ':  the one who ACCEPTS (digit 1) reflects to the many who VERIFY (digit 9).\n'
  o += '  passive society takes the claim on authority (acceptance = proof) — dead. see acceptance (1).\n'
  o += '  live society recomputes, verifies, contributes — the same 0/7 checked by many hands.\n\n'
  o += '  the participation surface (open to anyone):\n'
  channels.forEach(c => o += '    · ' + c + '\n')
  o += '  surface content-address: ' + surfaceRoot.slice(0, 13) + '…\n\n'
  o += '  → a live society is a commons that CHECKS and BUILDS. It stays honest because every\n'
  o += '    contribution passes the same gate (gaps → seal) and every claim recomputes.\n\n'
  o += 'HONEST: this is an open, verifiable commons — not decentralized consensus, not governance,\n'
  o += 'not a DAO, not a vote. "Live" means active verification and contribution. The society does\n'
  o += 'not change the mathematics; it checks it. entails → 0/7.'
  return o
}
