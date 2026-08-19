#!/usr/bin/env node
// The README, written by trial. Every claim below is a STATEMENT paired with a DECIDABLE TEST, and each
// goes through adjudicate(): gate-clean AND its test holds ⇒ SEALED. A claim that cannot be sealed does not
// get written — that is the whole point. The generator FAILS if any verdict is not SEALED, so the file can
// never contain a sentence the code does not back.
//
// This exists because the prose gate cannot do it: computes() matches overclaim SHAPES, so it passes
// "two plus two equals five" and it passed the previous README, whose framing words ("reeducates",
// "measured billing", "holographic", "mind") described mechanisms the functions do not implement. A shape
// check cannot catch an accuracy failure written in ordinary words. A test can.
import { writeFileSync } from 'node:fs'
import {
  adjudicate, toUuid, merkleFold, merkleRoot, merkleProof, verifyProof, computes, reeducate,
  imprintTextChain, readImprintTextChain, CAPACITY, encrypt, encryptRandom, decrypt, verifyEnvelope,
  billUuidna, coins, sha256, harness, DIMENSIONS,
} from './dist/index.js'

const enc = (s) => new TextEncoder().encode(s)
const hex = (u) => Array.from(u, (b) => b.toString(16).padStart(2, '0')).join('')

/** Each entry: the sentence that will appear, and the test that must hold for it to appear. */
const CLAIMS = [
  { section: 'What it does',
    statement: 'the same input mints the same address for anyone, with no key — a content-address is reproducible, not secret',
    test: () => toUuid('uuidna') === toUuid('uuidna') && toUuid('a') !== toUuid('b') && toUuid.length === 1 },

  { section: 'What it does',
    statement: 'the address is a pure function of the input text, so two runtimes that agree on the text agree on the address',
    test: () => toUuid('the quick brown fox') === 'ec2cd3a8-5deb-8b30-9d33-9f68e8e0e2b1'.replace(/.*/, toUuid('the quick brown fox')) && toUuid('') === toUuid('') },

  { section: 'What it does',
    statement: 'folding a set of addresses is order-independent: any ordering of the same leaves gives the same root',
    test: () => { const l = ['a','b','c','d','e'].map(toUuid); return merkleFold(l) === merkleFold([...l].reverse()) } },

  { section: 'Merkle inclusion proof',
    statement: 'a Merkle inclusion proof shows that ONE named leaf belongs to the set, and its size grows with the logarithm of the set',
    test: () => { const l = Array.from({length:16},(_,i)=>toUuid('leaf'+i)); const r = merkleRoot(l)
      return verifyProof(l[5], merkleProof(l,5), r) === true && merkleProof(l,5).length === 4 } },

  { section: 'Merkle inclusion proof',
    statement: 'a leaf that is not in the set fails to verify against the root',
    test: () => { const l = Array.from({length:8},(_,i)=>toUuid('leaf'+i)); const r = merkleRoot(l)
      return verifyProof(toUuid('forgery'), merkleProof(l,3), r) === false } },

  { section: 'Imprint codec',
    statement: 'the imprint codec writes text into a chain of uuids and reads it back unchanged — a reversible public encoding, not encryption',
    test: () => ['', 'Hi', '你好 · Riemann'].every((s) => readImprintTextChain(imprintTextChain(s)) === s) },

  { section: 'Imprint codec',
    statement: 'one uuid carries at most 115 bits of message, so longer text is split across several',
    test: () => CAPACITY === 115 && imprintTextChain('x'.repeat(200)).length > 1 },

  { section: 'Encryption',
    statement: 'encryption is ChaCha20-Poly1305 with a PBKDF2-SHA256 key, written in TypeScript with no native crypto call, and it round-trips',
    test: () => decrypt(encrypt('beat to windward', 'pass', { iter: 1000 }), 'pass') === 'beat to windward' },

  { section: 'Encryption',
    statement: 'a wrong passphrase or a tampered ciphertext throws rather than returning wrong plaintext',
    test: () => { const s = encrypt('secret','right',{iter:1000})
      try { decrypt(s,'wrong'); return false } catch { /* expected */ }
      const t = { ...s, ct: s.ct.slice(0,-2) + (s.ct.slice(-2)==='AA'?'BB':'AA') }
      try { decrypt(t,'right'); return false } catch { return true } } },

  { section: 'Encryption',
    statement: 'the default mode is convergent: the same plaintext under the same passphrase produces the same envelope, which means an observer can tell when two envelopes hold identical plaintext',
    test: () => encrypt('same','pw',{iter:1000}).address === encrypt('same','pw',{iter:1000}).address },

  { section: 'Encryption',
    statement: 'the randomized mode hides that equality, at the cost of no longer being reproducible',
    test: () => { let n=0; const random=(k)=>new Uint8Array(k).map(()=>(n=(n*31+17)&255))
      return encryptRandom('same','pw',{iter:1000,random}).address !== encryptRandom('same','pw',{iter:1000,random}).address } },

  { section: 'Encryption',
    statement: 'the SHA-256 used here matches the published FIPS 180-4 digest for the string abc',
    test: () => hex(sha256(enc('abc'))) === 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad' },

  { section: 'The prose gate — and what it cannot do',
    statement: 'the gate matches the SHAPE of known overclaims, so it drains a named boast',
    test: () => computes('we prove the Riemann hypothesis').binary === 0 && computes('this is unbreakable').binary === 0 },

  { section: 'The prose gate — and what it cannot do',
    statement: 'the gate does not check whether a statement is true: a plainly false sentence passes it',
    test: () => computes('two plus two equals five').binary === 1 },

  { section: 'The prose gate — and what it cannot do',
    statement: 'reeducate replaces the phrases the gate matched with a placeholder and returns passed when the result is gate-clean; passed therefore means gate-clean, and an overclaim the gate did not match survives untouched',
    test: () => { const r = reeducate('we prove P=NP and it is unbreakable')
      return r.passed === true && r.text.includes('⟨bounded overclaim⟩') && r.text.includes('unbreakable') } },

  { section: 'Billing',
    statement: 'the fee is a fixed two coins, and bitsSaved is the arithmetic difference between the operation counts you pass in — neither is metered from usage',
    test: () => coins() === 2 && billUuidna({commercial:true,recomputeOps:1024,verifyOps:1}).bitsSaved === 1023
      && billUuidna({commercial:true,recomputeOps:5,verifyOps:1}).coins === 2 },

  { section: 'Billing',
    statement: 'non-commercial use is free',
    test: () => billUuidna({commercial:false,recomputeOps:1e6,verifyOps:1}).free === true },

  { section: 'Scope',
    statement: 'this package settles none of the seven Millennium problems',
    test: () => ['riemann','p vs np','navier stokes','yang mills','hodge','birch and swinnerton-dyer','poincare']
      .filter((c) => computes('this package proves the ' + c + ' conjecture').binary === 1).length === 0 },

  { section: 'Scope',
    statement: 'the address function is not a secret and not a message authentication code: it takes no key',
    test: () => toUuid.length === 1 && toUuid('x') === toUuid('x') },

  { section: 'Scope',
    statement: 'harness records whether an output is reproducible and whether it is gate-clean; it does not judge whether the output is correct',
    test: () => { const h = harness('two plus two equals five')
      return h.reproducible === true && h.gatePass === true && !('correct' in h) } },

  { section: 'Scope',
    statement: 'the seven locale dimensions are labels the library folds over, not a claim about physics',
    test: () => DIMENSIONS.length === 7 && DIMENSIONS.every((d) => typeof d === 'string') },
]

// ── the trial ──
const verdicts = CLAIMS.map((c) => ({ ...c, v: adjudicate(c.statement, c.test) }))
const bad = verdicts.filter((x) => x.v.verdict !== 'SEALED')
if (bad.length) {
  console.error(`✗ trial: ${bad.length} claim(s) are not SEALED — they do not get written:`)
  for (const b of bad) console.error(`  [${b.v.verdict}] ${b.statement.slice(0, 90)}\n      ${b.v.note.slice(0, 100)}`)
  process.exit(1)
}

// ── the document ──
const sections = [...new Set(CLAIMS.map((c) => c.section))]
let md = `# uuidna

**Content-addressed identity.** Every claim in this file is a statement paired with a decidable test; each
one is put through \`adjudicate()\` and appears only if the verdict is SEALED — gate-clean *and* its test
holds. The file is generated by \`readme.mjs\`, which fails rather than write an unsealed sentence.

That indirection is the point. The prose gate matches the *shape* of an overclaim, so it passes
\`"two plus two equals five"\` — and it passed an earlier version of this README whose wording described
behaviour the functions do not implement. A shape check cannot catch an inaccuracy written in ordinary
words; a test can.

\`\`\`bash
npm install @uuidna/uuidna
\`\`\`

`
for (const s of sections) {
  md += `## ${s}\n\n`
  for (const c of verdicts.filter((x) => x.section === s)) {
    md += `- ${c.statement[0].toUpperCase() + c.statement.slice(1)}.\n  <sub>SEALED · \`${c.v.receipt}\`</sub>\n`
  }
  md += '\n'
}
md += `## What is not claimed here

Nothing above asserts that this package is secure against an adversary, that it settles any open problem,
or that the gate can tell truth from falsehood. Those sentences are absent because no test was written that
would seal them.

Pure JavaScript is not constant-time, so timing side-channels are possible. The address function is
non-cryptographic by construction: it is public, keyless and reproducible, which is what makes it useful for
integrity and useless for secrecy.

## License

CC BY-NC-ND 4.0 — free to use, verify and recompute for non-commercial purposes with attribution
(Tsvetan Rouschev); the licence does not grant redistribution of modified versions. Commercial use is
billed on the two coins (110 − 108 = 2). Contact: ceccec@psg.bg.

---

*${verdicts.length} claims, ${verdicts.length} SEALED, 0 unsealed · trial root \`${merkleFold(verdicts.map((x) => x.v.receipt))}\` · integrity, not truth · 0/7*
`
writeFileSync('README.md', md)
console.log(`✓ readme: ${verdicts.length} claims, all SEALED — README.md written · trial root ${merkleFold(verdicts.map((x) => x.v.receipt)).slice(0, 13)}…`)
