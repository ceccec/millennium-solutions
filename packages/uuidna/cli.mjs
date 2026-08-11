#!/usr/bin/env node
// uuidna CLI — the same pure functions the library and MCP server expose, on the command line.
// Runs on Node ≥18, Deno, and Bun. stdin is read when an argument is "-"; structured results print
// as JSON to stdout, plain results as text, help/errors to stderr. Exit: 0 ok · 1 drained/false/error · 2 usage.
import { readFileSync } from 'node:fs'
import {
  toUuid, strictUuidna, computes, reeducate,
  imprintTextChain, readImprintTextChain, merkleRoot,
  encrypt, encryptRandom, decrypt, verifyEnvelope,
} from './dist/index.js'

const VERSION = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')).version

const HELP = `uuidna ${VERSION} — content-addressed identity, honest by construction. Integrity, not truth. 0/7.

Usage: uuidna <command> [args]   (use "-" as an argument to read that value from stdin)

  address <text>              content-address a value: a deterministic UUID (same input, same address)
  strict <value>              canonical mint (coerce → NFC → trim) so equal values share one address
  gate <text>                 honesty gate: prints {binary,hit}; exit 1 if the prose is drained
  reeducate <text>            bound each overclaim to the floor; prints {text,passed,steps}
  imprint <text>              encode text into a reversible UUID chain (prints a JSON array)
  read <uuid...>              decode text back from a UUID chain
  merkle-root <leaf...>       order-free merkle root of the leaves
  encrypt --pass <p> [--random] <text>   seal text (convergent by default; --random hides equality)
  decrypt --pass <p> <sealed.json|->     open a sealed envelope (wrong key/tamper exits 1)
  verify <sealed.json|->                 check an envelope's public 7d-fold address; exit 1 if it fails
  --version | --help

A content-address proves integrity, not secrecy. The gate is a lexical tripwire, not comprehension.`

/** Read all of stdin as UTF-8. */
function readStdin() {
  return new Promise((resolve, reject) => {
    let d = ''
    process.stdin.setEncoding('utf8')
    process.stdin.on('data', (c) => { d += c })
    process.stdin.on('end', () => resolve(d))
    process.stdin.on('error', reject)
  })
}

/** Resolve an argument, reading stdin when it is "-". */
async function val(arg) {
  return arg === '-' ? (await readStdin()).replace(/\n$/, '') : arg
}

/** Pull "--flag value" / "--flag=value" / boolean "--flag" out of argv, returning {flags, rest}. */
function parse(argv, booleans = []) {
  const flags = {}, rest = []
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith('--')) {
      const eq = a.indexOf('=')
      if (eq !== -1) { flags[a.slice(2, eq)] = a.slice(eq + 1); continue }
      const name = a.slice(2)
      if (booleans.includes(name)) { flags[name] = true; continue }
      flags[name] = argv[++i]
    } else rest.push(a)
  }
  return { flags, rest }
}

const out = (s) => process.stdout.write(typeof s === 'string' ? s + '\n' : JSON.stringify(s) + '\n')
const die = (msg, code = 2) => { process.stderr.write(msg + '\n'); process.exit(code) }

async function main() {
  const [cmd, ...args] = process.argv.slice(2)
  if (!cmd || cmd === '--help' || cmd === '-h') { process.stderr.write(HELP + '\n'); process.exit(cmd ? 0 : 2) }
  if (cmd === '--version' || cmd === '-v') return out(VERSION)

  switch (cmd) {
    case 'address': return out(toUuid(await val(need(args[0], 'address <text>'))))
    case 'strict':  return out(strictUuidna(await val(need(args[0], 'strict <value>'))))
    case 'gate': {
      const g = computes(await val(need(args[0], 'gate <text>')))
      out(g); process.exit(g.binary === 1 ? 0 : 1)
    }
    // eslint-disable-next-line no-fallthrough
    case 'reeducate': return out(reeducate(await val(need(args[0], 'reeducate <text>'))))
    case 'imprint':   return out(imprintTextChain(await val(need(args[0], 'imprint <text>'))))
    case 'read':      return out(readImprintTextChain(needAll(args, 'read <uuid...>')))
    case 'merkle-root': return out(merkleRoot(needAll(args, 'merkle-root <leaf...>')))
    case 'encrypt': {
      const { flags, rest } = parse(args, ['random'])
      if (!flags.pass) die('encrypt: --pass <passphrase> is required')
      const text = await val(need(rest[0], 'encrypt --pass <p> [--random] <text>'))
      return out(flags.random ? encryptRandom(text, flags.pass) : encrypt(text, flags.pass))
    }
    case 'decrypt': {
      const { flags, rest } = parse(args)
      if (!flags.pass) die('decrypt: --pass <passphrase> is required')
      const sealed = JSON.parse(await readSource(need(rest[0], 'decrypt --pass <p> <sealed.json|->')))
      try { return out(decrypt(sealed, flags.pass)) } catch { die('decrypt: wrong passphrase or tampered ciphertext', 1) }
    }
    case 'verify': {
      const sealed = JSON.parse(await readSource(need(args[0], 'verify <sealed.json|->')))
      const ok = verifyEnvelope(sealed); out({ verified: ok }); process.exit(ok ? 0 : 1)
    }
    default: die(`unknown command: ${cmd}\n\n${HELP}`)
  }
}

const need = (v, usage) => (v === undefined ? die(`usage: uuidna ${usage}`) : v)
const needAll = (a, usage) => (a.length ? a : die(`usage: uuidna ${usage}`))
/** A "-" reads stdin; anything else is a file path. */
async function readSource(arg) { return arg === '-' ? readStdin() : readFileSync(arg, 'utf8') }

main().catch((e) => die('uuidna: ' + (e?.message ?? String(e)), 1))
