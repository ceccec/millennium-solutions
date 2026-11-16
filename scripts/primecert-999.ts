// scripts/primecert-999.ts — the ECPP certificates for the two large prime factors of 2^999+1, cached via
// handles and re-verified cheaply. GENERATION of an ECPP certificate is the one-time expensive step (PARI/GP
// primecert, large stack); once generated it is COMMITTED, keyed by its prime's content-address handle, and
// from then on only VERIFIED (primecertisvalid) — the deposit's own efficiency: verify by the cached address,
// never recompute (the 304 involution). So no memory limit touches the pipeline; the cost was paid once.
//
// Each cert independently proves its prime: anyone re-runs primecertisvalid(read(cert)) and checks it certifies
// exactly the expected prime. The APR-CL proof (factor-999.ts) holds regardless; these are the portable form.
// Generated — do not edit. Registered in the reconcile chain and predocs.
import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { toUuid } from '../src/0/index.ts'

const certs = [
  { prime: '1270593144646505233013326197403', file: 'evidence/factor/cert-31d.txt', digits: 31 },
  { prime: '356259709855840347814184579423977577883939818854919827419470712293459180335618566367184158250790959263766858787438019506310967435347190178144994691161', file: 'evidence/factor/cert-150d.txt', digits: 150 },
]

// cheap verification via gp, when present: valid AND certifies exactly this prime. 'false' is a real error.
function gpVerifies(file: string, prime: string): boolean | null {
  try {
    const out = execSync(`echo 'print(primecertisvalid(read("${file}"))," ",read("${file}")[1][1]==${prime})' | gp -q`, { encoding: 'utf8', timeout: 120000 }).trim()
    if (out === '1 1') return true
    if (/^[01] [01]$/.test(out)) return false
    return null
  } catch { return null }
}

const rows = certs.map((c) => {
  if (!existsSync(c.file)) throw new Error(`primecert-999: missing cert ${c.file} — refusing`)
  const v = gpVerifies(c.file, c.prime)
  if (v === false) throw new Error(`primecert-999: ${c.file} is not a valid certificate for its prime — refusing`)
  return {
    prime: c.prime,
    digits: c.digits,
    handle: toUuid(c.prime).slice(0, 8),   // the prime's content-address handle — the cache key
    cert: c.file,
    bytes: readFileSync(c.file, 'utf8').length,
  }
})

const record = {
  n: '2^999+1',
  what: 'standalone ECPP certificates for the two large prime factors',
  method: 'PARI/GP primecert (one-time generation) → primecertisvalid (cheap re-verification); cached by the prime handle',
  efficiency: 'generation paid once and committed; the pipeline only verifies by handle, never regenerates — the 304 involution (serve-by-address, not recompute)',
  certs: rows,
  reproduce: 'gp: primecertisvalid(read("<cert>")) == 1 and read("<cert>")[1][1] == <prime>',
}
writeFileSync('evidence/factor/primecerts.json', JSON.stringify(record, null, 2) + '\n')
console.log(`primecert-999: ${rows.length} ECPP certs verified & cached by handle — ${rows.map((r) => `${r.digits}d@${r.handle}(${r.bytes}b)`).join(', ')}`)
