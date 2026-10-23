// ROBOTS.TXT, ONE IMPLEMENTATION — the rule an adapter obeys before it asks a host anything.
//
// Three scripts (links-check, clay-online, and the CERN and novelty paths) each read robots.txt with their own
// copy of this logic. They are consolidated here so the answer to "may this client fetch this path" is computed
// in one place, and tested in one place.
//
// Pure: no fetch. The caller supplies the robots.txt text, so the decision can be tested offline against a
// fixture, and the live read lives in scripts/api-adapters.ts.
//
// RULES, as the Robots Exclusion Protocol states them, and no more:
//   · the group for the most specific matching User-agent is used; `*` is the fallback;
//   · within a group, `Allow` and `Disallow` are prefix matches on the path;
//   · the longest matching rule wins; on a tie, Allow wins;
//   · an empty Disallow allows everything;
//   · no robots.txt (or an empty one) allows everything.

export type Rule = { allow: boolean; path: string }

const normalise = (line: string): string => line.replace(/#.*$/, '').trim()

/** Parse robots.txt into groups keyed by user-agent token (lower-cased). */
export const parseRobots = (text: string): Map<string, Rule[]> => {
  const groups = new Map<string, Rule[]>()
  let agents: string[] = []
  let sawRule = false
  for (const raw of text.split(/\r?\n/)) {
    const line = normalise(raw)
    if (!line) continue
    const m = line.match(/^([A-Za-z-]+)\s*:\s*(.*)$/)
    if (!m) continue
    const field = m[1].toLowerCase()
    const value = m[2].trim()
    if (field === 'user-agent') {
      // A user-agent line after a rule starts a new group; consecutive user-agent lines share one.
      if (sawRule) { agents = []; sawRule = false }
      agents.push(value.toLowerCase())
      for (const a of agents) if (!groups.has(a)) groups.set(a, [])
    } else if (field === 'allow' || field === 'disallow') {
      sawRule = true
      for (const a of agents) groups.get(a)!.push({ allow: field === 'allow', path: value })
    }
  }
  return groups
}

/** The group that applies to this client: the most specific named agent, else `*`. */
const groupFor = (groups: Map<string, Rule[]>, agent: string): Rule[] => {
  const name = agent.toLowerCase()
  for (const [key, rules] of groups) if (key !== '*' && name.includes(key)) return rules
  return groups.get('*') ?? []
}

/** Decide whether `agent` may fetch `pathAndQuery`. Returns the deciding rule, or null when allowed by default. */
export const decide = (text: string, agent: string, pathAndQuery: string): { allowed: boolean; rule: Rule | null } => {
  const rules = groupFor(parseRobots(text), agent)
  let best: Rule | null = null
  for (const r of rules) {
    // An empty Disallow means "allow everything" and must not be read as a rule matching every path.
    if (r.path === '' && !r.allow) continue
    if (!pathAndQuery.startsWith(r.path)) continue
    if (!best || r.path.length > best.path.length || (r.path.length === best.path.length && r.allow)) best = r
  }
  if (!best) return { allowed: true, rule: null }
  return { allowed: best.allow, rule: best }
}

/** Convenience for callers that hold a URL rather than a path. */
export const mayFetch = (text: string, agent: string, url: string): { allowed: boolean; rule: Rule | null } => {
  const u = new URL(url)
  return decide(text, agent, u.pathname + u.search)
}
