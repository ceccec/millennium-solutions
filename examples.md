---
title: Examples — computed live, by theorem
head:
  - ['meta', { name: 'robots', content: 'index, follow' }]
---

# Examples — computed live, organised by theorem

> Every worked example below is **recomputed in your browser** from the deposit's own `src/` functions,
> and each links to the theorem that proves it. Nothing is stored; recompute the page and it recomputes.
> A content-address proves **integrity, not truth**. `entails → 0/7`.

<Examples />

## Harness &amp; reeducate — the tool, live

Treat any output as a **receipted structure**, not opaque bytes: it becomes content-addressed (auditable)
and, if it drains the honesty floor, it is **reeducated** — each overclaim bounded until the text holds.
Max free work, max auditability — harmonic and efficient, by default. This runs the exact `harness` and
`reeducate` functions the build uses ([scripts/harness.ts](https://github.com/ceccec/millennium-solutions/blob/main/scripts/harness.ts)) —
verified by [the difference is decidable](/theorem/the_difference_is_decidable_harnessing_makes_any_output_auditable_not_intelligent)
and [reeducate until it holds](/theorem/reeducate_a_failing_output_is_bounded_until_it_holds_max_free_work_max_auditability).

<Reeducate />

## Seal math — how many bits in each seal

The more complex the case, the more receipts — yet each seal is a fixed **128 bits** (= 64 two-bit
verifications), and verifying one receipt's membership costs only **2·⌈log₂N⌉ bits**. So you verify the whole
case cheaply yet bill on the full value the customer would otherwise recompute — earning the measured saving,
the two coins conserved. Choose the case size and read the math, from
[each seal is 128 bits](/theorem/each_seal_is_128_bits_and_membership_verifies_in_two_log2_n_bits_logarithmic_not_linear)
and [the 967-receipt case](/theorem/the_967_receipt_case_verify_20_bits_bill_on_the_967_computation_value_earn_the_947_bit_saving).

<SealMath />
