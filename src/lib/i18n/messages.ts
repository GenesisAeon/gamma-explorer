export type Locale = "de" | "en";

export type Messages = {
  language: string;
  documentTitle: string;
  eyebrow: string;
  title: string;
  leadBefore: string;
  leadAfter: string;
  sigmaStandard: string;
  packagesMeta: string;
  disclaimerHeading: string;
  disclaimerBodyBefore: string;
  disclaimerBodyMid: string;
  liveG: string;
  parameters: string;
  reset: string;
  showAllLabel: string;
  showAllAria: string;
  domainsCount: (n: number) => string;
  nearestPoint: string;
  between: (lower: string, lg: string, higher: string, hg: string) => string;
  above: (name: string) => string;
  below: (name: string) => string;
  domainsHeading: string;
  domainsHint: string;
  coreBadge: string;
  ecosystemBadge: string;
  selectedHeading: string;
  repository: string;
  formulaHeading: string;
  formulaFixpunktTitle: string;
  formulaFixpunktNote: string;
  formulaWirkungsgradTitle: string;
  formulaWirkungsgradNote: string;
  formulaInversionTitle: string;
  formulaInversionNote: string;
  bandHintNote: string;
  sourcesLabel: string;
  roundingNote: string;
  etaLabel: string;
  etaAria: string;
  sigmaEcosystem: string;
  packageLabel: (id: string) => string;
  publishedLabel: (v: string | number) => string;
  amocSetpoint: string;
};

export const messages: Record<Locale, Messages> = {
  de: {
    language: "Sprache",
    documentTitle: "Γ-Universalitäts-Explorer",
    eyebrow: "GenesisAeon · CREP-Vergleichsrahmen",
    title: "Γ-Universalitäts-Explorer",
    leadBefore: "Zwei Slider, eine Achse: wie sich",
    leadAfter: "über AMOC, Amazonas und weitere Pakete legt.",
    sigmaStandard: "σ-Standard = 2.2",
    packagesMeta: "Pakete 17–21 + SOC / Ledger",
    disclaimerHeading: "Vergleichsrahmen, kein Naturgesetz",
    disclaimerBodyBefore:
      "Γ = arctanh(η)/σ ist die Inversion der UTAC-Fixpunktgleichung",
    disclaimerBodyMid:
      "Das ist keine bewiesene universelle Naturkonstante und nicht «die eine Formel für alles». Die Punkte sind Kalibrierungen aus dem GenesisAeon-Ökosystem — ein gemeinsames Koordinatensystem, kein Nachweis, dass Ozean, Kortex und Regenwald dieselben Mechanismen teilen.",
    liveG: "Live-Γ",
    parameters: "Parameter",
    reset: "Reset",
    showAllLabel: "Weitere Pakete aus dem Ökosystem",
    showAllAria: "Weitere Ökosystem-Pakete anzeigen",
    domainsCount: (n) => (n === 1 ? "1 Domäne auf der Achse" : n + " Domänen auf der Achse"),
    nearestPoint: "Nächster Punkt:",
    between: (lower, lg, higher, hg) =>
      "zwischen " + lower + " (" + lg + ") und " + higher + " (" + hg + ")",
    above: (name) => "oberhalb von " + name,
    below: (name) => "unterhalb von " + name,
    domainsHeading: "Domänen",
    domainsHint:
      "Tippen setzt η und σ auf die Paket-Kalibrierung. Tooltips auf der Achse tragen die reale Bedeutung.",
    coreBadge: "Kern",
    ecosystemBadge: "Ökosystem",
    selectedHeading: "Gewählte Kalibrierung",
    repository: "Repository",
    formulaHeading: "Die Formel in diesem Ökosystem",
    formulaFixpunktTitle: "Fixpunkt",
    formulaFixpunktNote: "Relative Höhe des UTAC-Zustands.",
    formulaWirkungsgradTitle: "Wirkungsgrad",
    formulaWirkungsgradNote:
      "Anteil am jeweiligen Maximum — Abschwächung, Entwaldung, Flare-Energie.",
    formulaInversionTitle: "Inversion",
    formulaInversionNote: "Dieselbe Abbildung, rückwärts. σ ist fast immer 2.2.",
    bandHintNote:
      "Die Bandgrenzen sind eine Lesehilfe dieser Sandbox, keine veröffentlichten Schwellen der Pakete.",
    sourcesLabel: "Quellen im Ökosystem:",
    roundingNote:
      "Rundungsdifferenzen (AMOC: 0.2497 vs. geführt 0.251) bleiben sichtbar. Die Achse positioniert nach der exakten Inversion, nicht nach dem gerundeten Marketingwert.",
    etaLabel: "Wirkungsgrad η",
    etaAria: "Eta, Wirkungsgrad H Stern durch K",
    sigmaEcosystem: "Ökosystem 2.2",
    packageLabel: (id) => "Paket " + id,
    publishedLabel: (v) => "geführt " + v,
    amocSetpoint: "AMOC-Setpoint",
  },
  en: {
    language: "Language",
    documentTitle: "Γ-universality explorer",
    eyebrow: "GenesisAeon · CREP comparison frame",
    title: "Γ-universality explorer",
    leadBefore: "Two sliders, one axis: how",
    leadAfter: "sits across AMOC, Amazon and further packages.",
    sigmaStandard: "σ default = 2.2",
    packagesMeta: "Packages 17–21 + SOC / Ledger",
    disclaimerHeading: "Comparison frame, not a law of nature",
    disclaimerBodyBefore:
      "Γ = arctanh(η)/σ is the inversion of the UTAC fixed-point equation",
    disclaimerBodyMid:
      "This is not a proven universal constant of nature and not «the one formula for everything». The points are calibrations from the GenesisAeon ecosystem — a shared coordinate system, not evidence that ocean, cortex and rainforest share the same mechanisms.",
    liveG: "Live Γ",
    parameters: "Parameters",
    reset: "Reset",
    showAllLabel: "Further packages from the ecosystem",
    showAllAria: "Show further ecosystem packages",
    domainsCount: (n) => (n === 1 ? "1 domain on the axis" : n + " domains on the axis"),
    nearestPoint: "Nearest point:",
    between: (lower, lg, higher, hg) =>
      "between " + lower + " (" + lg + ") and " + higher + " (" + hg + ")",
    above: (name) => "above " + name,
    below: (name) => "below " + name,
    domainsHeading: "Domains",
    domainsHint:
      "Tap sets η and σ to the package calibration. Axis tooltips carry the real meaning.",
    coreBadge: "Core",
    ecosystemBadge: "Ecosystem",
    selectedHeading: "Selected calibration",
    repository: "Repository",
    formulaHeading: "The formula in this ecosystem",
    formulaFixpunktTitle: "Fixed point",
    formulaFixpunktNote: "Relative height of the UTAC state.",
    formulaWirkungsgradTitle: "Efficiency",
    formulaWirkungsgradNote:
      "Share of each maximum — weakening, deforestation, flare energy.",
    formulaInversionTitle: "Inversion",
    formulaInversionNote: "The same map, backwards. σ is almost always 2.2.",
    bandHintNote:
      "Band edges are a reading aid of this sandbox, not published package thresholds.",
    sourcesLabel: "Sources in the ecosystem:",
    roundingNote:
      "Rounding differences (AMOC: 0.2497 vs. published 0.251) stay visible. The axis positions by the exact inversion, not the rounded marketing value.",
    etaLabel: "Efficiency η",
    etaAria: "Eta, efficiency H star over K",
    sigmaEcosystem: "Ecosystem 2.2",
    packageLabel: (id) => "Package " + id,
    publishedLabel: (v) => "published " + v,
    amocSetpoint: "AMOC setpoint",
  },
};
