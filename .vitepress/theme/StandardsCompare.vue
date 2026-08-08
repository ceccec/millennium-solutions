<script setup lang="ts">
// Honest side-by-side: the cryptographic/identity standards vs this deposit's
// content-address (FNV-1a). Every cell is a factual property, not a ranking.
// The point the table makes visible: the deposit is NOT in the security race —
// it is a public, reproducible content-address, and its hash is non-cryptographic
// by design. "Most secure" is unclaimable because standards break (MD5, SHA-1 fell).
import { toUuid } from '../../src/0/index.ts'

// A live sample so the reader sees the deposit's actual output next to the claims.
const sample = toUuid('the whole rosetta state, from one point of view')

type Cell = 'yes' | 'no' | 'warn' | 'na'
interface Row {
  name: string
  note: string
  deterministic: Cell
  keyed: Cell
  secure: Cell
  confidential: Cell
  integrity: Cell
  publicRepro: Cell
  size: string
  status: string
  purpose: string
}

const rows: Row[] = [
  { name: 'UUID v4 (random)', note: 'RFC 9562', deterministic: 'no', keyed: 'no', secure: 'na', confidential: 'no', integrity: 'no', publicRepro: 'no', size: '122-bit', status: 'current', purpose: 'random identifier' },
  { name: 'UUID v5 (SHA-1)', note: 'namespaced', deterministic: 'yes', keyed: 'no', secure: 'warn', confidential: 'no', integrity: 'warn', publicRepro: 'yes', size: '122-bit', status: 'SHA-1 broken (SHAttered)', purpose: 'namespaced identifier' },
  { name: 'SHA-256', note: 'FIPS 180-4', deterministic: 'yes', keyed: 'no', secure: 'yes', confidential: 'no', integrity: 'yes', publicRepro: 'yes', size: '256-bit', status: 'current', purpose: 'integrity digest' },
  { name: 'HMAC-SHA-256', note: 'RFC 2104', deterministic: 'yes', keyed: 'yes', secure: 'yes', confidential: 'no', integrity: 'yes', publicRepro: 'no', size: '256-bit', status: 'current', purpose: 'message authentication' },
  { name: 'AES-256-GCM', note: 'FIPS 197', deterministic: 'no', keyed: 'yes', secure: 'yes', confidential: 'yes', integrity: 'yes', publicRepro: 'no', size: 'variable', status: 'current', purpose: 'confidentiality + auth' },
  { name: 'Signal (E2E)', note: 'X3DH + Double Ratchet', deterministic: 'no', keyed: 'yes', secure: 'yes', confidential: 'yes', integrity: 'yes', publicRepro: 'no', size: 'variable', status: 'current', purpose: 'secure messaging' },
  { name: 'MD5', note: 'RFC 1321', deterministic: 'yes', keyed: 'no', secure: 'no', confidential: 'no', integrity: 'warn', publicRepro: 'yes', size: '128-bit', status: 'broken (collisions)', purpose: 'legacy digest' },
]

// This deposit — separated so the reader reads it against the standards, not among them.
const local: Row = {
  name: 'toUuid — this deposit', note: 'FNV-1a, content-address', deterministic: 'yes', keyed: 'no', secure: 'no', confidential: 'no', integrity: 'yes', publicRepro: 'yes', size: '122-bit', status: 'non-cryptographic by design', purpose: 'content-addressing / identity',
}

const cols = [
  { key: 'deterministic', label: 'Deterministic', hint: 'same input → same output' },
  { key: 'keyed', label: 'Keyed / secret', hint: 'needs a secret key' },
  { key: 'secure', label: 'Cryptographically secure', hint: 'preimage- & collision-resistant vs an adversary' },
  { key: 'confidential', label: 'Hides content', hint: 'confidentiality' },
  { key: 'integrity', label: 'Detects tampering', hint: 'integrity' },
  { key: 'publicRepro', label: 'Public & reproducible', hint: 'anyone can recompute it, no key' },
] as const

const mark: Record<Cell, string> = { yes: '✓', no: '✗', warn: '△', na: '—' }
const cls: Record<Cell, string> = { yes: 'y', no: 'n', warn: 'w', na: 'x' }
</script>

<template>
  <div class="cmp">
    <div class="cmp-scroll">
      <table>
        <thead>
          <tr>
            <th class="name">Scheme</th>
            <th v-for="c in cols" :key="c.key" :title="c.hint">{{ c.label }}</th>
            <th>Size</th>
            <th>Status</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.name">
            <td class="name"><strong>{{ r.name }}</strong><span class="note">{{ r.note }}</span></td>
            <td v-for="c in cols" :key="c.key" :class="cls[(r as any)[c.key] as Cell]">{{ mark[(r as any)[c.key] as Cell] }}</td>
            <td class="mono">{{ r.size }}</td>
            <td class="status">{{ r.status }}</td>
            <td class="purpose">{{ r.purpose }}</td>
          </tr>
          <tr class="local">
            <td class="name"><strong>{{ local.name }}</strong><span class="note">{{ local.note }}</span></td>
            <td v-for="c in cols" :key="c.key" :class="cls[(local as any)[c.key] as Cell]">{{ mark[(local as any)[c.key] as Cell] }}</td>
            <td class="mono">{{ local.size }}</td>
            <td class="status">{{ local.status }}</td>
            <td class="purpose">{{ local.purpose }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="legend"><span class="y">✓</span> yes · <span class="n">✗</span> no · <span class="w">△</span> qualified · <span class="x">—</span> not applicable</p>

    <div class="live">
      <span>The deposit's actual output for one input:</span>
      <code>{{ sample }}</code>
    </div>

    <p class="foot">
      The deposit's row is honest about being <strong>non-cryptographic</strong>: its FNV-1a hash offers no secrecy and would fall
      at once to an adversary — but it never claimed secrecy. It does not lose the security race; it is not in it. It is a public,
      reproducible <strong>content-address</strong> — quantum in <em>structure</em> (a receipted set of 7-dimensional perspectives),
      computed classically. For confidentiality, authentication, or secure messaging, the standards above are the right tools; the
      deposit does not compete there. And note the <strong>Status</strong> column: MD5 and SHA-1 broke under cryptanalysis, which is
      exactly why no system is "the most secure" — security is provisional. The deposit claims fitness for content-addressing, not
      supremacy. A content-address proves integrity, not truth.
    </p>
  </div>
</template>

<style scoped>
.cmp { margin: 1.25rem 0; }
.cmp-scroll { overflow-x: auto; border: 1px solid var(--vp-c-divider); border-radius: 10px; }
table { width: 100%; border-collapse: collapse; font-size: 0.86rem; min-width: 780px; }
th, td { padding: 0.5rem 0.6rem; text-align: center; border-bottom: 1px solid var(--vp-c-divider); white-space: nowrap; }
thead th { position: sticky; top: 0; background: var(--vp-c-bg-soft); font-weight: 600; cursor: help; }
td.name, th.name { text-align: left; white-space: normal; min-width: 180px; }
td.name .note { display: block; font-size: 0.72rem; color: var(--vp-c-text-2); font-weight: 400; }
td.mono { font-variant-numeric: tabular-nums; color: var(--vp-c-text-2); }
td.status, td.purpose { text-align: left; white-space: normal; color: var(--vp-c-text-2); font-size: 0.8rem; }
tr.local { background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent); }
tr.local td { border-top: 2px solid var(--vp-c-brand-1); }
.y { color: #16a34a; font-weight: 700; }
.n { color: #dc2626; font-weight: 700; }
.w { color: #d97706; font-weight: 700; }
.x { color: var(--vp-c-text-3); }
.legend { font-size: 0.8rem; color: var(--vp-c-text-2); margin: 0.5rem 0 0; }
.live { margin-top: 0.9rem; display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; font-size: 0.82rem; color: var(--vp-c-text-2); }
.live code { font-size: 0.82rem; }
.foot { margin-top: 1rem; font-size: 0.85rem; line-height: 1.6; color: var(--vp-c-text-2); border-left: 3px solid var(--vp-c-brand-1); padding-left: 0.9rem; }
</style>
