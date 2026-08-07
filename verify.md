---
title: Verify
---

# Verify a claim — live, in your browser

<script setup lang="ts">
import { ref, computed } from 'vue'
import { entails, curveFitCheck, scaleCheck } from './src/honesty/index'
import { toUuid } from './src/0/index'

// 1) entailment
const tf = ref(true)
const eR = computed(() => entails(tf.value))

// 2) scale match
const a = ref(7.25e20), b = ref(432)
const sR = computed(() => scaleCheck(Number(a.value), Number(b.value)))

// 3) curve-fit vacuity (fixed framework constants; you set target + a control)
const CONSTS = [9, 16, 27, 108, 216, 432]
const target = ref(1836.15267), control = ref(1837.4)
const fR = computed(() => curveFitCheck(Number(target.value), CONSTS, undefined, Number(control.value)))

// 4) content-address
const text = ref('entails → 0/7')
const uR = computed(() => toUuid(text.value))
</script>

Type into any box — **every result recomputes in your browser**, no server, no network. This page
also installs as an app and works offline (a PWA). It runs the same honesty toolkit the whole
deposit uses.

## 1. Does it entail?
<label><input type="checkbox" v-model="tf" /> the statement is <b>true even when the conjecture is false</b></label>

<pre>solves = {{ eR.solves }}
{{ eR.note }}</pre>

## 2. Do the scales match?
<label>a (Hz): <input type="number" v-model="a" /></label>
<label>b (Hz): <input type="number" v-model="b" /></label>

<pre>ratio  = {{ sR.ratio }}
orders = ~10^{{ sR.orders }} apart</pre>

## 3. Does the fit fit *anything*? (curve-fit vacuity)
<label>target: <input type="number" v-model="target" step="any" /></label>
<label>control: <input type="number" v-model="control" step="any" /></label>

<pre>best fit    = {{ fR.fit }}
rel. error  = {{ fR.err }}
control fit = {{ fR.controlFit }}
vacuous?    = {{ fR.vacuous }}   (true → the fit also hits an unrelated target → curve-fit, not prediction)</pre>

## 4. Content-address (fingerprint)
<label>text: <input type="text" v-model="text" style="min-width:16rem" /></label>

<pre>toUuid = {{ uR }}</pre>

---

> **Honest:** these check **specific, formalizable shapes** — entailment (a tautology entails
> nothing), curve-fit vacuity (a fit that hits anything predicts nothing), scale mismatch, and
> content identity. They are a floor, **not a general truth-oracle**, and `toUuid` is FNV (use
> SHA-256 for cryptographic use). The three questions for any bold claim: *does it ENTAIL? does the
> FIT fit anything? do the SCALES match?* `entails → 0/7`.
