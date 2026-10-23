// THE ROUTER — which kind of question an input is, so the right checker answers it.
//
// Priority, first match wins:
//   integer      decimal or 0x-hexadecimal integer          → task_route (C2)
//   lean         a theorem statement with := ...            → lean_ask / lean_split (C1)
//   publication  a DOI                                       → doi-precedence (C3, SOURCED)
//   clay         names one of the six Clay problems         → UNKNOWN (open), with its status
//   text         anything else                              → formalise first, else UNKNOWN
// The router only classifies. It never answers.

export type Kind = 'integer' | 'lean' | 'publication' | 'clay' | 'text'

const CLAY = /riemann hypothesis|p\s*vs\.?\s*np|p\s*=\s*np|navier[\s\-–—]*stokes|yang[\s-–]*mills|hodge conjecture|birch\s+and\s+swinnerton|swinnerton-dyer|poincar[ée] conjecture/i

export const route = (input: string): Kind => {
  // Every dash variant (hyphen, non-breaking hyphen, figure dash, en dash, em dash, minus) is one dash before matching.
  const s = input.trim().replace(/[\u2010-\u2015\u2212]/g, '-')
  if (/^[+-]?\d+$/.test(s) || /^[+-]?0x[0-9a-fA-F]+$/.test(s)) return 'integer'
  if (/^\s*theorem\s/m.test(s) && s.includes(':=')) return 'lean'
  if (/\b10\.\d{4,}\/\S+/.test(s)) return 'publication'
  if (CLAY.test(s)) return 'clay'
  return 'text'
}
