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
// `release` joins META: it TAGS. A control harness that mutates a file and runs it would either hit the
// dirty-tree refusal — firing for the wrong reason, which is the 1-in-39 mistake gates-fire warns about —
// or, worse, succeed and cut a tag. Its own preconditions (sealed, octave-exact, carried) were exercised
// by hand with a planted ledger row and it refused, naming the remainder.
export const META = new Set(['all', 'ci-local', 'gates-fire', 'precommit', 'control-probe', 'leads', 'wire', 'metrics', 'release'])
/** Scripts whose subject is a remote nobody here may perturb. */
// `release-live` joins NETWORK: its refusal is ABSENT, a fact about npm's registry and Zenodo's, and no
// mutation of any file in this tree can produce it. It is exercised by ARGUMENT instead —
// `node scripts/release-live.ts v0.0.0` asks about a version never published, answers ABSENT, exits 1.
export const NETWORK = new Set(['cern', 'cern-oai', 'doi-resolve', 'zenodo-mint', 'zenodo-verify', 'bench-hex', 'bench-hexbit', 'release-live'])

/** Every script package.json can reach. */
export const reachableScripts = (): Set<string> => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8')).scripts as Record<string, string>
  const out = new Set<string>()
  for (const v of Object.values(pkg)) for (const m of String(v).matchAll(/scripts\/([a-z0-9-]+)\.ts/g)) out.add(m[1])
  return out
}

/** The gates gates-fire already controls — BY THE SCRIPT EACH CONTROL RUNS, not by the label it is filed
 *  under. Reading only the labels made this narrower than its subject: `notice` got two controls, filed as
 *  `notice-reads-the-whole-table` and `notice-refuses-an-overclaim` because they catch opposite failures,
 *  and leads.ts went on reporting notice as never shown to fail. A label is a name a human chose; `cmd` is
 *  what actually runs. Both are read, so a control whose label IS the script name still resolves. */
export const controlledGates = (): Set<string> => {
  const src = readFileSync('scripts/gates-fire.ts', 'utf8')
  const out = new Set([...src.matchAll(/gate: '([^' ]+)/g)].map((m) => m[1]))
  for (const m of src.matchAll(/cmd: '[^']*scripts\/([a-z0-9-]+)\.ts/g)) out.add(m[1])
  return out
}

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
// TWO ENTRIES WERE REMOVED BECAUSE THEIR REASONS WERE FALSE, and the reasons were checkable prose.
//   seo      said "belongs to release" — and release did not run it. A reason that names a placement
//            which does not exist is not a decision, it is a description of one nobody made.
//   lean-gen said "a generator, run when the sources change" — run by nothing, and it had rotted into
//            emitting Lean the kernel refuses. The exemption permitted exactly the failure that occurred.
// Both are in `npm run release` now. The other reasons here were tested the same way and hold: gates-fire
// and forensics do run in release and ci:local, priorart-gen does run in ci:local.
export const UNRUN_BY_DESIGN: Record<string, string> = {
  'bench-hex': 'a benchmark: its output is a measurement, not a verdict, and timings vary by machine',
  'bench-hexbit': 'the same — and its result is sealed in speed.lean, which every chain does check',
  cern: 'reaches opendata.cern.ch; ~15 minutes of network, and the portal is not ours to poll on each commit',
  'doi-resolve': 'resolves external DOIs; a registry outage would fail a build about this tree',
  'zenodo-verify': 'reaches Zenodo; same reason',
  xrepo: 'reads peer manifests OUTSIDE this repository — it cannot run where they do not exist, which is any clone but this machine',
  paper: 'a generator whose output every chain already checks',
  priorart: 'a generator; priorart-gen is the gate that holds its output',
  'stale-figures': 'REPORTS by design — a 75% false-positive rate is not something to gate a build on',
  'verify-theorems': 'covered by gates-fire, and its subject is re-verified by forensics on every commit',
  uses: 'discovery, not a gate: it reaches GDELT, Hacker News, Zenodo, OpenAlex, npm and GitHub, and what it finds is someone else\'s use of the work — whether it cites and pays — not a defect in this tree. It runs weekly in .github/workflows/uses.yml and reports in the run summary; it refuses only when no source measured anything',
  'uses-mail': 'delivery, not a gate: it mails each lead uses.ts found to legal@psg.bg as an evidence dossier, from rights@uuidna.com through mail.psg.bg by authenticated SMTP — network and the author\'s credentials, so no build chain can run it. It runs weekly after uses.ts in .github/workflows/uses.yml, says NOT CONFIGURED when the SMTP secrets are unset, and refuses only when a send fails',
  novelty: 'discovery, not a gate: it reaches the OEIS, zbMATH Open, OpenAlex, Crossref and arXiv to search the literature for each theorem, and records what was searched and what came back in src/proof/novelty.json — network a build about this tree must not depend on',
  clusters: 'a generator, not a gate: it prepares one publication draft per proven cluster in .zenodo/clusters/ and reaches no network; it refuses only when a joint address fails to bind every receipt, which forensics and the seal already check on every run',
  // ── MINE, DECIDED RATHER THAN LEFT SILENT ───────────────────────────────────────────────────────────────
  // leads.ts named these the moment they existed: scripts that REFUSE, that no chain ran, and that nothing
  // had shown could fail. That is the exact defect scripts/runnable-gate.ts was written to catch in other
  // people's scripts, committed three waves before these were added. `formulas` and `coils` are wired into
  // `npm run gates` and controlled in gates-fire. `discoveries` is not, and here is why.
  'release-live': 'reaches the npm registry and Zenodo to ask whether a tag actually landed — network, and about somebody else\'s server, so no build chain can run it. It is the check to run AFTER publish.yml: a green workflow says a job exited zero, not that the registry has the version. It refuses only on ABSENT, never on NOT MEASURED',
  provenance: 'reaches zenodo.org to recompute the priority record from the registry that issued the DOIs — network, and about a third party\'s server. A build chain that ran it would fail on a Zenodo outage, about this tree, which is the false negative this deposit refuses. It is the check to run BEFORE a deposition, and its drift refusal is the one that caught the ORCID discovery flipping the lead from +3 days to −27',
  sources: 'proves fifteen live readers against answers known in advance, over the network, before any investigation result is believed — the instrument check that must precede provenance. Same reason it cannot sit in a chain: a reader that does not answer is an outage, not a finding, and a build about this tree must not turn red for one',
  e2e: 'needs a BUILT site, not a source tree: it walks .vitepress/dist and checks what a reader opens — the page references its data, the counts agree, every linked theorem page exists. It runs inside npm run docs:build, which release.yml runs before any tag, and it cannot join the source chain because on a fresh clone there is no dist to check and it would refuse for the wrong reason. Controlled in gates-fire by mutating the built page',
  discoveries: 'REPORTS by design, like stale-figures: it orders where the next prior-art search should go, and its own output says a rank is not a novelty claim. It refuses only when its signals collapse — every candidate scoring alike, which would mean the queue cannot tell its entries apart — and gating a build on the shape of a work queue would teach closing the queue rather than working it',
  probe: 'the control harness, not a gate: it takes a file, a theorem and a mutation as arguments, so no chain can run it bare; gates-fire holds its control — a mutation that never reaches the theorem must be refused',
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

/** ── A BOUNDARY IN TIME ADMITS EXACTLY WHAT PRECEDES IT ───────────────────────────────────────────────────
 *  A rule made on a date cannot be broken by something written before that date, and a gate that says
 *  otherwise is a red light nobody can turn off. receipt-audit needs this for the 29 receipts written five
 *  weeks before the 2×7 rule existed. The whole of it: both instants must be KNOWN, and the earlier one
 *  must be strictly earlier. An unknown date is never excused — the lenient side takes no case it cannot
 *  prove, because that is the side a new unsigned receipt would quietly slip into. */
export const precedes = (at: number | null, boundary: number | null): boolean =>
  at !== null && boundary !== null && at < boundary

/** ── A STALE BUILD IS A TAIL; A REAL DEFECT IS A HOLE ─────────────────────────────────────────────────────
 *  Given, in ledger order, whether each entry has its built artefact, the two causes of "missing" are told
 *  apart with no flag to set, because the ledger is APPEND-ONLY: a build that has not been run since the
 *  ledger grew has artefacts for a PREFIX and none after, while a genuine defect leaves a HOLE — an entry
 *  with nothing built that has a LATER entry that does. `built` is the last index that has one, -1 when
 *  nothing is built at all. theorem-pages-gate printed one line per missing key and read as hundreds of
 *  broken theorems when the only thing wrong was an unrun build. */
export const staleTail = (present: readonly boolean[]): { built: number; holes: number[]; tail: number[] } => {
  const built = present.lastIndexOf(true)
  const holes: number[] = [], tail: number[] = []
  present.forEach((p, i) => { if (!p) (i < built ? holes : tail).push(i) })
  return { built, holes, tail }
}
