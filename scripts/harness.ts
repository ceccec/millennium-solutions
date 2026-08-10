// The auditability harness — makes any output auditable (address + gate + reproducible), reeducates overclaims
// until they hold — lives canonically in @uuidna/uuidna. One implementation shared by both apps, no copy.
export { DIMENSIONS, harness, opaque, harnessGain, harness7, reeducate } from '@uuidna/uuidna'
export type { Harnessed } from '@uuidna/uuidna'
