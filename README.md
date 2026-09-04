# gamma-explorer

> Γ-Universalitäts-Explorer — interactive CREP inversion across GenesisAeon domain calibrations

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License"/></a>
  <a href="https://github.com/GenesisAeon/genesis-os"><img src="https://img.shields.io/badge/part%20of-genesis--os-blueviolet" alt="Part of genesis-os"/></a>
  <img src="https://img.shields.io/badge/CREP-comparison%20frame-orange" alt="CREP comparison frame"/>
  <img src="https://img.shields.io/badge/σ-2.2-lightgrey" alt="sigma default 2.2"/>
</p>

Two sliders, one axis: how

$$\Gamma = \mathrm{arctanh}(\eta)\,/\,\sigma$$

sits on AMOC, Amazon, solar flares, neural avalanches and the rest of the ecosystem.

**This is a comparison frame, not a natural law.** Γ is the inversion of the UTAC fixed-point equation \(H^* = K \cdot \tanh(\sigma \cdot \Gamma)\). The points on the axis are package calibrations. They share a coordinate system. That is not evidence that ocean, cortex and rainforest share a mechanism, and it is not “the one formula for everything”.

## Formula

| | | |
|---|---|---|
| Fixed point | \(H^* = K \cdot \tanh(\sigma \cdot \Gamma)\) | Relative height of the UTAC state |
| Efficiency | \(\eta = H^* / K\) | Share of the relevant maximum (weakening, deforestation, flare energy, …) |
| Inversion | \(\Gamma = \mathrm{arctanh}(\eta)\,/\,\sigma\) | The same map, backwards. \(\sigma\) is almost always **2.2** |

The live value is the exact inversion. Published package values are often rounded (AMOC: exact \(\mathrm{arctanh}(0.50)/2.2 \approx 0.2497\), led as **0.251**). The axis uses the exact number.

## Domain calibrations (\(\sigma = 2.2\))

| Domain | Package | \(\eta\) | \(\Gamma\) exact | Led as | Band |
|--------|---------|----------|------------------|--------|------|
| Solar flares | [solar-flare-utac](https://github.com/GenesisAeon/solar-flare-utac) (P21) | 0.03 | 0.0136 | 0.0136 | Ultra |
| Cygnus X-1 jet | [cygnus-jet-utac](https://github.com/GenesisAeon/cygnus-jet-utac) (P17) | 0.10 | 0.0456 | 0.0456 | Ultra |
| Cellular genesis | [cellular-genesis](https://github.com/GenesisAeon/cellular-genesis) | 0.20 | 0.0922 | 0.09 | Low |
| Amazon | [amazon-utac](https://github.com/GenesisAeon/amazon-utac) (P19) | 0.25 | 0.1161 | 0.116 | Low |
| AMOC | [amoc-utac](https://github.com/GenesisAeon/amoc-utac) (P18) | 0.50 | 0.2497 | 0.251 | Medium |
| Neural avalanches | [neural-avalanche-utac](https://github.com/GenesisAeon/neural-avalanche-utac) (P20) | 0.50 | 0.2497 | 0.251 | Medium |
| Sandpile (BTW) | [sandpile-utac](https://github.com/GenesisAeon/sandpile-utac) | 0.58 | 0.3011 | 0.296 | Medium |
| Hikari PoR | [hikari-ledger](https://github.com/GenesisAeon/hikari-ledger) | 2/3 | 0.3658 | 0.367 | High |
| Sandpile (Manna) | [sandpile-utac](https://github.com/GenesisAeon/sandpile-utac) | 0.68 | 0.3769 | 0.376 | High |
| Diffusive routing | [diffusive-routing](https://github.com/GenesisAeon/diffusive-routing) | 0.75 | 0.4423 | 0.443 | High |

Band edges in the UI (ultra / low / medium / high) are a reading aid of this explorer, not published package thresholds.

Core snaps in the UI: **Amazonas**, **AMOC**, **Kortex**, **Solar**. Everything else is optional ecosystem overlay.

## What to try

1. Start on the AMOC setpoint (\(\eta = 0.50\), \(\sigma = 2.2\), \(\Gamma \approx 0.25\)).
2. Drag \(\eta\) down toward Amazonas (0.25) and solar (0.03) — Γ collapses into the ultra-sensitive end.
3. Snap **Kortex**: same \(\eta\) and \(\Gamma\) as AMOC. That coincidence is the ecosystem’s “universality” claim — two independent calibrations, not a proof.
4. Move \(\sigma\) off 2.2 and watch every marker slide. The ranking is not invariant under \(\sigma\).

## Run locally

```bash
npm install
npm run dev
```

The app is a TanStack Start / React 19 / Tailwind v4 explorer. UI language is German.

```bash
npm run build
npm run typecheck
```

## Source map

```
src/
├── components/explorer/   # live Γ, η–Γ curve, domain axis
├── components/ui/         # buttons, sliders, switch, tooltips
├── lib/crep.ts            # inversion, bands, domain table
├── routes/index.tsx       # `/`
└── styles.css             # tokens
```

The domain table and the inversion live in [`src/lib/crep.ts`](src/lib/crep.ts). That file is the scientific payload; the rest is chrome.

## Role in the GenesisAeon ecosystem

A read-only comparison UI over packages 17–21 plus SOC / ledger calibrations. It does not run the models. It places each package’s published \((\eta, \sigma, \Gamma)\) on a shared axis so rounding gaps and neighbours are visible.

Sibling sources:

- [Feldtheorie](https://github.com/GenesisAeon/Feldtheorie)
- [utac-core](https://github.com/GenesisAeon/utac-core)
- [amoc-utac](https://github.com/GenesisAeon/amoc-utac)
- [amazon-utac](https://github.com/GenesisAeon/amazon-utac)

## License

Code: [MIT](LICENSE). Copyright (c) 2026 JohannRömer / GenesisAeon Project.
