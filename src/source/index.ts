// Reading source text as CODE, once.
//
// A gate that scans the tree scans its own explanation. It happened three times in one session:
// canon-gate flagged the file that documents the patterns it looks for; the orphan-exports control planted
// a name that gates-fire's own mutation string then named a second time; and orphan-gate counted a module
// as referenced because two comments explaining why it LOOKED unreferenced mentioned its path.
//
// Every one of those is the same mistake, and the fix is always this: a claim about what the code does must
// be measured over code, not over the prose beside it. canon-gate had a private copy of this function and
// orphan-gate was about to grow a second — which is the point at which src/html/index.ts's story starts.
//
// Deliberately blunt: it does not parse, so a `//` inside a string literal is treated as a comment. That
// loses a little code and keeps the rule simple, and losing code is the safe direction here — a gate that
// sees less is conservative, one that sees prose as code is wrong.
export const stripComments = (s: string): string =>
  s.replace(/\/\*[\s\S]*?\*\//g, ' ')
    .split('\n').filter((l) => !/^\s*(\/\/|\*)/.test(l)).map((l) => l.replace(/\/\/.*$/, '')).join('\n')

/** ── WHAT A SCRIPT ACTUALLY DEPENDS ON ────────────────────────────────────────────────────────────────
 *
 *  Two kinds of dependency, and only one of them is an import. A script reaches its modules with
 *  `import … from '…'`, and it reaches its DATA with a quoted path it opens at run time —
 *  `src/proof/discovered.json`, `CITATION.cff`. A closure built from imports alone would call a script
 *  unaffected by a change to the very ledger it reads, which is the failure mode that makes a selective
 *  runner worse than useless: it would say "nothing to check" about the thing that changed.
 *
 *  Comments are stripped first, so a path named only in prose — and this tree's comments name a great many —
 *  does not enter a closure it has no business in. */
const SPECIFIER = /\bfrom\s+['"]([^'"]+)['"]/g
const QUOTED_PATH = /['"`]([A-Za-z0-9_./-]+\.(?:json|lean|md|ts|yml|yaml|cff|txt|vue))['"`]/g

const resolveFrom = (importer: string, spec: string, exists: (p: string) => boolean): string | null => {
  if (!spec.startsWith('.')) return null                       // a bare specifier is a package, not this tree
  const dir = importer.slice(0, importer.lastIndexOf('/'))
  const parts = `${dir}/${spec}`.split('/')
  const out: string[] = []
  for (const p of parts) { if (p === '.' || p === '') continue; if (p === '..') out.pop(); else out.push(p) }
  const base = out.join('/')
  // The extension is optional in this tree's page imports, so both spellings resolve.
  for (const c of [base, `${base}.ts`, `${base}/index.ts`, `${base}.vue`, `${base}.mjs`]) if (exists(c)) return c
  return null
}

/** A path this file builds at run time rather than writing out — `src/proof/${name}.lean`, `.zenodo/theorems/${key}.json`.
 *  A closure cannot contain what the source never names, so a file with one of these has an INCOMPLETE
 *  closure and any caller selecting work from it must treat the file as reaching everything. Detected on
 *  comment-stripped source, matching a template literal that starts with one of this tree's real directories. */
export const hasComputedPath = (src: string): boolean =>
  /`(?:src|scripts|docs|\.zenodo|\.vitepress|public)\/[^`]*\$\{/.test(stripComments(src))

/** Every file `entry` reaches — imported modules, transitively, plus the data paths those files open.
 *  `read` returns a file's text or null; `exists` says whether a path is in the tree. Both are passed in so
 *  this stays a pure function of the tree rather than a second place that knows how to touch the disk. */
export const dependsOn = (
  entry: string,
  read: (p: string) => string | null,
  exists: (p: string) => boolean,
): Set<string> & { incomplete?: boolean } => {
  const seen = new Set<string>() as Set<string> & { incomplete?: boolean }
  const data = new Set<string>()
  const walk = (file: string) => {
    if (seen.has(file)) return
    seen.add(file)
    const src = read(file)
    if (src === null) return
    const code = stripComments(src)
    for (const m of code.matchAll(SPECIFIER)) {
      const r = resolveFrom(file, m[1], exists)
      if (r) walk(r)
    }
    for (const m of code.matchAll(QUOTED_PATH)) if (exists(m[1])) data.add(m[1])
    if (hasComputedPath(src)) seen.incomplete = true
  }
  walk(entry)
  for (const d of data) seen.add(d)
  return seen
}
