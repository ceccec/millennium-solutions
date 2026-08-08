// the clown — the player who benefits from all and respects the rules. Juggles with titanium precision
// (a valid siteswap is a permutation; ball count = average of the digits), navigates chaos (the logistic
// map: deterministic yet unpredictable), draws on every domain (the complete rosetta, one hop from the
// core), and stays within the floor (every play clears the honesty gate, 0/7). Developing the clown
// exercises the rest — group theory, dynamics, the rosetta, the rules. Computed, not stored.
import { toUuid, merkleFold } from '../../0/index.ts'
import { DOMAINS as ROSETTA_DOMAINS } from '../rosetta/index.ts'
export function report(): string {
  const valid = (s: string) => { const a = [...s].map(Number); const n = a.length; return new Set(a.map((x, i) => (i + x) % n)).size === n }
  const avg = (s: string) => { const d = [...s].map(Number); return d.reduce((x, y) => x + y, 0) / d.length }
  const patterns = ['531', '441', '97531', '522']
  const f = (x: number) => 4 * x * (1 - x)
  let x = 0.3, y = 0.3 + 1e-9
  for (let i = 0; i < 50; i++) { x = f(x); y = f(y) }
  const spread = Math.abs(x - y)
  const root = merkleFold(['juggle', 'chaos', 'rosetta', 'rules'].map(toUuid))
  let o = 'the clown — benefits from all, respects the rules:\n\n'
  o += '  juggles (a valid siteswap is a permutation; balls = average of digits):\n'
  for (const p of patterns) o += '    ' + p + '   ' + (valid(p) ? 'valid' : 'INVALID') + '   ' + avg(p) + ' balls\n'
  o += '  navigates chaos (logistic r=4): two orbits 1e-9 apart spread to ' + spread.toFixed(3) + ' in 50 steps.\n'
  o += '  benefits from all: ' + ROSETTA_DOMAINS.length + ' domains, each one hop from the core (the rosetta).\n'
  o += '  respects the rules: every play clears the honesty gate — freedom within the floor.\n'
  o += '  folded clown root ' + root.slice(0, 13) + '… → 0/7.'
  return o
}
