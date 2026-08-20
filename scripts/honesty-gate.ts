// The gate — re-exported from @uuidna/uuidna. No local logic.
//
// By direct order: any custom logic not based on theorems is removed. Two things stood here and both are
// gone — first a lexical floor (word-lists in 22 languages, a Glagolitic table, negation-parity scoring),
// then a hand-written re-implementation of the theorem gate, which was the same violation in a new shape.
// A gate written here is custom logic however it is spelled. The implementation lives in the package,
// decided by the Lean ledger it ships, and this module only re-exports it.
export { computes, reveal, slimGate, THEOREMS, theoremByKey } from '@uuidna/uuidna'
