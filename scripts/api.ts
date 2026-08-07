#!/usr/bin/env node
// The single API path — EVERY outbound call is content-addressed (uuid) so it can be sealed, gated,
// and committed in wave batches. Two honest categories, each stamped:
//   • DATA  (apiFetch)  — fetch + honesty-gate the response + seal it. provenance of what was read.
//   • ACTION(apiAction) — invoke a command + seal the invocation+outcome. an audit record of what was done.
//
// BOUNDS, held honestly:
//   • a uuid enables the SEAL (integrity); it does NOT by itself pass the HONESTY gate — the CONTENT must
//     still be clean (a DRAINS is a DRAINS even with a uuid). seal = integrity, gate = honesty, both needed.
//   • live results are POINT-IN-TIME observations: the sealed record is committable as a timestamped ledger,
//     NOT a deterministic rebuildable artifact (re-fetch may differ). record the observation, not a guarantee.
import { execSync } from 'node:child_process'
import { toUuid } from '../src/0/index.ts'
import { computes } from './honesty-gate.ts'

export type ApiRecord = { kind: 'data' | 'action'; target: string; verdict: string; uuid: string; note: string }

const stamp = (kind: 'data' | 'action', target: string, verdict: string, seed: string, note: string): ApiRecord =>
  ({ kind, target, verdict, uuid: toUuid(kind + ':' + target + ':' + verdict + ':' + seed), note })

// RESPECT limits + honest reachability FORENSICS: classify the failure mode from what the response
// actually tells us. definite signals (429/403/404/5xx) classify cleanly; a TIMEOUT/DNS fail is
// AMBIGUOUS (blocked vs down vs my-network) -> INCONCLUSIVE, never concluded "blocked" from one probe.
const classify = (res: Response): string => {
  const reset = res.headers.get('x-ratelimit-reset'), remaining = res.headers.get('x-ratelimit-remaining')
  if (res.status === 429 || (res.status === 403 && remaining === '0')) {
    const ra = res.headers.get('retry-after')
    const wait = ra ? ra + 's' : reset ? '~' + Math.max(0, Math.round(+reset - Date.now() / 1000)) + 's' : 'unknown'
    return 'RATE-LIMITED (' + res.status + ') → honor backoff ' + wait + ', do not retry now'
  }
  if (res.status === 403) return 'FORBIDDEN 403 → possibly blocked or auth-required'
  if (res.status === 404) return 'NOT-FOUND 404 → endpoint moved/removed'
  if (res.status >= 500) return 'SERVER-ERROR ' + res.status + ' → their side, retry later'
  return 'HTTP ' + res.status + ' → retry'
}

// DATA: fetch, honesty-gate the body, content-address it. REACHED | INCONCLUSIVE | DRAINS.
export async function apiFetch(target: string): Promise<ApiRecord> {
  try {
    const res = await fetch(target, { signal: AbortSignal.timeout(8000), headers: { 'user-agent': 'millennium-wire (+https://ceccec.psg.bg/millennium-solutions/)' } })
    if (!res.ok) return stamp('data', target, 'INCONCLUSIVE', 'http' + res.status, classify(res))
    const body = await res.text()
    const gate = computes(body)
    return stamp('data', target, gate.binary ? 'REACHED' : 'DRAINS', body,
      gate.binary ? body.length + ' bytes · gate clean' : 'gate RED: ' + gate.hit)
  } catch (e: any) {
    return stamp('data', target, 'INCONCLUSIVE', String(e?.name), (e?.name || 'error') + ' → could not reach; retry')
  }
}

// DATA (POST): query a public API with a body, honesty-gate + content-address the response.
// same seal/gate/INCONCLUSIVE discipline as apiFetch — for read-only query endpoints (e.g. OSV vuln API).
export async function apiQuery(target: string, body: unknown): Promise<ApiRecord & { raw?: string }> {
  try {
    const res = await fetch(target, { method: 'POST', signal: AbortSignal.timeout(8000),
      headers: { 'content-type': 'application/json', 'user-agent': 'millennium-wire (+https://ceccec.psg.bg/millennium-solutions/)' }, body: JSON.stringify(body) })
    if (!res.ok) return stamp('data', target, 'INCONCLUSIVE', 'http' + res.status, classify(res))
    const text = await res.text()
    const gate = computes(text)
    return { ...stamp('data', target, gate.binary ? 'REACHED' : 'DRAINS', text, gate.binary ? text.length + ' bytes · gate clean' : 'gate RED: ' + gate.hit), raw: text }
  } catch (e: any) {
    return stamp('data', target, 'INCONCLUSIVE', String(e?.name), (e?.name || 'error') + ' → could not reach; retry')
  }
}

// ACTION: invoke a command, content-address the invocation + outcome (an audit record, not data).
export function apiAction(target: string, cmd: string): ApiRecord {
  try {
    execSync(cmd, { stdio: 'inherit' })
    return stamp('action', target, 'DONE', cmd, 'invoked')
  } catch (e: any) {
    return stamp('action', target, 'FAILED', cmd + ':' + (e?.message || ''), 'failed: ' + (e?.message || 'error'))
  }
}
