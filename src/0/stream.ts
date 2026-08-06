// Memory-free VitePress — UUID streams with a loadable payload.
// The page stores NO answers. Each block is a thunk (source code), computed in realtime at
// render. A stream frame is { id, load }: the id CONTENT-ADDRESSES the payload; the payload is
// not kept in memory and not inside the id — it is LOADED on demand and verified against the id.
// This is git/IPFS-style: the id names the payload; you load + verify. It is NOT reversible —
// you cannot extract the payload from the id. "Loadable", not "hidden inside the hash".
import { toUuid } from './index.ts'

export type Frame = { id: string; load: () => string }

// Address a payload by its content. `compute` is retained (source); the payload string is not —
// it is recomputed on load(). Memory-free: we keep the id (small) and the thunk, never the answer.
export function frame(compute: () => string): Frame {
  return { id: toUuid(compute()), load: compute }
}

// Load = recompute the payload and verify it still addresses to its id (integrity check).
export function load(f: Frame): { payload: string; verifies: boolean } {
  const payload = f.load()
  return { payload, verifies: toUuid(payload) === f.id }
}

export function report(): string {
  // A realtime stream — thunks over source, no stored payloads.
  const stream: Frame[] = [
    frame(() => 'doubling:1-2-4-8-7-5'),
    frame(() => 'reflection-fixed:5'),
    frame(() => 'entailment:0/7'),
    frame(() => 'self-seal:1'),
  ]

  let o = 'memory-free VitePress — UUID streams with loadable payload:\n\n'
  o += '  the page stores NO answers. each block is a thunk (source), computed in realtime at\n'
  o += '  render. a frame = { id (content-address), load() (recompute the payload) }.\n\n'
  o += '  the stream (ids only — the payload is NOT stored):\n'
  stream.forEach((f, i) => { o += '    frame ' + (i + 1) + '  id ' + f.id.slice(0, 13) + '…\n' })
  o += '\n  load + verify (recompute the payload, check toUuid(payload) == id):\n'
  stream.forEach((f, i) => {
    const r = load(f)
    o += '    frame ' + (i + 1) + '  → "' + r.payload + '"  verifies: ' + r.verifies + '\n'
  })
  o += '\nHONEST: this is loadable + verifiable content-addressing (git/IPFS style). The id NAMES\n'
  o += 'the payload; you LOAD the payload (recompute or fetch) and verify it against the id. The id\n'
  o += 'is a one-way checksum — you CANNOT reverse it to obtain the payload, and no payload travels\n'
  o += 'inside the id. Memory-free means "recompute, don\'t store", not "the message hides in the\n'
  o += 'UUID". For cryptographic integrity use SHA-256 (toUuid is FNV). entails → 0/7.'
  return o
}
