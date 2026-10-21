"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import DottedMap from "dotted-map";

const LIME = "#ccfc3b";

/* hub: where Learn Per Hour is based */
const HUB = { name: "Jaipur, India", lat: 26.9124, lng: 75.7873 };

/* cities our learners connect from (edit freely) */
const CITIES = [
  { name: "San Francisco", lat: 37.7749, lng: -122.4194 },
  { name: "Toronto", lat: 43.6532, lng: -79.3832 },
  { name: "New York", lat: 40.7128, lng: -74.006 },
  { name: "São Paulo", lat: -23.5505, lng: -46.6333 },
  { name: "London", lat: 51.5074, lng: -0.1278 },
  { name: "Berlin", lat: 52.52, lng: 13.405 },
  { name: "Nairobi", lat: -1.2921, lng: 36.8219 },
  { name: "Dubai", lat: 25.2048, lng: 55.2708 },
  { name: "Singapore", lat: 1.3521, lng: 103.8198 },
  { name: "Tokyo", lat: 35.6762, lng: 139.6503 },
  { name: "Sydney", lat: -33.8688, lng: 151.2093 },
];

const STATS = [
  { value: "25+", label: "Countries" },
  { value: "10K+", label: "Learners" },
  { value: "100+", label: "Mentors" },
  { value: "24/7", label: "Learning access" },
];

/* lat/lng -> position inside an 800x400 box */
const project = (lat, lng) => ({
  x: (lng + 180) * (800 / 360),
  y: (90 - lat) * (400 / 180),
});

const curve = (a, b) => {
  const midX = (a.x + b.x) / 2;
  const midY = Math.min(a.y, b.y) - Math.max(60, Math.abs(a.x - b.x) * 0.48);
  return `M ${a.x} ${a.y} Q ${midX} ${midY} ${b.x} ${b.y}`;
};

export function WorldMap({ hub = HUB, cities = CITIES, lineColor = LIME }) {
  const svgMap = useMemo(() => {
    const map = new DottedMap({ height: 100, grid: "diagonal" });
    return map.getSVG({
      radius: 0.22,
      color: "#ffffff45",
      shape: "circle",
      backgroundColor: "transparent",
    });
  }, []);

  const start = project(hub.lat, hub.lng);
  const points = cities.map((c) => ({ ...c, ...project(c.lat, c.lng) }));
  const pct = (p) => ({ left: `${(p.x / 800) * 100}%`, top: `${(p.y / 400) * 100}%` });

  return (
    <div className="relative aspect-[2/1] w-full select-none">
      {/* dotted world */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        alt="World map"
        draggable={false}
        className="pointer-events-none h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_8%,white_92%,transparent)]"
      />

      {/* connecting lines + dots */}
      <svg viewBox="0 0 800 400" className="pointer-events-none absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="lph-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0" />
            <stop offset="15%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="85%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {points.map((p, i) => (
          <motion.path
            key={`line-${p.name}`}
            d={curve(start, p)}
            fill="none"
            stroke="url(#lph-line)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.15 * i, ease: "easeOut" }}
          />
        ))}

        {points.map((p) => (
          <g key={`dot-${p.name}`}>
            <circle cx={p.x} cy={p.y} r="2" fill={lineColor} />
            <circle cx={p.x} cy={p.y} r="2" fill={lineColor} opacity="0.5">
              <animate attributeName="r" from="2" to="8" dur="1.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.5" to="0" dur="1.8s" repeatCount="indefinite" />
            </circle>
          </g>
        ))}

        {/* hub */}
        <circle cx={start.x} cy={start.y} r="3.5" fill="#ffffff" />
        <circle cx={start.x} cy={start.y} r="3.5" fill="#ffffff" opacity="0.6">
          <animate attributeName="r" from="3.5" to="14" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* labels (HTML so text stays crisp at any size) */}
      {points.map((p) => (
        <span
          key={`label-${p.name}`}
          style={pct(p)}
          className="pointer-events-none absolute hidden -translate-x-1/2 translate-y-2 whitespace-nowrap text-[10px] font-medium text-white/70 md:block"
        >
          {p.name}
        </span>
      ))}
      <span
        style={pct(start)}
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-8 whitespace-nowrap rounded-full bg-[#ccfc3b] px-2.5 py-1 text-[10px] font-bold text-[#060B1F] sm:text-xs"
      >
        Learn Per Hour · {hub.name}
      </span>
    </div>
  );
}

export default function GlobalReach({
  eyebrow = "Global reach",
  title = "Learning without borders",
  subtitle = "From Jaipur to the world. Learners and mentors connect with Learn Per Hour from every continent.",
  stats = STATS,
}) {
  return (
    <section className="w-full bg-white px-4 py-14 font-sans sm:px-6 lg:px-0 lg:py-0">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0039bd] via-[#184adf] to-[#0039bd] px-5 py-12 sm:px-10 lg:py-16">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#ccfc3b]/10 blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto max-w-2xl text-center">
          <p className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#ccfc3b]">
            {eyebrow}
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">{title}</h2>
          <p className="mt-4 text-sm text-white/60 sm:text-base">{subtitle}</p>
        </div>

        <div className="relative mt-8">
          <WorldMap />
        </div>

        <dl className="relative mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="px-4 py-4 text-center">
              <dt className="sr-only">{s.label}</dt>
              <dd className="text-2xl font-bold text-white sm:text-3xl">{s.value}</dd>
              <p className="mt-1 text-xs text-white/50">{s.label}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}