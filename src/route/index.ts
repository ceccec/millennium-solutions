// THE ROUTE — one catch-all parser for every path this tree serves, and a refusal for any path it does not know.
//
// Pure: no I/O. A route is data: a method, a pattern of path segments, and the name of what answers it. A pattern
// segment is either a literal, `:name` for one segment captured as a parameter, or `*name` for the rest of the path,
// captured whole. The parser reads the whole path, so a request for `/mcpx` is not taken for `/mcp`: a match is on
// whole segments, never on a prefix.
//
// An unknown path is not answered with a silent 404. It is refused, and the refusal names the method and path that
// were asked for and the routes that exist, so a caller can see what the server does understand.

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD'
export type Route = { method: Method; pattern: string; name: string }

export type Matched = { status: 'MATCHED'; name: string; params: Record<string, string>; query: Record<string, string>; path: string[] }
export type Refused = { status: 'REFUSED'; why: string; method: string; path: string; known: string[] }

/** The path split into its segments, decoded, with empty segments dropped so `/a//b/` is `['a', 'b']`. */
export const segmentsOf = (raw: string): string[] => {
  const pathname = raw.split('?')[0]
  return pathname.split('/').filter((s) => s.length > 0).map((s) => {
    try { return decodeURIComponent(s) } catch { return s }
  })
}

/** The query string as a plain map. A repeated key keeps its last value, which is how the rest of this tree reads it. */
export const queryOf = (raw: string): Record<string, string> => {
  const i = raw.indexOf('?')
  if (i < 0) return {}
  const out: Record<string, string> = {}
  for (const [k, v] of new URLSearchParams(raw.slice(i + 1))) out[k] = v
  return out
}

const patternSegments = (pattern: string): string[] => segmentsOf(pattern)

/** Match one route against a method and a path. Returns the captured parameters, or null. */
export const matchRoute = (route: Route, method: string, segments: string[]): Record<string, string> | null => {
  if (route.method !== method) return null
  const pat = patternSegments(route.pattern)
  const params: Record<string, string> = {}
  for (let i = 0; i < pat.length; i++) {
    const p = pat[i]
    if (p.startsWith('*')) {
      params[p.slice(1)] = segments.slice(i).join('/')
      return params
    }
    if (i >= segments.length) return null
    if (p.startsWith(':')) params[p.slice(1)] = segments[i]
    else if (p !== segments[i]) return null
  }
  return segments.length === pat.length ? params : null
}

/** Find the route that answers a request. The first route that matches wins, in the order given. */
export const dispatch = (routes: Route[], method: string, raw: string): Matched | Refused => {
  const segments = segmentsOf(raw)
  const query = queryOf(raw)
  for (const r of routes) {
    const params = matchRoute(r, method, segments)
    if (params) return { status: 'MATCHED', name: r.name, params, query, path: segments }
  }
  const path = '/' + segments.join('/')
  // A path that exists under another method is named as such: the caller asked the wrong verb, not for a missing path.
  const samePath = routes.filter((r) => r.method !== method && matchRoute(r, r.method, segments) !== null)
  const why = samePath.length
    ? `the path exists for ${samePath.map((r) => r.method).join(', ')}, not for ${method}`
    : `no route answers ${method} ${path}`
  return { status: 'REFUSED', why, method, path, known: routes.map((r) => `${r.method} ${r.pattern}`) }
}
