// FILL — one template, any record: the slot fill of contract v1, as a pure function.
//
// Every /theorem/<key> page is the one page VitePress builds (theorem/_template.md) with a record's values put
// in its slots. scripts/theorem-stamp.ts calls this at build time; a tenant host (qpu) performs the same fill
// at the edge, and a contract test compares the bytes it serves with this function's — so "where the page was
// rendered" never changes what the reader gets. Tenant-agnostic: it knows slots, not theorems.
//
//   title               <title> text
//   head[name]          content of every <meta name|property="name">
//   head['link:rel']    href of <link rel="rel">;  head['link:rel:lang'] → <link rel="rel" hreflang="lang">
//   jsonld              text of <script id="record-ld">
//   data                text of <script id="record-data">
//   html[x]             innerHTML of the empty <div data-slot="x"></div> the template carries
//
// A slot the record leaves out keeps the template's content. Values are escaped for where they land.

import { escapeHtml } from '../html/index.ts'

export type Slots = {
  title?: string
  head?: Record<string, string>
  jsonld?: string
  data?: string
  html?: Record<string, string>
}

// escaping has one owner (src/html, held there by canon-gate); an attribute value also escapes its quote
const text = escapeHtml
const attr = (s: string): string => escapeHtml(s).replace(/"/g, '&quot;')
const re = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
// inside a <script>, only a closing tag can end it early
const script = (s: string): string => s.replace(/<\/script/gi, '<\\/script')

export const fill = (template: string, s: Slots): string => {
  let out = template
  if (s.title !== undefined) out = out.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${text(s.title!)}</title>`)
  for (const [k, v] of Object.entries(s.head ?? {})) {
    if (k.startsWith('link:')) {
      const [rel, lang] = k.slice(5).split(':')
      const tag = lang
        ? new RegExp(`(<link\\b[^>]*\\brel="${re(rel)}"[^>]*\\bhreflang="${re(lang)}"[^>]*\\bhref=")[^"]*(")`, 'g')
        : new RegExp(`(<link\\b[^>]*\\brel="${re(rel)}"(?![^>]*\\bhreflang=)[^>]*\\bhref=")[^"]*(")`, 'g')
      out = out.replace(tag, (_m, a, b) => a + attr(v) + b)
    } else {
      out = out.replace(new RegExp(`(<meta\\b[^>]*\\b(?:name|property)="${re(k)}"[^>]*\\bcontent=")[^"]*(")`, 'g'), (_m, a, b) => a + attr(v) + b)
    }
  }
  if (s.jsonld !== undefined) out = out.replace(/(<script\b[^>]*\bid="record-ld"[^>]*>)[\s\S]*?(<\/script>)/, (_m, a, b) => a + script(s.jsonld!) + b)
  if (s.data !== undefined) out = out.replace(/(<script\b[^>]*\bid="record-data"[^>]*>)[\s\S]*?(<\/script>)/, (_m, a, b) => a + script(s.data!) + b)
  // A SLOT IS EMPTY IN THE TEMPLATE, by construction (`<div data-slot="x"></div>`), so the fill matches the empty
  // element exactly and cannot stop at the wrong </div> of nested markup. A comment sentinel would not survive:
  // Vue's production compiler strips comments from the page.
  for (const [x, v] of Object.entries(s.html ?? {}))
    out = out.replace(new RegExp(`(<div\\b[^>]*\\bdata-slot="${re(x)}"[^>]*>)(<\\/div>)`), (_m, a, b) => a + v + b)
  return out
}
