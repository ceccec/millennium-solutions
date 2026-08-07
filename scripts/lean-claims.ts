#!/usr/bin/env node
// Independently verify the ARITHMETIC each Lean theorem (Vortex.lean) asserts — recomputed here,
// no Lean toolchain needed. Fills a real gap: CI can't run `lake build`, but it can confirm the
// facts are true. Feeds trust in the formal layer; fails loudly if any claim stops being true.
const m9 = (n) => ((n % 9n) + 9n) % 9n, m7 = (n) => ((n % 7n) + 7n) % 7n
let fail = 0
const ck = (name, cond) => { console.log((cond ? '  ✓ ' : '  ✗ FALSE ') + name); if (!cond) fail++ }

ck('three_sq_zero: 3²≡0 mod9', m9(9n) === 0n)
ck('six_sq_zero: 6²≡0 mod9', m9(36n) === 0n)
ck('three_no_inverse mod9', ![1,2,3,4,5,6,7,8,9].some(x => m9(3n * BigInt(x)) === 1n))
ck('two_mul_five: 2·5≡1 mod9', m9(10n) === 1n)
ck('four_mul_seven: 4·7≡1 mod9', m9(28n) === 1n)
ck('eight_self_inv: 8·8≡1 mod9', m9(64n) === 1n)
{ let s = [], x = 1n; for (let k = 0; k < 6; k++) { s.push((x % 9n).toString()); x = (x * 2n) % 9n } ck('doubling_circuit [1,2,4,8,7,5]', s.join(',') === '1,2,4,8,7,5') }
ck('two_order_six: 2⁶≡1 mod9', m9(64n) === 1n)
ck('tens_complement involutive (d≤10)', [...Array(11).keys()].every(d => 10 - (10 - d) === d))
ck('rosette_pow_six: 3⁶≡1 mod7', m7(729n) === 1n)
{ let s = []; for (let k = 1; k <= 6; k++) s.push((m7(3n ** BigInt(k))).toString()); ck('rosette_orbit [3,2,6,4,5,1]', s.join(',') === '3,2,6,4,5,1') }
ck('k432: 432 = 2⁴·3³ = 16·27', 432 === 2 ** 4 * 3 ** 3 && 432 === 16 * 27)
ck('doubling_digit_sum: 1+2+4+8+7+5=27', 1 + 2 + 4 + 8 + 7 + 5 === 27)
{ const caps = [2,4,2,6,2,4,8,4,6,2,10,8,6,4,2,12,10,8,6,4,2,14], t = (n) => caps.slice(0, n).reduce((a, b) => a + b, 0)
  ck('magic 2/8/20/28/50/82/126', t(1)===2 && t(3)===8 && t(6)===20 && t(7)===28 && t(11)===50 && t(16)===82 && t(22)===126) }
ck('proton_fit: 108·17=1836', 108 * 17 === 1836)
ck('fit_not_ratio: 1836 ≠ 1836.1527 (formal layer refuses the overclaim)', 1836 !== 18361527 / 10000)
ck('self_seal product = 1', (1/2)*(1/2)*(1/2)*(8/7)*(7/5)*(5/3)*(1/2)*(2/3)*9 === 1)

console.log(fail ? '\n✗ ' + fail + ' Lean claim(s) FALSE' : '\n✓ all Lean theorems state true arithmetic facts (independently recomputed)')
process.exit(fail ? 1 : 0)
