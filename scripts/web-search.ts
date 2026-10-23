#!/usr/bin/env node
// WEB-SEARCH — search a free public index and return its hits, so an online question is answered through the MCP
// and not through a separate browsing tool. It backs the MCP tool `web_search`.
//
//   node scripts/web-search.ts <source> <query> [limit]
//
//   source  wikipedia | openalex | arxiv
//   query   the search text
//   limit   1 to 10 hits, default 5
//
// Each hit carries its title, its address, and the snippet the index returned. A search that returns nothing is
// reported as NONE, never as a negative answer: an index can miss what it does not name. Nothing is written to the tree.
const [source, query, limitArg] = process.argv.slice(2)
const limit = Math.min(Math.max(Number(limitArg ?? 5), 1), 10)

// A refusal is an answer: the caller asked for something this tool does not do. It is reported as REFUSED and exits 0,
// so the MCP hands it back as the answer and not as a failure of the tool.
const REFUSE = (why: string) => {
  console.log(JSON.stringify({ status: 'REFUSED', why }, null, 1))
  process.exit(0)
}
if (!source || !query) REFUSE('usage: web-search.ts <wikipedia|openalex|arxiv> <query> [limit]')

// A rate limit (HTTP 429) is the service asking for patience, not an answer: back off and ask again, a few times,
// then report it as INCONCLUSIVE. arXiv asks for a few seconds between requests.
const get = async (url: string): Promise<string> => {
  for (let attempt = 0; ; attempt++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 30_000)
    try {
      const res = await fetch(url, { signal: controller.signal, headers: { 'user-agent': 'millennium-solutions-mcp/1 (web_search)' } })
      if (res.status === 429 && attempt < 3) {
        await new Promise((r) => setTimeout(r, 5000 * (attempt + 1)))
        continue
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.text()
    } finally {
      clearTimeout(timer)
    }
  }
}

const strip = (s: string) => s.replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim()

const search = async () => {
  if (source === 'wikipedia') {
    const j = JSON.parse(await get(`https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srlimit=${limit}&srsearch=${encodeURIComponent(query)}`)) as { query?: { search?: { title: string; snippet: string }[] } }
    return (j.query?.search ?? []).map((h) => ({ title: h.title, url: `https://en.wikipedia.org/wiki/${encodeURIComponent(h.title.replace(/ /g, '_'))}`, snippet: strip(h.snippet) }))
  }
  if (source === 'openalex') {
    const j = JSON.parse(await get(`https://api.openalex.org/works?search=${encodeURIComponent(query)}&per-page=${limit}`)) as { results?: { title?: string; display_name?: string; doi?: string; id?: string; publication_year?: number }[] }
    return (j.results ?? []).map((w) => ({ title: w.display_name ?? w.title ?? '', url: w.doi ?? w.id ?? '', snippet: w.publication_year ? `published ${w.publication_year}` : '' }))
  }
  if (source === 'arxiv') {
    const xml = await get(`http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&max_results=${limit}`)
    const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((m) => m[1]!)
    return entries.map((e) => ({
      title: strip(e.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? ''),
      url: strip(e.match(/<id>([\s\S]*?)<\/id>/)?.[1] ?? ''),
      snippet: strip(e.match(/<summary>([\s\S]*?)<\/summary>/)?.[1] ?? '').slice(0, 300),
    }))
  }
  return null
}

search()
  .then((hits) => {
    if (hits === null) return REFUSE(`unknown source "${source}" — use wikipedia, openalex or arxiv`)
    console.log(JSON.stringify({
      status: hits.length ? 'FOUND' : 'NONE',
      source,
      query,
      hits,
      note: hits.length ? 'hits as the index returned them now; nothing here is checked against any other source' : 'NONE means this index returned nothing for this query on this date, never that nothing exists',
    }, null, 1))
  })
  .catch((e) => {
    console.log(JSON.stringify({ status: 'INCONCLUSIVE', source, query, why: String(e).slice(0, 200) }, null, 1))
    process.exit(1)
  })
