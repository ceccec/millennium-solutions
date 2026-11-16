---
title: CHSH run
description: The pipeline harness for ISO/IEC 4879 3.4.10 — the sealed CHSH verdict, the circuits to run on real hardware, and the decision on any counts dropped in.
head:
  - ['meta', { name: 'robots', content: 'index, follow' }]
---

# CHSH run — the device measurement, via the pipeline

> **The judge is built; this is the input slot.** ISO/IEC 4879:2024 3.4.10 ("quantum computer") closes on a *measured* result, not a proof. The verdict is sealed — `quantum_hardware.lean` decides S > 2 on exact integers, and *no error in it can manufacture S > 2 from classical counts* (a false positive is impossible; only a false negative). This page emits the circuits to run and decides whatever counts are dropped into `hardware/chsh-counts.json`.

**State: NOT_RUN.**

## Not run yet — the pending input

No `hardware/chsh-counts.json`. Run the four circuits below on real quantum hardware (the depositor's credentials), then drop the four-setting counts as JSON (`[{ n00, n01, n10, n11 }, …]`) at `hardware/chsh-counts.json`. The next build decides it — no code change, no claim until the counts are in.

## The runnable circuits (OpenQASM, qubits 0 & 1)

The four CHSH settings — Alice along 0 or π/2, Bob along ±π/4, sign −1 on the last:

**Setting 0 (sign +1):**

```qasm
OPENQASM 3.0; include "stdgates.inc"; bit[2] c; rz(1.5707963267948966) $0; sx $0; rz(1.5707963267948966) $0; rz(1.5707963267948966) $1; sx $1; rz(1.5707963267948966) $1; cz $0, $1; rz(1.5707963267948966) $1; sx $1; rz(1.5707963267948966) $1; rz(-3.141592653589793) $0; sx $0; rz(3.141592653589793) $0; sx $0; rz(-3.141592653589793) $1; sx $1; rz(3.9269908169872414) $1; sx $1; c[0] = measure $0; c[1] = measure $1;
```

**Setting 1 (sign +1):**

```qasm
OPENQASM 3.0; include "stdgates.inc"; bit[2] c; rz(1.5707963267948966) $0; sx $0; rz(1.5707963267948966) $0; rz(1.5707963267948966) $1; sx $1; rz(1.5707963267948966) $1; cz $0, $1; rz(1.5707963267948966) $1; sx $1; rz(1.5707963267948966) $1; rz(-3.141592653589793) $0; sx $0; rz(3.141592653589793) $0; sx $0; rz(-3.141592653589793) $1; sx $1; rz(2.356194490192345) $1; sx $1; c[0] = measure $0; c[1] = measure $1;
```

**Setting 2 (sign +1):**

```qasm
OPENQASM 3.0; include "stdgates.inc"; bit[2] c; rz(1.5707963267948966) $0; sx $0; rz(1.5707963267948966) $0; rz(1.5707963267948966) $1; sx $1; rz(1.5707963267948966) $1; cz $0, $1; rz(1.5707963267948966) $1; sx $1; rz(1.5707963267948966) $1; rz(-3.141592653589793) $0; sx $0; rz(4.71238898038469) $0; sx $0; rz(-3.141592653589793) $1; sx $1; rz(3.9269908169872414) $1; sx $1; c[0] = measure $0; c[1] = measure $1;
```

**Setting 3 (sign −1):**

```qasm
OPENQASM 3.0; include "stdgates.inc"; bit[2] c; rz(1.5707963267948966) $0; sx $0; rz(1.5707963267948966) $0; rz(1.5707963267948966) $1; sx $1; rz(1.5707963267948966) $1; cz $0, $1; rz(1.5707963267948966) $1; sx $1; rz(1.5707963267948966) $1; rz(-3.141592653589793) $0; sx $0; rz(4.71238898038469) $0; sx $0; rz(-3.141592653589793) $1; sx $1; rz(2.356194490192345) $1; sx $1; c[0] = measure $0; c[1] = measure $1;
```

## Accepted hardware

Any device whose counts the verdict accepts — the run is judged by the kernel's rule, not the vendor's claim:

- ibm-quantum

## Honest floor

Until `hardware/chsh-counts.json` holds a real run, the 3.4.10 device leaf is **open** — the judge is ready, the measurement pending. When it holds one, the sealed verdict decides it, and `/iso-conformance` flips that row by the same logic — nothing fabricated, a false positive impossible by construction.
