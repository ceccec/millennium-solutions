// THE REUSABLE API — one place that knows how to read this deposit.
//
// Thirty-two scripts loaded src/proof/discovered.json themselves and nine parsed Lean theorem names with
// their own regex. That is not a style problem: every one of those copies is a place where the deposit can
// start disagreeing with itself, and this session found several that had. forensics counted key families by
// splitting key TEXT and reported 377 development leads that did not exist; seal-lean matched whole keys and
// called 25 living theorems orphans; verify read a foreign ledger and reported every entry unproven. Each was
// a private answer to a question this module now answers once.
//
// Nothing here decides anything. It reads artefacts and returns them typed — the ledger, the Lean sources,
// and the relation between a sealed key and the theorem on disk that carries it. Judgement stays in the gates
// that own it.
import { readFileSync, readdirSync, existsSync } from 'node:fs'

export const LEDGER_PATH = 'src/proof/discovered.json'
export const PROOF_DIR = 'src/proof'

export interface Entry {
  key: string
  name: string
  receipt: string
  revoked?: boolean
  reason?: string
  supersededBy?: string
  portable?: boolean
  statement?: string
}

/** The whole record, in order. Append-only: withdrawn entries are present and marked, never removed. */
export const ledger = (): Entry[] =>
  existsSync(LEDGER_PATH) ? JSON.parse(readFileSync(LEDGER_PATH, 'utf8')) : []

/** The entries that STAND. Everything that judges what the deposit currently claims wants this one. */
export const live = (l: Entry[] = ledger()): Entry[] => l.filter((e) => !e.revoked)

/** Withdrawn but kept — still receipted, still in the chain, no longer claimed. */
export const withdrawn = (l: Entry[] = ledger()): Entry[] => l.filter((e) => e.revoked === true)

/** Withdrawn AND since re-established by a Lean theorem, which the record links rather than un-revoking. */
export const superseded = (l: Entry[] = ledger()): Entry[] => l.filter((e) => e.supersededBy)

export const liveKeys = (l: Entry[] = ledger()): Set<string> => new Set(live(l).map((e) => e.key))
export const byKey = (l: Entry[] = ledger()): Map<string, Entry> => new Map(l.map((e) => [e.key, e]))

/** The octave reading — the deposit counts in eights. A target the theorems earn, never a quota. */
export const octave = (l: Entry[] = ledger()) => ({
  total: l.length, octaves: Math.floor(l.length / 8), remainder: l.length % 8, exact: l.length % 8 === 0,
})

export interface LeanTheorem { name: string; file: string; tactic: string; statement: string }

export const leanFiles = (): string[] =>
  existsSync(PROOF_DIR) ? readdirSync(PROOF_DIR).filter((f) => f.endsWith('.lean')).sort() : []

export const leanSource = (file: string): string => readFileSync(`${PROOF_DIR}/${file}`, 'utf8')

/** Every theorem on disk, with the file that carries it and the tactic that closed it. ONE parse of the
 *  `theorem` syntax, so a change to how proofs are written is a change in one place. */
export const leanTheorems = (): LeanTheorem[] => {
  const out: LeanTheorem[] = []
  for (const file of leanFiles()) {
    for (const m of leanSource(file).matchAll(/^theorem\s+([A-Za-z_0-9]+)\s*:([\s\S]*?):=\s*(by decide|rfl|by\s+\w+)/gm))
      out.push({ name: m[1], file, tactic: m[3], statement: m[2].replace(/^\s*--.*$/gm, '').replace(/\s+/g, ' ').trim() })
  }
  return out
}

/** Which file carries the theorem a sealed key was minted from.
 *
 *  Keys carry their naming HISTORY: older entries are `lean_<theorem>` and current ones are
 *  `lean_<namespace>_<theorem>`. Comparing whole keys called 25 living theorems orphans, and splitting key
 *  text invented a family per theorem. Matching on the theorem IDENTIFIER is what survives both conventions,
 *  and it is the only comparison any caller should be making. */
export const fileOfKey = (key: string, thms: LeanTheorem[] = leanTheorems()): string | null => {
  const rest = key.replace(/^lean_/, '')
  for (const t of thms) if (rest === t.name || rest.endsWith('_' + t.name) || rest.endsWith('.' + t.name)) return t.file
  return null
}

/** Frontmatter written as `-- key: value` at the head of a Lean file, before its prose. */
export const frontmatter = (file: string): Record<string, string> => {
  const fm: Record<string, string> = {}
  for (const line of leanSource(file).split('\n')) {
    const m = line.match(/^\s*--\s*([a-z][a-z0-9_]*):\s*(.+?)\s*$/)
    if (!m) { if (/^\s*--/.test(line)) continue; if (line.trim() === '' || /^(import|set_option)/.test(line)) continue; break }
    fm[m[1]] = m[2]
  }
  return fm
}
