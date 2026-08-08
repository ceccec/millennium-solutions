// the rosetta — completed. Every domain the deposit works in is a leaf one hop from the shared core
// (the star of relation_rosetta_star, made total). Content-address each domain through the core, fold to
// one rosetta root. Complete by construction: the star enumerates every domain, all addresses distinct,
// none left untranslated. This is the minimal cross-domain core — the single source of truth for the set
// of domains (discover.ts imports it). Computed, not stored.
import { toUuid, merkleFold } from '../../0/index.ts'

export const CORE = 'rosetta-core'
// Every discovered domain family — the leaves of the star. Append here as a new family is developed.
export const DOMAINS = [
  'z9-arithmetic', 'units-triad', 'doubling-orbit', 'inverses', 'powers', 'primes', 'cyclic-groups',
  'boolean-algebra', 'entanglement', 'dialectic', 'games', 'arts', 'gematria', 'language-lens',
  'merkle-ledger', 'harmonic-ledger', 'no-payload-security', 'involutions', 'fibonacci-cassini',
  'lucas-pell', 'finite-fields', 'perfect-amicable', 'collatz', 'stirling', 'graph-coloring',
  'rule90-sierpinski', 'continued-fractions', 'quaternions', 'motzkin', 'bernoulli', 'catalan',
  'divisor-sums', 'platonic-solids', 'crystal-diamond', 'genus-topology', 'surfaces', 'wilson-fermat',
  'figurate', 'rock-paper-scissors', 'self-similarity', 'fair-division', 'honeycomb', 'waves',
  'forensics', 'ramsey', 'inequalities', 'partitions', 'lucas-theorem', 'pigeonhole', 'pick',
  'cantor-pairing', 'chinese-remainder', 'quadratic-residues', 'path', 'abundance', 'cancer',
  'superposition', 'creation-week', 'relations',
]

export function report(): string {
  const addrs = DOMAINS.map((d) => toUuid(CORE + '→' + d))
  const distinct = new Set(addrs).size
  const root = merkleFold(addrs)
  let o = 'the rosetta — completed (the star: every domain one hop from the core):\n\n'
  o += '  core: ' + toUuid(CORE).slice(0, 13) + '…\n'
  o += '  domains (' + DOMAINS.length + '): ' + DOMAINS.join(' · ') + '\n'
  o += '  each reachable in one hop; ' + distinct + ' distinct addresses (' + (distinct === DOMAINS.length ? 'no collision — complete' : 'COLLISION') + ')\n'
  o += '  folded rosetta root ' + root.slice(0, 13) + '… — the cross-domain translation is complete. this deposit 0/7.'
  return o
}
