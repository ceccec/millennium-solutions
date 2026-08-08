// Dynamic route: one page per discovered theorem (a stable, referrer-able URL /theorem/<key>).
// The whole chained ledger is enumerated at build; each observer reaches any theorem by its content key.
import { readFileSync } from 'node:fs'

export default {
  paths() {
    const ledger: { key: string; name: string; receipt: string }[] =
      JSON.parse(readFileSync('src/proof/discovered.json', 'utf8'))
    return ledger.map((e) => ({ params: { key: e.key, name: e.name, receipt: e.receipt } }))
  },
}
