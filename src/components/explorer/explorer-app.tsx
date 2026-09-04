import { useMemo, useState } from "react";
import { Activity, ExternalLink, Info, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { TooltipProvider } from "@/components/ui/tooltip";
import { EtaCurve } from "@/components/explorer/eta-curve";
import { GammaAxis } from "@/components/explorer/gamma-axis";
import {
  BANDS,
  DOMAINS,
  ETA_MAX,
  ETA_MIN,
  SIGMA_DEFAULT,
  SIGMA_MAX,
  SIGMA_MIN,
  atanh,
  bandFor,
  clampEta,
  clampSigma,
  domainGamma,
  formatEta,
  formatGamma,
  gammaFrom,
  nearestDomains,
  type Domain,
} from "@/lib/crep";
import { cn } from "@/lib/utils";

const SNAPS = ["amazon", "amoc", "brain", "solar"] as const;

const ETA_MARKS = [
  { id: "solar", at: 0.03, label: "0.03" },
  { id: "amazon", at: 0.25, label: "0.25" },
  { id: "amoc", at: 0.5, label: "0.50" },
] as const;

export function ExplorerApp() {
  const [eta, setEta] = useState(0.5);
  const [sigma, setSigma] = useState(SIGMA_DEFAULT);
  const [showAll, setShowAll] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>("amoc");

  const liveGamma = gammaFrom(eta, sigma);
  const band = bandFor(liveGamma);
  const pool = showAll ? DOMAINS : DOMAINS.filter((d) => d.core);
  const selected = DOMAINS.find((d) => d.id === selectedId) ?? null;
  const nearest = nearestDomains(liveGamma, pool, 2);

  function snap(d: Domain) {
    if (!d.core) setShowAll(true);
    setEta(d.eta);
    setSigma(d.sigma);
    setSelectedId(d.id);
  }

  function onEta(next: number) {
    const v = clampEta(next);
    setEta(v);
    const match = DOMAINS.find(
      (d) => Math.abs(d.eta - v) < 0.004 && Math.abs(d.sigma - sigma) < 0.02,
    );
    setSelectedId(match?.id ?? null);
  }

  function onSigma(next: number) {
    const v = clampSigma(next);
    setSigma(v);
    const match = DOMAINS.find(
      (d) => Math.abs(d.eta - eta) < 0.004 && Math.abs(d.sigma - v) < 0.02,
    );
    setSelectedId(match?.id ?? null);
  }

  const atanhEta = atanh(eta);
  const between = useMemo(() => {
    const sorted = [...pool].sort((a, b) => domainGamma(a) - domainGamma(b));
    if (!Number.isFinite(liveGamma) || sorted.length === 0) return null;
    const higher = sorted.find((d) => domainGamma(d) >= liveGamma);
    const lower = [...sorted].reverse().find((d) => domainGamma(d) <= liveGamma);
    if (lower && higher && lower.id !== higher.id) {
      return `zwischen ${lower.shortName} (${formatGamma(domainGamma(lower), 3)}) und ${higher.shortName} (${formatGamma(domainGamma(higher), 3)})`;
    }
    if (lower && !higher) return `oberhalb von ${lower.shortName}`;
    if (higher) return `unterhalb von ${higher.shortName}`;
    return null;
  }, [pool, liveGamma]);

  return (
    <TooltipProvider delayDuration={180}>
      <div className="min-h-dvh bg-background pb-16">
        <header className="border-b border-border">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-end md:justify-between md:py-10">
            <div className="max-w-2xl">
              <p className="text-xs font-medium tracking-label text-muted-foreground uppercase">
                GenesisAeon · CREP-Vergleichsrahmen
              </p>
              <h1 className="font-display mt-2 text-4xl leading-tight tracking-display text-foreground italic sm:text-5xl">
                Γ-Universalitäts-Explorer
              </h1>
              <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
                Zwei Slider, eine Achse: wie sich{" "}
                <span className="font-display italic text-foreground">Γ = arctanh(η) / σ</span>{" "}
                über AMOC, Amazonas und weitere Pakete legt.
              </p>
            </div>
            <p className="font-mono text-xs tabular-nums text-subtle md:text-right">
              σ-Standard = 2.2
              <br />
              Pakete 17–21 + SOC / Ledger
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
          <aside className="rounded-lg bg-secondary/80 px-4 py-4 shadow-[var(--shadow-border)] sm:px-5">
            <div className="flex gap-3">
              <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <div className="space-y-1.5 text-sm leading-relaxed">
                <p className="font-medium text-foreground">
                  Vergleichsrahmen, kein Naturgesetz
                </p>
                <p className="text-muted-foreground">
                  Γ = arctanh(η)/σ ist die Inversion der UTAC-Fixpunktgleichung{" "}
                  <span className="font-display italic text-foreground">H* = K · tanh(σ · Γ)</span>.
                  Das ist <span className="text-foreground">keine bewiesene universelle Naturkonstante</span> und
                  nicht «die eine Formel für alles». Die Punkte sind Kalibrierungen aus dem
                  GenesisAeon-Ökosystem — ein gemeinsames Koordinatensystem, kein Nachweis, dass
                  Ozean, Kortex und Regenwald dieselben Mechanismen teilen.
                </p>
              </div>
            </div>
          </aside>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)] sm:p-6">
              <p className="text-xs font-medium tracking-label text-muted-foreground uppercase">
                Live-Γ
              </p>
              <p className="font-display mt-2 text-6xl leading-none tracking-display text-live italic tabular-nums sm:text-7xl">
                {formatGamma(liveGamma)}
              </p>
              <p className="mt-4 font-mono text-sm text-muted-foreground tabular-nums">
                arctanh({formatEta(eta)}) / {sigma.toFixed(2)} = {formatGamma(liveGamma)}
              </p>
              <p className="mt-1 font-mono text-xs text-subtle tabular-nums">
                arctanh(η) = {Number.isFinite(atanhEta) ? atanhEta.toFixed(4) : "∞"}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Badge variant="accent">{band?.label}</Badge>
                {between ? (
                  <span className="text-sm text-muted-foreground">{between}</span>
                ) : null}
              </div>
              {nearest[0] ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Nächster Punkt:{" "}
                  <button
                    type="button"
                    className="text-foreground underline decoration-border underline-offset-4 hover:decoration-primary"
                    onClick={() => snap(nearest[0])}
                  >
                    {nearest[0].name}
                  </button>
                  <span className="font-mono text-xs tabular-nums">
                    {" "}
                    Δ {formatGamma(Math.abs(domainGamma(nearest[0]) - liveGamma), 3)}
                  </span>
                </p>
              ) : null}
            </section>

            <section className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)] sm:p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-xl italic">Parameter</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEta(0.5);
                    setSigma(SIGMA_DEFAULT);
                    setSelectedId("amoc");
                  }}
                >
                  <RotateCcw />
                  AMOC-Setpoint
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-baseline justify-between gap-3">
                    <label htmlFor="eta-slider" className="text-sm font-medium">
                      Wirkungsgrad η
                    </label>
                    <span className="font-mono text-sm tabular-nums text-foreground">
                      {formatEta(eta)}{" "}
                      <span className="text-subtle">({(eta * 100).toFixed(1)} %)</span>
                    </span>
                  </div>
                  <Slider
                    id="eta-slider"
                    min={ETA_MIN}
                    max={ETA_MAX}
                    step={0.001}
                    value={[eta]}
                    onValueChange={(v) => onEta(v[0] ?? eta)}
                    aria-label="Eta, Wirkungsgrad H Stern durch K"
                  />
                  <div className="relative mt-1 h-4 text-2xs text-subtle">
                    {ETA_MARKS.map((m) => (
                      <span
                        key={m.id}
                        className="absolute -translate-x-1/2 whitespace-nowrap"
                        style={{
                          left: `${(((m.at - ETA_MIN) / (ETA_MAX - ETA_MIN)) * 100).toFixed(3)}%`,
                        }}
                      >
                        {m.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline justify-between gap-3">
                    <label htmlFor="sigma-slider" className="text-sm font-medium">
                      Kopplung σ
                    </label>
                    <span className="font-mono text-sm tabular-nums">{sigma.toFixed(2)}</span>
                  </div>
                  <Slider
                    id="sigma-slider"
                    min={SIGMA_MIN}
                    max={SIGMA_MAX}
                    step={0.01}
                    value={[sigma]}
                    onValueChange={(v) => onSigma(v[0] ?? sigma)}
                    aria-label="Sigma, CREP-Kopplungskonstante"
                  />
                  <div className="mt-1 flex justify-between text-2xs text-subtle">
                    <span>{SIGMA_MIN.toFixed(1)}</span>
                    <button
                      type="button"
                      className="text-foreground underline decoration-border underline-offset-2"
                      onClick={() => onSigma(SIGMA_DEFAULT)}
                    >
                      Ökosystem 2.2
                    </button>
                    <span>{SIGMA_MAX.toFixed(1)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {SNAPS.map((id) => {
                    const d = DOMAINS.find((x) => x.id === id);
                    if (!d) return null;
                    return (
                      <Button
                        key={id}
                        variant={selectedId === id ? "default" : "secondary"}
                        size="sm"
                        onClick={() => snap(d)}
                      >
                        {d.shortName}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>

          <GammaAxis
            eta={eta}
            sigma={sigma}
            liveGamma={liveGamma}
            domains={pool}
            selectedId={selectedId}
            onSelect={(id) => {
              const d = DOMAINS.find((x) => x.id === id);
              if (d) snap(d);
            }}
            onEta={onEta}
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Switch
                id="show-all"
                checked={showAll}
                onCheckedChange={setShowAll}
                aria-label="Weitere Ökosystem-Pakete anzeigen"
              />
              <label htmlFor="show-all" className="text-sm text-foreground">
                Weitere Pakete aus dem Ökosystem
              </label>
            </div>
            <p className="text-xs text-subtle">
              {pool.length} {pool.length === 1 ? "Domäne" : "Domänen"} auf der Achse
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <EtaCurve
              eta={eta}
              sigma={sigma}
              liveGamma={liveGamma}
              domains={pool}
              selectedId={selectedId}
            />

            <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-6">
              <h2 className="font-display text-xl italic">Domänen</h2>
              <p className="mt-1 mb-4 text-sm text-muted-foreground">
                Tippen setzt η und σ auf die Paket-Kalibrierung. Tooltips auf der Achse tragen
                die reale Bedeutung.
              </p>
              <ul className="max-h-96 space-y-2 overflow-y-auto pr-1">
                {pool
                  .slice()
                  .sort((a, b) => domainGamma(a) - domainGamma(b))
                  .map((d) => {
                    const g = domainGamma(d);
                    const active = selectedId === d.id;
                    const delta = Number.isFinite(liveGamma)
                      ? liveGamma - g
                      : Number.NaN;
                    return (
                      <li key={d.id}>
                        <button
                          type="button"
                          id={`domain-${d.id}`}
                          onClick={() => snap(d)}
                          className={cn(
                            "w-full rounded-md px-3 py-3 text-left transition-[background-color,box-shadow] duration-150",
                            active
                              ? "bg-secondary shadow-[0_0_0_1px_var(--color-primary)]"
                              : "bg-background/40 shadow-[var(--shadow-border)] hover:bg-secondary/70",
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium text-foreground">{d.name}</p>
                              <p className="text-xs text-subtle">
                                {d.field}
                                {d.packageId ? ` · Paket ${d.packageId}` : ""} · {d.packageName}
                              </p>
                            </div>
                            {d.core ? (
                              <Badge variant="accent">Kern</Badge>
                            ) : (
                              <Badge>Ökosystem</Badge>
                            )}
                          </div>
                          <p className="mt-2 font-mono text-xs tabular-nums text-muted-foreground">
                            Γ {formatGamma(g, 3)}
                            {Math.abs(g - d.gammaPublished) > 0.004
                              ? ` · geführt ${d.gammaPublished}`
                              : ""}
                            {" · "}η {d.eta.toFixed(2)} · σ {d.sigma.toFixed(1)}
                            {Number.isFinite(delta)
                              ? ` · Δ ${delta >= 0 ? "+" : ""}${formatGamma(delta, 3)}`
                              : ""}
                          </p>
                          <p className="mt-1.5 text-sm text-muted-foreground">{d.etaMeaning}</p>
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </section>
          </div>

          {selected ? (
            <section className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)] sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium tracking-label text-muted-foreground uppercase">
                    Gewählte Kalibrierung
                  </p>
                  <h2 className="font-display mt-1 text-2xl italic">{selected.name}</h2>
                </div>
                <a
                  href={selected.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-md px-3 text-sm text-foreground shadow-[var(--shadow-border)] hover:bg-secondary"
                >
                  Repository
                  <ExternalLink className="size-4" />
                </a>
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                {selected.meaning}
              </p>
            </section>
          ) : null}

          <section className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)] sm:p-6">
            <h2 className="font-display flex items-center gap-2 text-xl italic">
              <Activity className="size-4 text-primary" aria-hidden />
              Die Formel in diesem Ökosystem
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <FormulaCard
                title="Fixpunkt"
                body="H* = K · tanh(σ · Γ)"
                note="Relative Höhe des UTAC-Zustands."
              />
              <FormulaCard
                title="Wirkungsgrad"
                body="η = H* / K"
                note="Anteil am jeweiligen Maximum — Abschwächung, Entwaldung, Flare-Energie."
              />
              <FormulaCard
                title="Inversion"
                body="Γ = arctanh(η) / σ"
                note="Dieselbe Abbildung, rückwärts. σ ist fast immer 2.2."
              />
            </div>
            <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
              {BANDS.map((b) => (
                <li key={b.id}>
                  <span className="font-medium text-foreground">{b.label}</span>
                  <span className="font-mono text-xs tabular-nums">
                    {" "}
                    Γ {b.from.toFixed(2)}–{b.to === 1.2 ? "…" : b.to.toFixed(2)}
                  </span>
                  <span> · {b.hint}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-subtle">
              Die Bandgrenzen sind eine Lesehilfe dieser Sandbox, keine veröffentlichten
              Schwellen der Pakete.
            </p>
          </section>

          <footer className="flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted-foreground">
            <p>
              Quellen im Ökosystem:{" "}
              {(
                [
                  ["Feldtheorie", "https://github.com/GenesisAeon/Feldtheorie"],
                  ["utac-core", "https://github.com/GenesisAeon/utac-core"],
                  ["amoc-utac", "https://github.com/GenesisAeon/amoc-utac"],
                  ["amazon-utac", "https://github.com/GenesisAeon/amazon-utac"],
                ] as const
              ).map(([label, href], i) => (
                <span key={label}>
                  {i > 0 ? " · " : null}
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-foreground underline decoration-border underline-offset-4 hover:decoration-primary"
                  >
                    {label}
                  </a>
                </span>
              ))}
            </p>
            <p className="text-xs text-subtle">
              Rundungsdifferenzen (AMOC: 0.2497 vs. geführt 0.251) bleiben sichtbar. Die Achse
              positioniert nach der exakten Inversion, nicht nach dem gerundeten Marketingwert.
            </p>
          </footer>
        </div>
      </div>
    </TooltipProvider>
  );
}

function FormulaCard({
  title,
  body,
  note,
}: {
  title: string;
  body: string;
  note: string;
}) {
  return (
    <div className="rounded-md bg-background/50 px-4 py-4 shadow-[var(--shadow-border)]">
      <p className="text-xs font-medium tracking-wide text-subtle uppercase">{title}</p>
      <p className="font-display mt-2 text-lg italic text-foreground">{body}</p>
      <p className="mt-2 text-sm text-muted-foreground">{note}</p>
    </div>
  );
}
