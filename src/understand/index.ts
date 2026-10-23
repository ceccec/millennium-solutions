// UNDERSTAND — say which route a request belongs to, and say when none does.
//
// Pure: no network, no file reads. It reads the text of a request and returns one of:
//   UNDERSTOOD  a route that the MCP server has, with the reason it was chosen and the arguments to call it with
//   UNDERSTOOD: FALSE  no route fits. The request is returned with what the server can do instead, and nothing is guessed.
//
// A request is never answered by a route it does not match. The earlier failure this exists for: a physics phrase with
// no arithmetic and no Lean statement reached a connector that read it as text and returned a record that looked like
// an answer. A phrase that names no route is now reported as one.

export type DocHit = { file: string; line: number; score: number; text: string }

export type Understood =
  | { understood: true; tool: string; arguments: Record<string, string>; reason: string }
  | { understood: false; request: string; reason: string; options: string[]; docs: DocHit[]; docsNote: string }

const LEAN_LIKE = /(=|≤|<|≠|∀|∃|¬)/
const INTEGER = /^\s*\d+\s*$/
const DECLARED_FACTOR = /\bfactor(s|isation|ize|ise)?\b/i
const CLAY = /\bclay\b|\bmillennium\b|\bprize\b/i
const FILE_OR_THEOREM = /\b[a-z_][a-z0-9_]*\.lean\b|\btheorem\b/i

export const understand = (request: string): Understood => {
  const text = request.trim()
  if (!text) return { understood: false, request, reason: 'the request is empty', options: ['state a Lean proposition, an integer, or a repository file or theorem name'] }

  if (INTEGER.test(text)) return { understood: true, tool: 'factor', arguments: { n: text }, reason: 'an integer alone is a factorisation request' }

  if (DECLARED_FACTOR.test(text) && /\d{2,}/.test(text)) {
    const digits = text.match(/\d{2,}/)?.[0] ?? ''
    return { understood: true, tool: 'factor', arguments: { n: digits }, reason: 'a factorisation request with an integer in it' }
  }

  if (CLAY.test(text)) return { understood: true, tool: 'clay_conditions', arguments: {}, reason: 'names the Clay prize; the Clay tool checks its eligibility conditions, it does not solve the problems' }

  if (FILE_OR_THEOREM.test(text)) return { understood: true, tool: 'explain', arguments: { question: text }, reason: 'names a Lean file or a theorem' }

  if (LEAN_LIKE.test(text) && !/[a-z]{4,}\s+[a-z]{4,}\s+[a-z]{4,}/i.test(text)) {
    return { understood: true, tool: 'court_trial', arguments: { claim: text }, reason: 'a Lean proposition: the two-sided court decides it' }
  }

  return {
    understood: false,
    request: text,
    docs: [],
    docsNote: 'no inline docs were searched; see searchDocs',
    reason: 'no route fits: it names no integer, no Lean statement, no Clay problem and no theorem or file, so the server cannot answer it with a result',
    options: [
      'state it as a Lean proposition over a finite domain; it then goes to the court (court_trial), which seals or refuses it',
      'name a theorem or a Lean file (explain)',
      'give an integer to factor (factor)',
      'for a question about the world, use web_search, which returns sources and makes no claim',
    ],
  }
}

// ── MEANING FROM INLINE DOCS ───────────────────────────────────────────────────────────────────────────────────────
// When no route fits, the request's words are looked for in the tree's own comments and docs, and the lines that carry
// the most of them are returned with their place. A hit is text the repository wrote, not a proof: the caller is told
// so by docsNote, and nothing here turns a hit into a claim.

const STOP = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'what', 'when', 'how', 'are', 'was', 'were', 'you', 'your', 'not', 'but', 'can', 'all', 'one', 'two', 'its', 'into', 'over', 'each', 'than', 'then', 'let', 'get', 'out', 'use', 'make', 'any'])

export const wordsOf = (request: string): string[] => {
  const raw = request.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
  return [...new Set(raw.filter((w) => w.length >= 2 && !STOP.has(w)))]
}

export const searchDocs = (request: string, sources: { file: string; text: string }[], limit = 8): DocHit[] => {
  const words = wordsOf(request)
  if (!words.length) return []
  const hits: DocHit[] = []
  for (const { file, text } of sources) {
    const lines = text.split('\n')
    lines.forEach((line, i) => {
      const low = line.toLowerCase()
      const score = words.filter((w) => low.includes(w)).length
      if (score >= Math.max(2, Math.ceil(words.length / 2))) hits.push({ file, line: i + 1, score, text: line.trim().slice(0, 240) })
    })
  }
  return hits.sort((a, b) => b.score - a.score || a.file.localeCompare(b.file) || a.line - b.line).slice(0, limit)
}
