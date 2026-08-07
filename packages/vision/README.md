# @ceccec/millennium-vision

The **ceccec vision** — an interpretive layer on top of the verifiable
[`millennium-solutions`](https://www.npmjs.com/package/millennium-solutions).

Core = what computes (honest, recomputable, `0/7`). Vision = what it means to the
author (perspective, clearly labeled). **Everyone can add their own vision:** fork
this package, depend on `millennium-solutions`, and write your `vision()`.

```bash
npm i millennium-solutions @ceccec/millennium-vision
```
```ts
import { entails, honesty } from 'millennium-solutions' // the shared facts
import { vision } from '@ceccec/millennium-vision'         // one perspective on them
```
License: CC BY-NC 4.0 · © Tsvetan Rouschev
