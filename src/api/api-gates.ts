// API GATES — every API the registry holds is a gate, and its kind decides what the gate may touch.
//
//   online      a remote endpoint with a URL: checked by scripts/api-gates.ts only when it is asked, never on a commit
//   fs          a file this tree holds: checked on every run, because it reads the disk and nothing else
//   gated       a source that needs a credential, a licence, or has no anonymous endpoint: named, never requested
//
// PURE. Imports the registry and nothing that reaches a network, so the derivation is safe to run anywhere.
import { ADAPTERS, type Adapter } from './adapters.ts'

export type ApiGateKind = 'online' | 'fs' | 'gated'

/** The kind of one API gate, derived from the adapter: a path makes it a filesystem gate, a URL an online one. */
export const apiGateKind = (a: Adapter): ApiGateKind => (a.path ? 'fs' : a.url ? 'online' : 'gated')

/** One gate per adapter, named `api:<adapter name>`. */
export const apiGates = (): { gate: string; name: string; kind: ApiGateKind; host: string }[] =>
  ADAPTERS.map((a) => ({ gate: `api:${a.name}`, name: a.name, kind: apiGateKind(a), host: a.host }))
