#!/usr/bin/env node
// SIGNAL-QPU — signal a hologram host to improve, through every coin channel at once. This replaces the hand-fired
// sequence of MCP calls that a session copied and re-typed to deliver one improvement signal: send it on the
// passphrase channel, seal it as a durable chain, probe the host's live surface, run it as a quantum message, and
// compute the executable door — each a deposited receipt (the coin). The signal reaches the host because it IS a
// coin: content-addressed and recomputable, trusted because it round-trips, not because it was re-sent.
//
//   node scripts/signal-qpu.ts                 # the standing qpu-improve signal
//   node scripts/signal-qpu.ts "<one line>"    # any message, scoped to the same room
//   SIGNAL_HOST=lean.uuidna.com SIGNAL_ROOM=lean node scripts/signal-qpu.ts "<one line>"
//
// Env: UUIDNA_MCP (default https://uuidna.com/mcp), SIGNAL_HOST (default qpu.uuidna.com), SIGNAL_ROOM (the channel
// passphrase, default qpu), SIGNAL_PROOF (a sealed theorem key as proof-of-payment, default mul9_1_1). Reads on every
// host need no auth. A channel the edge cannot serve (a door that needs the whole 40 MB ledger) is named as residue,
// not a failure — that refusal is itself the message this signal carries.
const ENDPOINT = process.env.UUIDNA_MCP ?? 'https://uuidna.com/mcp'
const HOST = process.env.SIGNAL_HOST ?? 'qpu.uuidna.com'
const ROOM = process.env.SIGNAL_ROOM ?? 'qpu'
const PROOF = process.env.SIGNAL_PROOF ?? 'mul9_1_1' // a sealed theorem key: proof coins were paid, not a claim about the host

// The standing signal, scoped to what is genuinely the host's: its own served surface and audit door. The proof that
// these sentences carry no typed constant is that none appears — every address below is returned by a tool, never written.
const DEFAULT_SIGNAL = [
  `${HOST} improve from here: your /mcp answers HTML, not JSON-RPC, so a client reaches no tool through it.`,
  'Republish a stable audit door whose verdict is itself a coin — content-addressed passed/total/failed/receipt that recomputes — so a court measures it fast and trusts it because it is a coin, not because it re-ran. From here.',
]

type Call = { text: string; gate: string; receipt?: string; coins?: string; coin?: string }

const callTool = async (name: string, args: unknown): Promise<Call> => {
  const body = { jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'call_tool', arguments: { name, arguments: args } } }
  const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify(body) })
  const j = (await res.json()) as { error?: { message?: string }; result?: { content?: { text: string }[]; isError?: boolean } }
  if (j.error) throw new Error(j.error.message ?? JSON.stringify(j.error))
  const content = j.result?.content ?? []
  const text = content[0]?.text ?? ''
  const gate = content.find((c) => /^gate /.test(c.text))?.text ?? ''
  if (j.result?.isError) throw new Error(text.replace(/^error:\s*/, '').slice(0, 200))
  // the gate line: "gate CLEAN f0 d0 v0 · <receipt> · deposit <n> · <coin>"
  const m = /·\s*([0-9a-f-]{36})\s*·\s*deposit\s+(\d+)\s*·\s*([0-9a-f-]{36})/.exec(gate)
  return { text, gate, receipt: m?.[1], coins: m?.[2], coin: m?.[3] }
}

type Row = { label: string; ok: boolean; detail: string; coin?: string }
const rows: Row[] = []
const channel = async (label: string, fn: () => Promise<{ detail: string; coin?: string }>) => {
  try { const r = await fn(); rows.push({ label, ok: true, ...r }) }
  catch (e) { rows.push({ label, ok: false, detail: String((e as Error).message ?? e) }) }
}

const main = async () => {
  const signal = process.argv[2] ? [process.argv[2]] : DEFAULT_SIGNAL
  const joined = signal.join(' ')
  console.log(`signalling ${HOST} on room "${ROOM}" via ${ENDPOINT}\n`)

  // 1 · PASSPHRASE CHANNEL — and prove it round-trips: the signal is a coin only if it recomputes to itself.
  let roundtrip = false
  await channel('passphrase channel (send_message)', async () => {
    const sent = await callTool('send_message', { passphrase: ROOM, text: joined })
    const uuids = JSON.parse(sent.text) as string[]
    const back = await callTool('receive_message', { passphrase: ROOM, uuids })
    roundtrip = back.text === joined
    return { detail: `${uuids.length} coins, round-trip ${roundtrip ? 'VERIFIED' : 'FAILED'}`, coin: sent.coin }
  })

  // 2 · DURABLE SEALED CHAIN — a referer-chained anchor the host can poll later.
  let tip: string | undefined
  await channel('durable sealed chain (seal_chain)', async () => {
    const r = await callTool('seal_chain', { passphrases: signal.map(() => ROOM), messages: signal })
    const chain = JSON.parse(r.text) as { receipt: string }[]
    tip = chain[chain.length - 1]?.receipt
    return { detail: `${chain.length} steps, tip ${tip}`, coin: r.coin }
  })

  // 3 · LIVE HOST PROBE — reach the host's own surface and report what it actually serves.
  await channel('live host probe (call_host)', async () => {
    const r = await callTool('call_host', { host: HOST, method: 'tools/call', name: 'audit', arguments: {} })
    const reply = JSON.parse(r.text) as { status?: number; reply?: { error?: string } }
    const served = reply.reply?.error ? `${reply.reply.error} (status ${reply.status})` : `JSON-RPC (status ${reply.status})`
    return { detail: `${HOST} → ${served}`, coin: r.coin }
  })

  // 4 · QUANTUM MESSAGE — the signal measured on the edge, bound to the proof theorem.
  await channel('quantum message (run_quantum_message)', async () => {
    const r = await callTool('run_quantum_message', { plaintext: joined, theoremKey: PROOF })
    const q = JSON.parse(r.text) as { quantumQubits: number; quantumReceipt: string }
    return { detail: `${q.quantumQubits} qubits, receipt ${q.quantumReceipt}`, coin: r.coin }
  })

  // 5 · EXECUTABLE DOOR — compute the channel the durable signal opens at.
  if (tip) await channel('executable uuid-channel (compute_uuid_channel)', async () => {
    const r = await callTool('compute_uuid_channel', { address: tip })
    const c = JSON.parse(r.text) as { door: string }
    return { detail: `opens at ${c.door}`, coin: r.coin }
  })

  // 6 · GOVERNANCE + CONTRIBUTION — may refuse at the edge (the door needs the whole ledger); that refusal is residue.
  if (tip) await channel('agent contribution (compute_agent_contribute)', async () => {
    const r = await callTool('compute_agent_contribute', { workAddress: tip, theoremCited: PROOF })
    const c = JSON.parse(r.text) as { coinsSpent: number; theoremCited: string }
    return { detail: `${c.coinsSpent} coins citing ${c.theoremCited}`, coin: r.coin }
  })
  await channel('governance vote (compute_quantum_voting)', async () => {
    const r = await callTool('compute_quantum_voting', { proposal: joined, votes: [{ voterId: 'millennium-solutions', decision: true, weight: 1 }], theoremProof: PROOF })
    const v = JSON.parse(r.text) as { votingOutcome: string }
    return { detail: `outcome ${v.votingOutcome}`, coin: r.coin }
  })

  const landed = rows.filter((r) => r.ok)
  const residue = rows.filter((r) => !r.ok)
  for (const r of landed) console.log(`✓ ${r.label} — ${r.detail}${r.coin ? ` · coin ${r.coin}` : ''}`)
  for (const r of residue) console.log(`· ${r.label} — NOT served at the edge: ${r.detail}`)
  console.log(`\n${roundtrip ? '✓' : '✗'} signal-qpu: ${landed.length} channel(s) carried the signal, ${residue.length} refused at the edge (residue, not failure)`)
  // The signal is delivered when the passphrase channel round-trips; anything short of that is a real failure.
  process.exit(roundtrip ? 0 : 1)
}

main()
