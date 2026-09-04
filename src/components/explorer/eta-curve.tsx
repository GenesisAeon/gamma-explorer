import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Scatter,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  ComposedChart,
} from "recharts";
import {
  SIGMA_DEFAULT,
  curvePoints,
  domainGamma,
  formatGamma,
  type Domain,
} from "@/lib/crep";

type Props = {
  eta: number;
  sigma: number;
  liveGamma: number;
  domains: Domain[];
  selectedId: string | null;
};

type TipPayload = {
  name?: string;
  eta?: number;
  gamma?: number;
  kind?: string;
};

function ChartTip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: TipPayload }[];
}) {
  if (!active || !payload?.[0]) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-md bg-popover px-3 py-2 text-xs shadow-[var(--shadow-border)]">
      <p className="font-medium text-popover-foreground">{p.name ?? "Kurve"}</p>
      <p className="mt-0.5 font-mono tabular-nums text-muted-foreground">
        η {p.eta?.toFixed(3)} · Γ {formatGamma(p.gamma ?? Number.NaN)}
      </p>
    </div>
  );
}

type ScatterShapeProps = {
  cx?: number;
  cy?: number;
  payload?: TipPayload;
};

function DomainDot({ cx = 0, cy = 0, payload }: ScatterShapeProps) {
  const selected = payload?.kind === "sel";
  const core = payload?.kind === "core";
  return (
    <circle
      cx={cx}
      cy={cy}
      r={selected ? 5.5 : 3.5}
      fill={core || selected ? "var(--color-primary)" : "var(--color-background)"}
      stroke="var(--color-primary)"
      strokeWidth={1.5}
    />
  );
}

function LiveDot({ cx = 0, cy = 0 }: ScatterShapeProps) {
  return (
    <rect
      x={cx - 4}
      y={cy - 4}
      width={8}
      height={8}
      fill="var(--color-live)"
      transform={`rotate(45 ${cx} ${cy})`}
    />
  );
}

export function EtaCurve({ eta, sigma, liveGamma, domains, selectedId }: Props) {
  const yMax = useMemo(() => {
    const domainMax = domains.reduce((m, d) => Math.max(m, domainGamma(d)), 0.45);
    const live = Number.isFinite(liveGamma) ? Math.min(liveGamma, 2.4) : 0;
    return Math.max(0.5, domainMax * 1.15, live * 1.2);
  }, [domains, liveGamma]);

  const refCurve = useMemo(
    () =>
      curvePoints(SIGMA_DEFAULT)
        .map((p) => ({ ...p, name: "σ = 2.2" }))
        .filter((p) => p.gamma <= yMax * 1.05),
    [yMax],
  );
  const liveCurve = useMemo(
    () =>
      curvePoints(sigma)
        .map((p) => ({ ...p, name: `σ = ${sigma.toFixed(2)}` }))
        .filter((p) => p.gamma <= yMax * 1.05),
    [sigma, yMax],
  );
  const domainPts = domains.map((d) => ({
    eta: d.eta,
    gamma: domainGamma(d),
    name: d.name,
    kind: d.id === selectedId ? "sel" : d.core ? "core" : "eco",
  }));
  const livePt = Number.isFinite(liveGamma)
    ? [{ eta, gamma: liveGamma, name: "Live", kind: "live" }]
    : [];

  const sameSigma = Math.abs(sigma - SIGMA_DEFAULT) < 0.005;

  return (
    <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-6">
      <header className="mb-4">
        <h2 className="font-display text-xl text-foreground italic">η → Γ bei festem σ</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {sameSigma
            ? "Bei σ = 2.2 (Ökosystem-Standard) liegen die Kalibrierungen auf derselben Kurve."
            : "Die blasse Kurve bleibt σ = 2.2. Dein σ verschiebt, wie steil η in Γ übersetzt wird."}
        </p>
      </header>
      <div className="h-56 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
            <CartesianGrid stroke="var(--color-border)" vertical={false} />
            <XAxis
              type="number"
              dataKey="eta"
              domain={[0, 1]}
              tick={{ fill: "var(--color-subtle)", fontSize: 11 }}
              tickFormatter={(v: number) => v.toFixed(1)}
              axisLine={{ stroke: "var(--color-border)" }}
              tickLine={false}
            />
            <YAxis
              type="number"
              dataKey="gamma"
              domain={[0, Number(yMax.toFixed(2))]}
              tick={{ fill: "var(--color-subtle)", fontSize: 11 }}
              tickFormatter={(v: number) => v.toFixed(2)}
              axisLine={false}
              tickLine={false}
              width={42}
            />
            <RechartsTooltip content={<ChartTip />} />
            <Line
              data={refCurve}
              dataKey="gamma"
              type="monotone"
              dot={false}
              stroke="var(--color-subtle)"
              strokeWidth={1.25}
              isAnimationActive={false}
              name="σ = 2.2"
            />
            <Line
              data={liveCurve}
              dataKey="gamma"
              type="monotone"
              dot={false}
              stroke="var(--color-primary)"
              strokeWidth={1.75}
              isAnimationActive={false}
            />
            <Scatter data={domainPts} shape={DomainDot} isAnimationActive={false} />
            <Scatter data={livePt} shape={LiveDot} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-subtle">
        Raute = Live-Punkt. Gefüllte Kreise = Kern (AMOC, Amazonas). Ringe = weitere Pakete.
      </p>
    </section>
  );
}
