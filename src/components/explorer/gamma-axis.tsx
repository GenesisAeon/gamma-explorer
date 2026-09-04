import { useEffect, useMemo, useRef, useState } from "react";
import {
  BANDS,
  clampEta,
  domainGamma,
  etaFromGamma,
  formatGamma,
  type Domain,
} from "@/lib/crep";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type Props = {
  eta: number;
  sigma: number;
  liveGamma: number;
  domains: Domain[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onEta: (eta: number) => void;
};

function pct(n: number): string {
  return `${n.toFixed(3)}%`;
}

function axisMax(live: number, domains: Domain[]): number {
  const domainMax = domains.reduce((m, d) => Math.max(m, domainGamma(d)), 0.45);
  const liveCap = Number.isFinite(live) ? Math.min(live * 1.18, 8) : 0;
  return Math.max(0.5, domainMax * 1.12, liveCap);
}

export function GammaAxis({
  eta,
  sigma,
  liveGamma,
  domains,
  selectedId,
  onSelect,
  onEta,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(720);
  const dragging = useRef(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const max = axisMax(liveGamma, domains);
  const compact = width < 560;
  const livePct = Number.isFinite(liveGamma)
    ? Math.max(0, Math.min(100, (liveGamma / max) * 100))
    : 100;

  const ticks = useMemo(() => {
    const step = max <= 0.6 ? 0.1 : max <= 1.2 ? 0.2 : 0.5;
    const out: number[] = [];
    for (let t = 0; t <= max + 1e-9; t += step) out.push(Number(t.toFixed(2)));
    return out;
  }, [max]);

  const labels = useMemo(() => {
    const sorted = [...domains].sort((a, b) => domainGamma(a) - domainGamma(b));
    const lo = sorted[0]?.id;
    const hi = sorted[sorted.length - 1]?.id;
    const taken: { pct: number; lane: 0 | 1 }[] = [];
    const minGap = compact ? 14 : 7;
    return sorted.map((d) => {
      const g = domainGamma(d);
      const pct = (g / max) * 100;
      let lane: 0 | 1 = d.id === "brain" ? 1 : 0;
      const collide = (ln: 0 | 1) =>
        taken.some((t) => t.lane === ln && Math.abs(t.pct - pct) < minGap);
      if (d.id !== "brain") lane = collide(0) ? 1 : 0;
      const showLabel =
        d.core || d.id === selectedId || d.id === "brain" || d.id === lo || d.id === hi;
      taken.push({ pct, lane });
      return { d, pct, g, lane, showLabel };
    });
  }, [domains, max, compact, selectedId]);

  function gammaFromClientX(clientX: number): number {
    const el = trackRef.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    const t = (clientX - r.left) / Math.max(1, r.width);
    return Math.max(0, Math.min(1, t)) * max;
  }

  function applyGamma(g: number) {
    onEta(clampEta(etaFromGamma(g, sigma)));
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest("[data-domain-marker]")) return;
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    applyGamma(gammaFromClientX(e.clientX));
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    applyGamma(gammaFromClientX(e.clientX));
  }

  function onPointerUp() {
    dragging.current = false;
  }

  const offscale = Number.isFinite(liveGamma) && liveGamma > max * 0.995;

  return (
    <section
      aria-label="Gemeinsame Gamma-Achse"
      className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-6"
    >
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl text-foreground italic">Gemeinsame Γ-Achse</h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Jeder Punkt ist eine Paket-Kalibrierung. Ziehen auf der Achse setzt η bei festem
            σ — so wandert das Live-Γ durch das Spektrum.
          </p>
        </div>
        <p className="font-mono text-xs tabular-nums text-subtle">
          η {eta.toFixed(3)} · σ {sigma.toFixed(2)} · Skala 0–{max.toFixed(2)}
        </p>
      </header>

      <div className="relative pt-10 pb-16">
        <div className="pointer-events-none absolute inset-x-3 top-0 h-8">
          {BANDS.map((b) => {
            const left = (b.from / max) * 100;
            const right = (Math.min(b.to, max) / max) * 100;
            if (right <= 0 || left >= 100) return null;
            const mid = (left + right) / 2;
            return (
              <span
                key={b.id}
                className="absolute top-1 -translate-x-1/2 text-2xs tracking-wide text-subtle uppercase"
                style={{ left: pct(mid) }}
              >
                {compact ? b.label.replace("-CREP", "").replace("Ultra-sensitiv", "Ultra") : b.label}
              </span>
            );
          })}
        </div>

        <div className="pointer-events-none absolute inset-x-3 top-10 h-10">
          {BANDS.map((b) => {
            const left = (b.from / max) * 100;
            const right = (Math.min(b.to, max) / max) * 100;
            if (right <= 0 || left >= 100) return null;
            return (
              <div
                key={b.id}
                className="absolute top-0 h-10 bg-band"
                style={{ left: pct(left), width: pct(Math.max(0, right - left)) }}
              />
            );
          })}
        </div>

        <div className="px-3">
          <div
            ref={trackRef}
            role="slider"
            tabIndex={0}
            aria-label="Live-Gamma auf der Achse"
            aria-valuemin={0}
            aria-valuemax={Number(max.toFixed(2))}
            aria-valuenow={Number.isFinite(liveGamma) ? Number(liveGamma.toFixed(4)) : 0}
            aria-valuetext={`Gamma ${formatGamma(liveGamma)}`}
            className="relative z-10 h-10 cursor-ew-resize touch-none rounded-sm"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={(e) => {
              const step = e.shiftKey ? 0.02 : 0.005;
              if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                e.preventDefault();
                applyGamma((Number.isFinite(liveGamma) ? liveGamma : 0) + step);
              }
              if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                e.preventDefault();
                applyGamma((Number.isFinite(liveGamma) ? liveGamma : 0) - step);
              }
            }}
          >
            <div className="absolute top-1/2 right-0 left-0 h-px bg-foreground/35" />

            {ticks.map((t) => (
              <span
                key={t}
                className="absolute top-1/2 h-2 w-px -translate-x-1/2 -translate-y-1/2 bg-foreground/35"
                style={{ left: pct((t / max) * 100) }}
              />
            ))}

            {labels.map(({ d, pct: pos, g, lane, showLabel }) => {
              const active = selectedId === d.id;
              return (
                <Tooltip key={d.id} delayDuration={200}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      data-domain-marker
                      aria-label={`${d.name}, Gamma ${formatGamma(g, 3)}`}
                      aria-pressed={active}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(d.id);
                      }}
                      className="absolute top-1/2 z-20 flex min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center"
                      style={{ left: pct(pos) }}
                    >
                      <span
                        className={cn(
                          "size-2.5 rounded-full transition-transform duration-150 ease-[var(--ease-out-soft)]",
                          d.core
                            ? "bg-primary"
                            : "bg-background shadow-[0_0_0_1.5px_var(--color-primary)]",
                          active &&
                            "scale-125 bg-live shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-primary)_35%,transparent)]",
                        )}
                      />
                      {showLabel ? (
                        <span
                          className={cn(
                            "pointer-events-none absolute left-1/2 -translate-x-1/2 font-sans text-micro whitespace-nowrap",
                            lane === 0 ? "top-full mt-1" : "top-full mt-6",
                            active || d.core ? "text-foreground" : "text-muted-foreground",
                          )}
                        >
                          {d.shortName}
                        </span>
                      ) : null}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="space-y-1">
                    <p className="font-medium text-foreground">{d.name}</p>
                    <p className="font-mono tabular-nums text-muted-foreground">
                      Γ = {formatGamma(g, 3)} · η = {d.eta.toFixed(2)} · σ = {d.sigma.toFixed(1)}
                    </p>
                    <p className="text-muted-foreground">{d.meaning}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}

            <div
              className="pointer-events-none absolute top-0 z-30 h-10 -translate-x-1/2"
              style={{ left: pct(offscale ? 100 : livePct) }}
            >
              <span className="absolute top-0 left-1/2 h-10 w-px -translate-x-1/2 bg-live" />
              <span className="absolute top-1/2 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-live" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
