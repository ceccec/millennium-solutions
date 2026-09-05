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

/** Scripts a ROUTINE CHAIN invokes — ci:local, gates, precommit, all, release. Chains name their steps two
 *  ways: as a path (`scripts/x.ts`) and as a bare npm-script string (all.ts lists 'lean', 'contradictions').
 *  A path-only extractor reported 42 scripts as unrun including `contradictions`, which ci:local runs on
 *  every commit — the third extractor in one session that was narrower than the thing it read. */
export const runByChain = (): Set<string> => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8')).scripts as Record<string, string>
  let text = ['release', 'gates', 'all', 'ci:local'].map((k) => String(pkg[k] ?? '')).join(' ')
  for (const c of ['scripts/ci-local.ts', 'scripts/gate.ts', 'scripts/precommit.ts', 'scripts/all.ts']) {
    try { text += readFileSync(c, 'utf8') } catch { /* absent chains are not chains */ }
  }
  const reach = reachableScripts()
  const out = new Set<string>()
  for (const m of text.matchAll(/scripts\/([a-z0-9-]+)\.ts/g)) out.add(m[1])
  for (const m of text.matchAll(/'([a-z][a-z0-9:-]*)'/g)) {
    if (reach.has(m[1])) out.add(m[1])
    const dashed = m[1].replace(/:/g, '-')
    if (reach.has(dashed)) out.add(dashed)
  }
  return out
}

/** WHY a refusing gate is deliberately absent from every routine chain. A reason recorded here is a
 *  decision someone took; a gate missing from both the chains AND this map is a decision nobody has taken,
 *  which is the only kind the census should keep asking about. Same discipline as naming an uncontrolled
 *  gate in gates-fire rather than giving it a control that lies.
 *
 *  This is a list, and this repository does not keep lists — with one exception, which is exactly this one:
 *  a JUDGEMENT cannot be derived from the tree. What CAN be derived is whether a judgement was recorded, and
 *  that is what the census checks. */
export const UNRUN_BY_DESIGN: Record<string, string> = {
  'bench-hex': 'a benchmark: its output is a measurement, not a verdict, and timings vary by machine',
  'bench-hexbit': 'the same — and its result is sealed in speed.lean, which every chain does check',
  cern: 'reaches opendata.cern.ch; ~15 minutes of network, and the portal is not ours to poll on each commit',
  'doi-resolve': 'resolves external DOIs; a registry outage would fail a build about this tree',
  'zenodo-verify': 'reaches Zenodo; same reason',
  xrepo: 'reads peer manifests OUTSIDE this repository — it cannot run where they do not exist, which is any clone but this machine',
  seo: 'needs a built dist; belongs to release, and is in gates-fire so a regression is caught there',
  paper: 'a generator whose output every chain already checks',
  'lean-gen': 'a generator, run when the sources change rather than on every commit',
  priorart: 'a generator; priorart-gen is the gate that holds its output',
  'stale-figures': 'REPORTS by design — a 75% false-positive rate is not something to gate a build on',
  'verify-theorems': 'covered by gates-fire, and its subject is re-verified by forensics on every commit',
}

/** Gates that REFUSE and that no routine chain runs. `seo` sat here with a real defect — paper.html
 *  carrying zero <h1> — until a probe happened to run it. A gate nobody runs protects nothing, which is a
 *  different failure from a gate nobody has controlled, and the involution of it. */
export const refusersNoChainRuns = (): string[] => {
  const run = runByChain()
  return uncontrolledRefusers({ includeMeta: false, includeNetwork: true })
    .concat([...controlledGates()].filter((g) => existsSync(`scripts/${g}.ts`)))
    .filter((g, i, a) => a.indexOf(g) === i && !run.has(g) && !META.has(g))
    .sort()
}

/** Of those, the ones nobody has decided about. */
export const unrunUndecided = (): string[] => refusersNoChainRuns().filter((g) => !UNRUN_BY_DESIGN[g])
