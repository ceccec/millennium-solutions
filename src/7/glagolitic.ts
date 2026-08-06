// Seven-star rosette · Glagolitic · the sequence — documented facts, then the overlay.
// Sources:
//   Glagolitic numerals (letters carry values by alphabet order): en.wikipedia.org/wiki/Glagolitic_numerals
//   Pliska rosette (seven-rayed bronze artifact, found 1961, 7th–9th c.): en.wikipedia.org/wiki/Pliska_rosette
import { toUuid, merkleFold } from '../0/index.ts'

// FACT: the first nine Glagolitic letters ARE the numerals 1–9 (value = alphabet position),
// and together they read as a sentence. Glyph · name · value.
const GLAGOLITIC: { g: string; name: string; v: number }[] = [
  { g: 'Ⰰ', name: 'Az', v: 1 },       // "I"
  { g: 'Ⰱ', name: 'Buky', v: 2 },     // "letters"
  { g: 'Ⰲ', name: 'Vede', v: 3 },     // "know"
  { g: 'Ⰳ', name: 'Glagoli', v: 4 },  // "speak"
  { g: 'Ⰴ', name: 'Dobro', v: 5 },    // "good"
  { g: 'Ⰵ', name: 'Jest', v: 6 },     // "is"
  { g: 'Ⰶ', name: 'Zhivete', v: 7 },  // "live"
  { g: 'Ⰷ', name: 'Dzelo', v: 8 },    // "very"
  { g: 'Ⰸ', name: 'Zemlja', v: 9 },   // "earth"
]
const name = (v: number) => GLAGOLITIC.find(x => x.v === v)?.name ?? String(v)

// The seven-rayed Pliska rosette: one scholarly conjecture reads the rays as the classical
// seven bodies (meaning is debated). Seven rays = the rosette / (ℤ/7)* / the Clay seven.
const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']

export function report(): string {
  const seqRoot = merkleFold(GLAGOLITIC.map(x => toUuid(x.name + ':' + x.v)))

  let o = 'seven-star rosette · Glagolitic · the sequence:\n\n'
  o += '  Glagolitic numerals — the first nine letters ARE 1–9 (value = alphabet order):\n'
  GLAGOLITIC.forEach(x => { o += '    ' + x.v + '  ' + x.g + '  ' + x.name + '\n' })
  o += '  the nine read as one sentence: "Az buky vede glagoli dobro jest zhivete dzelo zemlja"\n'
  o += '  ≈ "I who know letters say: it is good to live on earth." (documented)\n\n'
  o += '  → the nine map exactly onto the ℤ/9 vortex digits. the doubling circuit, in Glagolitic:\n'
  o += '    ' + [1, 2, 4, 8, 7, 5].map(v => name(v)).join(' → ') + '\n'
  o += '  ten\'s-complement reflection (fixed point 5 = Dobro):\n'
  o += '    ' + [[1, 9], [2, 8], [3, 7], [4, 6]].map(([a, b]) => name(a) + '↔' + name(b)).join(' · ') + ' · Dobro fixed\n\n'
  o += '  Pliska seven-rayed rosette (bronze, found 1961, 7th–9th c., 38 mm):\n'
  o += '    seven rays; a scholarly conjecture reads them as the classical seven (debated):\n'
  o += '    ' + PLANETS.join(' · ') + '\n'
  o += '    → maps onto the 7 rosette rays / (ℤ/7)* / the Clay seven.\n\n'
  o += '  sequence content-address (the nine, sealed): ' + seqRoot.slice(0, 13) + '…\n\n'
  o += 'HONEST — two distinct scripts, not one:\n'
  o += '  the Pliska rosette bears PROTO-BULGAR runiform signs (Murfatlar type) + the IYI mark,\n'
  o += '  NOT Glagolitic. Glagolitic is a separate 9th-c. Slavic alphabet. Both are early-medieval\n'
  o += '  Bulgarian; joining them (and the ℤ/9 sequence) is CULTURAL PERSPECTIVE (RESEARCH §12),\n'
  o += '  not a documented equivalence. What IS documented: Glagolitic\'s sequential numerals 1–9,\n'
  o += '  and the seven-rayed rosette artifact. The arithmetic overlay is exact; the fusion is\n'
  o += '  interpretation. entails → 0/7.'
  return o
}
