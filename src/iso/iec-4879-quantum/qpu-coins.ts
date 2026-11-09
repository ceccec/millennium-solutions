// QPU REGISTER COINS — each constant src/iso/iec-4879-quantum/qpu.lean records from qpu.uuidna.com, linked to the UUID of the
// quantum program that derives it, instead of standing as a bare integer read by a hand on a date.
//
// qpu.lean carries eight constants "read from the served JSON-LD on 2026-09-28" and the clay* section ports the
// unit's own definitions (Mint, Lattice, Qaoa, Grover, Qft, …) so each constant is DERIVED, not transcribed —
// `theorem the_served_constants_are_the_ones_the_definitions_derive` decides clayCoins = coins, and so on. What is
// still missing is the ADDRESS: a reader of the integer cannot resolve it to the program it came from. A quantum
// term is a coin in this deposit (toUuid of the standard's words — src/iso/iec-4879-quantum/terms/terminology.ts); so is a
// register constant. The coin is toUuid of the unit's declaration, recomputable by anyone from the same words, so
// the integer carries a resolvable link to its quantum program rather than a date and a hand.
//
// The values are READ from qpu.lean, never retyped here (one constant, one source), and the Lean module that
// derives each one is named so the coin points at a program, not only a number. The live side — resolving the
// served value through the qpu connector (served→source fallback) and checking it still matches — is
// scripts/qpu-register-gate.ts; this module is the address it checks against.
import { readFileSync } from 'node:fs'
import { toUuid } from '../../0/index.ts'
import { leanPathOf } from '../../api/index.ts'

/** a register constant, its value (from qpu.lean), the quantum program that derives it, and the live door that serves it */
export type RegisterCoin = {
  name: string
  value: number
  /** the clay* definition in qpu.lean that derives this constant from the unit's ported programs */
  derivedBy: string
  /** the qpu quantum program (a module ported from ~/github/uuidna/qpu) the derivation comes from */
  program: string
  /** the content-address of this declaration: toUuid of the unit's own words, recomputable by anyone */
  coin: string
}

// which ported program each served constant is derived by, read off qpu.lean's clay* section and the served
// JSON-LD grouping (faces {coins, rays, faces}, cube {vertices, hexbit, bits}, circuit {qubits, levels}).
const PROGRAM: Readonly<Record<string, { derivedBy: string; program: string }>> = {
  coins: { derivedBy: 'clayCoins = claySeed + claySeed', program: 'Mint (the two coins, 1 + 1)' },
  rays: { derivedBy: 'clayRays = clayN + clayCoins + clayCoins', program: 'Mint · Vortex (seven dimensions)' },
  faces: { derivedBy: 'clayFaces = clayVertices + clayHexbit + clayCoins', program: 'Faces (the coil, coins × rays)' },
  vertices: { derivedBy: 'clayVertices = clayMint clayN', program: 'Lattice (the cube, 2^n)' },
  hexbit: { derivedBy: 'clayHexbit = clayMint clayCoins', program: 'Mint (2^coins)' },
  bits: { derivedBy: 'clayBits = clayMint (clayN + clayCoins)', program: 'Lattice (the register width)' },
  qubits: { derivedBy: 'clayN = ["quantum","processing","unit"].length', program: 'Circuit (the quantum processing unit)' },
  levels: { derivedBy: 'levels ^ qubits = vertices', program: 'Circuit (the two levels of a qubit)' },
}

/** the canonical words a register constant is addressed by — recomputable by qpu or anyone from the same declaration */
export const registerSpec = (name: string, value: number): string => `qpu.uuidna.com register ${name} = ${value}`

/** the eight register constants qpu.lean records, each with the coin that links it to its quantum program */
export const qpuRegister = (): RegisterCoin[] => {
  const src = readFileSync(leanPathOf('qpu.lean'), 'utf8')
  const defs = new Map<string, number>()
  for (const m of src.matchAll(/^def\s+([a-z]+)\s*:\s*Nat\s*:=\s*(\d+)/gm)) defs.set(m[1]!, Number(m[2]))
  return Object.keys(PROGRAM).map((name) => {
    const value = defs.get(name)
    if (value === undefined) throw new Error(`qpu-coins: qpu.lean declares no constant \`${name}\` — the register and the source have drifted`)
    return { name, value, ...PROGRAM[name]!, coin: toUuid(registerSpec(name, value)) }
  })
}
