#!/usr/bin/env node
/** ── THE LEGAL CITATIONS THIS DEPOSIT RESTS ON, CHECKED AGAINST ONE DECLARATION ───────────────────────────
 *
 *  Found by scripts/blind.ts, not by anyone here: a seeded trial moved one digit in src/proof/rights.lean,
 *  turning `EPC Art. 52(2)(a)` into `Art. 53(2)(a)`, and the whole gate chain stayed green. Article 52 is
 *  what may be patented; Article 53 is a different provision entirely. The rights table names specific legal
 *  instruments as the reason each right is claimed or refused, and nothing checked that the article numbers
 *  were the ones it meant. Fifty-three hand-written controls never touched it, because I wrote all
 *  fifty-three and I was not going to test the defect I could not imagine.
 *
 *  THE DECLARATION BELOW IS THE ONE HAND-WRITTEN THING, and that is deliberate. Every citation appearing
 *  anywhere in the record must be one of these; a digit that drifts becomes a citation that is not declared,
 *  and this refuses. The table is small, it is reviewed as prose, and it is the single place a reader has to
 *  check to know which instruments the deposit is standing on.
 *
 *  It does NOT verify that the articles say what the deposit says they say. Nothing here can: that is a
 *  reading of external law, it is not decidable, and claiming otherwise would be the overclaim this gate is
 *  built to prevent. What it decides is that the record cites the same instruments everywhere, and only the
 *  ones somebody declared.
 */
import { readFileSync, readdirSync } from 'node:fs'

/** The instruments this deposit relies on. Each entry is the citation EXACTLY as the record may write it. */
const DECLARED = new Set([
  'Berne Convention Art. 5(2)',   // rights arise without formality — the hinge of the whole table
  'Berne Art. 5(2)',
  'Berne Art. 6bis',              // moral rights: attribution and integrity
  'Paris Art. 6',                 // registered marks — a registry's act
  'Paris Art. 6bis',              // well-known marks, arising from use
  'Directive 96/9/EC Art. 7',     // the sui generis database right
  'Directive 96/9/EC',
  'EPC Art. 52(2)(a)',            // mathematical methods as such are excluded from patentability
  'Elements IX.36',               // Euclid, the even perfect numbers
  'RFC 9562',                     // the UUID format this deposit shapes its addresses to
  'RFC 4231',                     // the HMAC-SHA256 test vectors
  // The standards the uuidna package implements and tests against. Each label is read from the line that
  // cites it in this repository, not from memory — what an RFC number means is exactly the kind of fact a
  // confident recollection gets subtly wrong, and this file exists because of a digit that drifted.
  'RFC 8439',                     // ChaCha20-Poly1305 — the AEAD test vector the pure-TS implementation matches
  'RFC-4122',                     // the older UUID spec: the variant nibble, 8/9/a/b
  'RFC 7914',                     // scrypt — its section 11 PBKDF2-HMAC-SHA256 sixty-four-byte vector
  'RFC 2104',                     // HMAC
  'RFC 8018',                     // PBKDF2-HMAC-SHA256
  'RFC 6234',                     // SHA-256 / HMAC-SHA256
  'RFC 6070',                     // the PBKDF2 test vectors
  'RFC 4287',                     // Atom — the syndication feed the monographs are exposed as
  'RFC-3339',                     // the timestamp format, taken from git rather than from a clock
  'RFC 8032',                     // Ed25519 — the signature scheme, and the §7.1 vectors crypto-kat checks against
  'RFC 4122',                     // the 2005 UUID spec RFC 9562 obsoletes, named where the layout's history matters
  'RFC 6962',                     // Certificate Transparency §2.1 — the leaf/node domain separation (0x00/0x01) merkleFold was missing, cited where that repair is recorded
])

// WHOLE CITATIONS, NOT A PREFIX PLUS AN OPTIONAL TAIL. The first version matched an instrument name, then
// up to four filler characters, then an optional number — and read `RFC 9562` as `RFC 956`, reporting nine
// undeclared citations that were the regex chopping digits off real ones. Each alternative below matches a
// complete citation or nothing, which is the same lesson the domain parser in vacuity.ts learned: a pattern
// assembled from fragments matches fragments.
const CITE = new RegExp([
  String.raw`Berne(?: Convention)?\s+Art\.\s*\d+[a-z]*(?:\(\d+\))?`,
  String.raw`Paris\s+Art\.\s*\d+[a-z]*(?:\(\d+\))?`,
  String.raw`EPC\s+Art\.\s*\d+[a-z]*(?:\(\d+\))?(?:\([a-z]\))?`,
  String.raw`Directive\s+\d+/\d+/[A-Z]+(?:\s+Art\.\s*\d+)?`,
  String.raw`Madrid\s+Protocol`,
  String.raw`RFC[-\s]?\d{3,5}`,
  String.raw`Elements\s+[IVX]+\.\d+`,
].join('|'), 'g')

const files: string[] = []
const walk = (d: string): void => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    if (/^(node_modules|\.git|\.vitepress|dist|en|bg|de|es|fr|ru|zh)$/.test(e.name)) continue
    const p = `${d}/${e.name}`.replace(/^\.\//, '')
    if (e.isDirectory()) walk(p)
    else if (/\.(lean|md|ts)$/.test(e.name)) files.push(p)
  }
}
walk('.')

const seen = new Map<string, string[]>()
for (const f of files) {
  // Two files hold citations that are not USES of them: this one declares the permitted set, and gates-fire
  // carries a drifted article as the payload of this gate's own control. Scanning either makes the gate
  // report its own machinery — and the control, whose whole job is to be a wrong citation, would keep the
  // build red forever.
  if (/scripts\/(?:citations-gate|gates-fire)\.ts$/.test(f)) continue
  for (const m of readFileSync(f, 'utf8').matchAll(CITE)) {
    const c = m[0].replace(/\s+/g, ' ').trim().replace(/[,;:]$/, '')
    if (!/\d/.test(c)) continue                            // a bare instrument name cites no article
    seen.set(c, [...(seen.get(c) ?? []), f])
  }
}

const undeclared = [...seen].filter(([c]) => !DECLARED.has(c))
if (undeclared.length) {
  console.log(`✗ citations-gate: ${undeclared.length} legal or standards citation(s) appear in the record and are not`)
  console.log(`  declared in scripts/citations-gate.ts. Either the citation drifted, or a new instrument was`)
  console.log(`  relied on and nobody wrote it down — and from the record alone those look identical:`)
  for (const [c, where] of undeclared) console.log(`    "${c}"  in ${[...new Set(where)].slice(0, 3).join(', ')}`)
  process.exit(1)
}

const unused = [...DECLARED].filter((d) => !seen.has(d))
console.log(`✓ citations-gate: ${seen.size} citation(s) in the record, every one of them declared.`)
if (unused.length) console.log(`  ${unused.length} declared and not currently cited: ${unused.join(', ')}`)
console.log(`  This decides that the record cites the instruments somebody declared and cites them the same way`)
console.log(`  everywhere. It does NOT decide that those articles say what the deposit says they say — that is a`)
console.log(`  reading of external law, and no gate here can settle it.`)
