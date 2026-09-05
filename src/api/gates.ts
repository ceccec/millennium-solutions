/** ── WHAT COUNTS AS AN UNCONTROLLED GATE — ONE DERIVATION, TWO READERS ─────────────────────────────────────
 *
 *  scripts/leads.ts and scripts/control-probe.ts both need the list of scripts that REFUSE and have never
 *  been shown to fail. They derived it separately and disagreed: the census counted meta-scripts and network
 *  scripts the probe excluded, so it reported 23 where the honest figure is smaller, and the two numbers
 *  drifted apart the moment either was edited.
 *
 *  Two derivations of one fact is the same defect as a hand-kept copy of a generated table — which this
 *  repository caught itself doing with priorart.lean in the same session. One function, both readers. */
import { readFileSync, existsSync } from 'node:fs'

/** Scripts that RUN other scripts. Probing them probes their children and says nothing about themselves. */
export const META = new Set(['all', 'ci-local', 'gates-fire', 'precommit', 'control-probe', 'leads', 'wire', 'metrics'])
/** Scripts whose subject is a remote nobody here may perturb. */
export const NETWORK = new Set(['cern', 'cern-oai', 'doi-resolve', 'zenodo-mint', 'zenodo-verify', 'bench-hex', 'bench-hexbit'])

/** Every script package.json can reach. */
export const reachableScripts = (): Set<string> => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8')).scripts as Record<string, string>
  const out = new Set<string>()
  for (const v of Object.values(pkg)) for (const m of String(v).matchAll(/scripts\/([a-z0-9-]+)\.ts/g)) out.add(m[1])
  return out
}

/** The gates gates-fire already controls, by the name it files them under. */
export const controlledGates = (): Set<string> =>
  new Set([...readFileSync('scripts/gates-fire.ts', 'utf8').matchAll(/gate: '([^' ]+)/g)].map((m) => m[1]))

/** Scripts that refuse — they print a finding and exit non-zero — and have no negative control.
 *  A CLI tool is excluded: `receipt` exits 1 with a usage line when called with no arguments, which
 *  refuses the CALLER, not the tree, and read as a permanently-red gate in both readers. */
export const uncontrolledRefusers = (opts: { includeMeta?: boolean; includeNetwork?: boolean } = {}): string[] => {
  const controlled = controlledGates()
  const out: string[] = []
  for (const g of reachableScripts()) {
    if (controlled.has(g)) continue
    if (!opts.includeMeta && META.has(g)) continue
    if (!opts.includeNetwork && NETWORK.has(g)) continue
    const p = `scripts/${g}.ts`
    if (!existsSync(p)) continue
    const src = readFileSync(p, 'utf8')
    if (/\busage:/.test(src)) continue
    if (/process\.exit\(\s*(1|bad|drift|Number\(|.*\?\s*1)/.test(src) && /✗/.test(src)) out.push(g)
  }
  return out.sort()
}
