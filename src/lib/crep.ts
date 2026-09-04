/** CREP inversion Γ = arctanh(η) / σ — comparison frame, not a natural constant. */

export const SIGMA_DEFAULT = 2.2;
export const ETA_MIN = 0.01;
export const ETA_MAX = 0.989;
export const SIGMA_MIN = 0.5;
export const SIGMA_MAX = 4;

export type CrepBandId = "ultra" | "low" | "medium" | "high";

export type Domain = {
  id: string;
  name: string;
  shortName: string;
  packageName: string;
  packageId: number | null;
  eta: number;
  sigma: number;
  /** Value the package itself publishes (often rounded). */
  gammaPublished: number;
  band: CrepBandId;
  core: boolean;
  field: string;
  etaMeaning: string;
  meaning: string;
  repo: string;
};

export const BANDS: {
  id: CrepBandId;
  label: string;
  from: number;
  to: number;
  hint: string;
}[] = [
  {
    id: "ultra",
    label: "Ultra-sensitiv",
    from: 0,
    to: 0.05,
    hint: "Kleine η — das System reagiert stark auf Störungen",
  },
  {
    id: "low",
    label: "Low-CREP",
    from: 0.05,
    to: 0.18,
    hint: "Fragiles Regime, mehr Wirkung pro Forcing-Einheit",
  },
  {
    id: "medium",
    label: "Medium-CREP",
    from: 0.18,
    to: 0.3,
    hint: "Homeostatischer Setpoint um η ≈ 50 %",
  },
  {
    id: "high",
    label: "High-CREP",
    from: 0.3,
    to: 1.2,
    hint: "Näher an Sättigung, steifer gegen kleine Anstöße",
  },
];

export const DOMAINS: Domain[] = [
  {
    id: "solar",
    name: "Solare Flares",
    shortName: "Solar",
    packageName: "solar-flare-utac",
    packageId: 21,
    eta: 0.03,
    sigma: SIGMA_DEFAULT,
    gammaPublished: 0.0136,
    band: "ultra",
    core: false,
    field: "Heliosphäre",
    etaMeaning:
      "Typischer X-Klasse-Flare setzt η ≈ 3 % der gespeicherten magnetischen Energie (E_max) frei.",
    meaning:
      "Aktive Regionen sitzen am ultra-sensitiven Ende des CREP-Spektrums. Kleine Änderungen der gespeicherten Energie verschieben Γ stark — das Paket kalibriert den Fixpunkt an Velasco Herrera (2026).",
    repo: "https://github.com/GenesisAeon/solar-flare-utac",
  },
  {
    id: "cygnus",
    name: "Cygnus-X-1-Jet",
    shortName: "Cygnus",
    packageName: "cygnus-jet-utac",
    packageId: 17,
    eta: 0.1,
    sigma: SIGMA_DEFAULT,
    gammaPublished: 0.0456,
    band: "ultra",
    core: false,
    field: "Astrophysik",
    etaMeaning:
      "Gemessener Akkretion-zu-Jet-Wirkungsgrad η = H*/K ≈ 10 %.",
    meaning:
      "Niedriges Γ erklärt, warum der Jet so empfindlich auf Sternwind-Schwankungen reagiert („dancing jet“). Erste CREP-Kalibrierung eines stellaren Schwarzen Lochs im Ökosystem.",
    repo: "https://github.com/GenesisAeon/cygnus-jet-utac",
  },
  {
    id: "cellular",
    name: "Zelluläre Genesis",
    shortName: "Zelle",
    packageName: "cellular-genesis",
    packageId: null,
    eta: 0.2,
    sigma: SIGMA_DEFAULT,
    gammaPublished: 0.09,
    band: "low",
    core: false,
    field: "Zellbiologie",
    etaMeaning:
      "Geometrisches Mittel der CREP-Komponenten (ATP-/Stress-Wirkungsgrad) η ≈ 0.20.",
    meaning:
      "Stoffwechsel-Kritikalität einer Zellpopulation. Γ sitzt unterhalb des Amazonas — das Paket liest das als empfindliches bioenergetisches Regime, nicht als Klima-Analogon.",
    repo: "https://github.com/GenesisAeon/cellular-genesis",
  },
  {
    id: "amazon",
    name: "Amazonas",
    shortName: "Amazonas",
    packageName: "amazon-utac",
    packageId: 19,
    eta: 0.25,
    sigma: SIGMA_DEFAULT,
    gammaPublished: 0.116,
    band: "low",
    core: true,
    field: "Ökologie",
    etaMeaning:
      "η = 1 − H_threshold bei 25 % Entwaldung (Lovejoy & Nobre 2019). Szenario 40 %: η = 0.40 → Γ ≈ 0.189.",
    meaning:
      "Kipppunkt Wald→Savanne. Low-CREP: pro Forcing-Einheit verwundbarer als AMOC, weniger sensitiv als solare Flares. Beobachteter Waldanteil ~83.9 % (PRODES 2025).",
    repo: "https://github.com/GenesisAeon/amazon-utac",
  },
  {
    id: "amoc",
    name: "AMOC",
    shortName: "AMOC",
    packageName: "amoc-utac",
    packageId: 18,
    eta: 0.5,
    sigma: SIGMA_DEFAULT,
    gammaPublished: 0.251,
    band: "medium",
    core: true,
    field: "Ozeanzirkulation",
    etaMeaning:
      "50 %-Abschwächung als Setpoint (Chavent et al. 2026): H* = K · tanh(σΓ) ≈ 0.50 · K.",
    meaning:
      "Atlantische Umwälzzirkulation im Medium-CREP-Regime. Das Ökosystem führt Γ ≈ 0.251; exakt ist arctanh(0.50)/2.2 ≈ 0.2497. Dieselbe Stelle wie neuronale Kritikalität — ein Vergleich, keine Identität der Mechanismen.",
    repo: "https://github.com/GenesisAeon/amoc-utac",
  },
  {
    id: "brain",
    name: "Neuronale Lawinen",
    shortName: "Kortex",
    packageName: "neural-avalanche-utac",
    packageId: 20,
    eta: 0.5,
    sigma: SIGMA_DEFAULT,
    gammaPublished: 0.251,
    band: "medium",
    core: false,
    field: "Neurowissenschaft",
    etaMeaning:
      "Kritischer Fixpunkt bei η = H*/K = 50 % (Verzweigungsverhältnis σ_b = 1, Avalanche-Exponent τ = 3/2).",
    meaning:
      "Package 20 legt Γ_brain auf denselben Vergleichspunkt wie AMOC. Das ist die zentrale „Universalitäts“-Behauptung des Ökosystems — eine Konvergenz zweier Kalibrierungen, kein Beweis einer Naturkonstante.",
    repo: "https://github.com/GenesisAeon/neural-avalanche-utac",
  },
  {
    id: "btw",
    name: "Sandhaufen (BTW)",
    shortName: "BTW",
    packageName: "sandpile-utac",
    packageId: null,
    eta: 0.58,
    sigma: SIGMA_DEFAULT,
    gammaPublished: 0.296,
    band: "medium",
    core: false,
    field: "Statistische Physik",
    etaMeaning:
      "Kritische Dichte η_c = ρ_c / z_c ≈ 0.58 im Bak–Tang–Wiesenfeld-Sandhaufen.",
    meaning:
      "Klassische Selbstorganisierte Kritikalität. Das Paket setzt Γ_BTW = arctanh(η_c)/σ ≈ 0.296 (geführt) — ein physikalisches Referenzsystem für das Spektrum.",
    repo: "https://github.com/GenesisAeon/sandpile-utac",
  },
  {
    id: "por",
    name: "Hikari PoR",
    shortName: "PoR",
    packageName: "hikari-ledger",
    packageId: null,
    eta: 2 / 3,
    sigma: SIGMA_DEFAULT,
    gammaPublished: 0.367,
    band: "high",
    core: false,
    field: "Konsens",
    etaMeaning:
      "Byzantinische Toleranzschwelle η = 2/3 (Konsens unmöglich für f ≥ n/3).",
    meaning:
      "Kein Klimasystem: Proof-of-Resonance-Ledger. Im Spektrum, weil dasselbe Inversionsrezept auf eine Konsensschwelle angewendet wird — ein Beleg, dass Γ hier ein Koordinatensystem ist, keine Naturgröße.",
    repo: "https://github.com/GenesisAeon/hikari-ledger",
  },
  {
    id: "manna",
    name: "Sandhaufen (Manna)",
    shortName: "Manna",
    packageName: "sandpile-utac",
    packageId: null,
    eta: 0.68,
    sigma: SIGMA_DEFAULT,
    gammaPublished: 0.376,
    band: "high",
    core: false,
    field: "Statistische Physik",
    etaMeaning: "Kritische Dichte η_c ≈ 0.68 in der Manna-Universitätsklasse.",
    meaning:
      "Zweite Sandhaufen-Klasse im selben Paket. Höheres η als BTW verschiebt Γ weiter in den High-CREP-Bereich — ein interner Vergleich zweier SOC-Klassen.",
    repo: "https://github.com/GenesisAeon/sandpile-utac",
  },
  {
    id: "routing",
    name: "Diffusive Routing",
    shortName: "Routing",
    packageName: "diffusive-routing",
    packageId: null,
    eta: 0.75,
    sigma: SIGMA_DEFAULT,
    gammaPublished: 0.443,
    band: "high",
    core: false,
    field: "Netzwerke",
    etaMeaning:
      "Ziel-Wirkungsgrad optimaler vs. maximaler Durchsatz η ≈ 0.75.",
    meaning:
      "Entropisches Routing auf Graphen. Oberes Ende der hier versammelten Kalibrierungen — nützlich als Gegenpol zu Solar und Cygnus, nicht als physikalisches Gesetz.",
    repo: "https://github.com/GenesisAeon/diffusive-routing",
  },
];

export function atanh(x: number): number {
  if (!Number.isFinite(x)) return Number.NaN;
  if (Math.abs(x) >= 1) return Math.sign(x) * Number.POSITIVE_INFINITY;
  return 0.5 * Math.log((1 + x) / (1 - x));
}

export function gammaFrom(eta: number, sigma: number): number {
  if (!(sigma > 0)) return Number.NaN;
  return atanh(eta) / sigma;
}

export function etaFromGamma(gamma: number, sigma: number): number {
  if (!Number.isFinite(gamma) || !Number.isFinite(sigma)) return Number.NaN;
  return Math.tanh(sigma * gamma);
}

export function domainGamma(d: Domain): number {
  return gammaFrom(d.eta, d.sigma);
}

export function bandFor(gamma: number) {
  if (!Number.isFinite(gamma) || gamma < 0) return BANDS[0];
  return BANDS.find((b) => gamma < b.to) ?? BANDS[BANDS.length - 1];
}

export function formatGamma(g: number, digits = 4): string {
  if (!Number.isFinite(g)) return "∞";
  if (g > 8) return "> 8";
  if (g < 0) return g.toFixed(digits);
  return g.toFixed(digits);
}

export function formatEta(eta: number): string {
  return eta.toFixed(3);
}

export function clampEta(n: number): number {
  return Math.min(ETA_MAX, Math.max(ETA_MIN, n));
}

export function clampSigma(n: number): number {
  return Math.min(SIGMA_MAX, Math.max(SIGMA_MIN, n));
}

export function nearestDomains(gamma: number, pool: Domain[], n = 2): Domain[] {
  return [...pool]
    .sort(
      (a, b) =>
        Math.abs(domainGamma(a) - gamma) - Math.abs(domainGamma(b) - gamma),
    )
    .slice(0, n);
}

export function curvePoints(sigma: number, samples = 160): { eta: number; gamma: number }[] {
  const pts: { eta: number; gamma: number }[] = [];
  for (let i = 0; i < samples; i += 1) {
    const eta = ETA_MIN + (i / (samples - 1)) * (ETA_MAX - ETA_MIN);
    pts.push({ eta, gamma: gammaFrom(eta, sigma) });
  }
  return pts;
}
