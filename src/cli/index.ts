// Command-line arguments, once.
//
// Three copies of this lived in scripts/blind.ts, scripts/novelty.ts and scripts/uses.ts, and they were not
// quite the same function: novelty and uses took the value after a flag and returned `string | undefined`,
// testing `i > 0`; blind took a numeric default and tested `i >= 0`. The difference is harmless — argv[0] is
// the node binary and argv[1] the script, so a flag cannot sit at index 0 — which is exactly what makes it
// the kind of divergence nobody notices until the day it matters. src/html/index.ts records the same story
// about HTML escaping, where one of four copies really was wrong.
//
// This is a LEAF: it imports nothing and reads only process.argv, so any script can take it without
// acquiring a dependency. scripts/canon-gate.ts is what keeps the copies from growing back.
export const flag = (name: string): boolean => process.argv.includes(name)

/** The value after `name`, or undefined when the flag is absent or last. */
export const arg = (name: string): string | undefined => {
  const i = process.argv.indexOf(name)
  return i > 0 ? process.argv[i + 1] : undefined
}

/** The value after `name` as a number, or `fallback` when absent. A non-numeric value is NaN, not the
 *  fallback: silently substituting the default would hide `--trials twelve` rather than report it. */
export const num = (name: string, fallback: number): number => {
  const v = arg(name)
  return v === undefined ? fallback : Number(v)
}
