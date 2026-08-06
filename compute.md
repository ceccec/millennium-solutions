---
title: Compute
---

# Computed results (fused)

Every block below is produced at page-load by the TypeScript modules in the
digit-folder mesh — no precomputed text, no standalone scripts.

<script setup lang="ts">
import { report as honesty } from './src/honesty/index'
import { report as funding } from './src/9/funding'
import { report as trinityMatrix } from './src/0/trinity-matrix'
import { report as ledger } from './src/0/ledger'
import { report as singularity } from './src/0/singularity'
import { report as aspects } from './src/5/aspects'
import { report as enumeration } from './src/9/enumeration'
import { report as reflection } from './src/5/reflection'
import { report as folds } from './src/5/folds'
import { report as rosetta } from './src/7/rosetta'
import { report as rosettaClay } from './src/7/rosetta-clay'
import { report as geometry } from './src/8/merkaba/geometry'
import { report as field } from './src/8/merkaba/field'
import { report as entails } from './src/7/entails'
import { report as shell } from './src/8/nucleus/shell-model-magic'
import { report as frequency } from './src/2/frequency-scales'
import { report as stringScale } from './src/2/string-scale'
import { report as primesVortex } from './src/2/primes-vortex'
import { report as piBBP } from './src/3/pi-bbp'
import { report as stringDims } from './src/7/string-dimensions'
import { report as lens } from './src/7/lens'
import { report as proton } from './src/8/nucleus/proton-mass-fit'
</script>

## Honesty toolkit (`src/honesty/index.ts`)
<pre>{{ honesty() }}</pre>

## License & funding — fused (`src/9/funding.ts`)
<pre>{{ funding() }}</pre>

## UUID trinity matrix — identity substrate (`src/0/trinity-matrix.ts`)
<pre>{{ trinityMatrix() }}</pre>

## Content-addressed audit ledger (`src/0/ledger.ts`)
<pre>{{ ledger() }}</pre>

## Singularity — one root, shared reference (`src/0/singularity.ts`)
<pre>{{ singularity() }}</pre>

## The thesis, decomposed and computed (`src/5/aspects.ts`)
<pre>{{ aspects() }}</pre>

## ℤ/9 enumeration (`src/9/enumeration.ts`)
<pre>{{ enumeration() }}</pre>

## Reflection — ℤ/9 (`src/5/reflection.ts`)
<pre>{{ reflection() }}</pre>

## Folds (`src/5/folds.ts`)
<pre>{{ folds() }}</pre>

## Pliska rosette — ℤ/7 (`src/7/rosetta.ts`)
<pre>{{ rosetta() }}</pre>

## Rosette ⊕ Clay — the 7 = 6 + 1 fusion (`src/7/rosetta-clay.ts`)
<pre>{{ rosettaClay() }}</pre>

## Clay entailment (`src/7/entails.ts`)
<pre>{{ entails() }}</pre>

## Geometry — cube → hexagon → Metatron (`src/8/merkaba/geometry.ts`)
<pre>{{ geometry() }}</pre>

## Merkaba magnetic field (`src/8/merkaba/field.ts`)
<pre>{{ field() }}</pre>

## Nuclear shell-model magic numbers (`src/8/nucleus/shell-model-magic.ts`)
<pre>{{ shell() }}</pre>

## Frequency scales (`src/2/frequency-scales.ts`)
<pre>{{ frequency() }}</pre>

## String / Planck scale vs 432 Hz (`src/2/string-scale.ts`)
<pre>{{ stringScale() }}</pre>

## Primes on the vortex (`src/2/primes-vortex.ts`)
<pre>{{ primesVortex() }}</pre>

## Pi by random access — BBP (`src/3/pi-bbp.ts`)
<pre>{{ piBBP() }}</pre>

## 7-dimensional strings — where 7 really appears (`src/7/string-dimensions.ts`)
<pre>{{ stringDims() }}</pre>

## The 7-dimensional lens — reflect(singularity, clay) (`src/7/lens.ts`)
<pre>{{ lens() }}</pre>

## Proton mass fit (`src/8/nucleus/proton-mass-fit.ts`)
<pre>{{ proton() }}</pre>
