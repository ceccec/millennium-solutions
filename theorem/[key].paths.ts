// Dynamic route: one page per discovered theorem (a stable, referrer-able URL /theorem/<key>).
// Each page also carries the hues of its SURROUNDING theorems (7 neighbours, wrapping the chain) so its
// hero background is computed by the neighbourhood — the mesh, seen locally.
import { readFileSync } from 'node:fs'

export default {
  paths() {
    const ledger: { key: string; name: string; receipt: string }[] =
      JSON.parse(readFileSync('src/proof/discovered.json', 'utf8'))
    const hueOf = (rec: string) => (parseInt(rec.replace(/-/g, '').slice(0, 2), 16) * 40) % 360
    const N = ledger.length
    return ledger.map((e, i) => {
      const hues: number[] = []
      for (let k = -3; k <= 3; k++) hues.push(hueOf(ledger[(i + k + N) % N].receipt)) // 7 surrounding theorems
      return { params: { key: e.key, name: e.name, receipt: e.receipt, hues: hues.join(',') } }
    })
  },
}
