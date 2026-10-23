// VERIFIED CACHE — a file that passed a check is recorded with its content hash. The next run re-checks only the files
// that are new or changed, and reuses every recorded pass. A failure is never recorded, so a failing file is always
// checked again. A check's version is part of its key, so a rule change re-checks everything.
//
//   the cache file is .verified.json at the repository root (gitignored)
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const FILE = join(ROOT, '.verified.json')

type Cache = Record<string, string>
const load = (): Cache => {
  if (!existsSync(FILE)) return {}
  try { return JSON.parse(readFileSync(FILE, 'utf8')) as Cache } catch { return {} }
}

export const contentHash = (text: string): string => createHash('sha256').update(text).digest('hex')

/** A pass is reusable only for the same check version, the same path, and the same content. */
export const passedBefore = (check: string, path: string, text: string): boolean => {
  const key = `${check}|${path}`
  return load()[key] === contentHash(text)
}

/** Record the passes of one run. Failures are passed in nowhere, so they are never recorded. */
export const recordPasses = (check: string, passes: { path: string; text: string }[]): void => {
  const cache = load()
  for (const p of passes) cache[`${check}|${p.path}`] = contentHash(p.text)
  writeFileSync(FILE, JSON.stringify(cache, null, 1) + '\n')
}
