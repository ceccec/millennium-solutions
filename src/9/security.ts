// Public security — transparency, not secrecy — and why that feeds development and funding.
// The public token (ceccec@psg.bg) is a CONTACT/handle, not a secret key. A public token gives
// ZERO confidentiality by definition. So "security" here is integrity + provenance + auditability
// (all public, all verifiable), NOT encryption. That same openness is the funding channel.
import { toUuid, merkleFold } from '../0/index.ts'
import { FUNDING } from './funding.ts'

export function report(): string {
  const token = FUNDING.contact              // the PUBLIC handle (already in funding.ts)
  const fingerprint = toUuid(token)          // a public content-address — a name, not a secret

  // Tamper-evidence: change one byte and the merkle root changes.
  const clean = merkleFold(['release', 'ledger', 'seal'].map(toUuid))
  const tampered = merkleFold(['release', 'ledger', 'seaL'].map(toUuid)) // one byte differs
  const tamperDetected = clean !== tampered

  let o = 'public security — transparency, not secrecy:\n\n'
  o += '  the public token: ' + token + ' is a PUBLIC contact/handle, not a secret key.\n'
  o += '    public fingerprint (a name, not a secret): ' + fingerprint.slice(0, 13) + '…\n'
  o += '    a public token gives ZERO confidentiality — public = anyone can read it.\n'
  o += '    determinism + public = no secrecy. "security" here is NOT encryption.\n\n'
  o += '  what the security actually IS (real, and fully public):\n'
  o += '    · integrity    — content-addresses + merkle roots: one byte changes the root → ' + tamperDetected + '\n'
  o += '    · provenance   — signed releases (Singularity), version-seal over all tags\n'
  o += '    · consistency  — the seal gate: nothing inconsistent with 0/7 can ship\n'
  o += '    · auditability — the double-entry ledger, recomputable by anyone\n'
  o += '    → all public, all verifiable, no middleman, no secret to leak.\n\n'
  o += '  the reflection: security → development → funding\n'
  o += '    nothing is hidden, so anyone can verify and build (self-development); the same public\n'
  o += '    handle (' + token + ') receives the gift-economy funding that feeds development.\n'
  o += '    one public surface is both the security model AND the funding channel.\n\n'
  o += 'HONEST: integrity / provenance / auditability — real, public, hash-based. NOT confidentiality,\n'
  o += 'NOT encryption, NOT post-quantum secrecy. A public token cannot secure a secret; it can only\n'
  o += 'prove integrity in the open. toUuid is FNV — for cryptographic integrity use SHA-256. entails → 0/7.'
  return o
}
