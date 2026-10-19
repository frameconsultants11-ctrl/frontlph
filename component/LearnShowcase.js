"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, BarChart3, Clock, Layers, Sparkles, Star } from "lucide-react";
import { getListingConfig, listingBasePath } from "@/lib/listingConfig";

const CARD_LIMIT = 6;

/* banner colours: [background, text, badge] */
const BANNERS = [
  ["bg-[#0039bd]", "text-white", "bg-[#ccfc3b] text-[#060B1F]"],
  ["bg-[#060B1F]", "text-white", "bg-[#ccfc3b] text-[#060B1F]"],
  ["bg-[#ccfc3b]", "text-[#060B1F]", "bg-[#060B1F] text-white"],
  ["bg-[#dbe6ff]", "text-[#0039bd]", "bg-[#0039bd] text-white"],
];

const slugOf = (x) =>
  x.slug || String(x.name || "").toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
const money = (v) => `₹${Number(v ?? 0).toLocaleString("en-IN")}`;
const cap = (v = "") => (v ? v[0].toUpperCase() + v.slice(1) : "");


function ShowcaseCard({ item, index, category }) {
  const [bg, text, badge] = BANNERS[index % BANNERS.length];

  const hasDiscount =
    Number(item.actualPrice) < Number(item.price);

  const off = hasDiscount
    ? Math.round(
        (1 - Number(item.actualPrice) / Number(item.price)) * 100
      )
    : 0;

  const rating = Number(item.rating ?? 4.5);
  const reviews = item.reviewCount ?? item.reviews ?? 0;

  return (
    <Link
      href={item.href}
      className="group flex h-full w-[345px] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#0039bd]/30 hover:shadow-xl sm:w-[270px]"
    >
      {/* Course image */}
      <div className={`relative h-[115px] overflow-hidden ${bg}`}>
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={item.name || "Course"}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className={`flex h-full items-center justify-center ${text}`}
          >
            <span className="text-5xl font-bold opacity-40">
              {item.name?.[0]?.toUpperCase() || "L"}
            </span>
          </div>
        )}

        {/* Discount badge */}
        {off > 0 && (
          <span className="absolute right-2 top-2 rounded-md bg-[#ccfc3b] px-2 py-1 text-[10px] font-bold text-[#060B1F] shadow-sm">
            {off}% OFF
          </span>
        )}
      </div>

      {/* Course information */}
      <div className="flex flex-1 flex-col p-3">
        {/* Category */}
        {category?.name && (
          <div className="mb-1.5 flex min-w-0 items-center gap-1.5">
            {category.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={category.image}
                alt=""
                className="h-4 w-4 shrink-0 object-contain"
              />
            )}

            <span className="truncate text-[11px] font-medium text-slate-500">
              {category.name}
            </span>
          </div>
        )}

        {/* Course title */}
        <h3 className="line-clamp-2 text-sm font-bold leading-5 text-[#060B1F] transition-colors group-hover:text-[#0039bd]">
          {item.name}
        </h3>

        {/* Description */}
        <p className="mt-1 line-clamp-2 text-xs leading-[1.05rem] text-slate-600">
          {item.description}
        </p>

        {/* Rating */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-bold text-[#060B1F]">
            {rating.toFixed(1)}
          </span>

          <span
            className="flex items-center gap-0.5 text-amber-500"
            aria-label={`${rating} out of 5 stars`}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-sm leading-none">
                {i < Math.round(rating) ? "★" : "☆"}
              </span>
            ))}
          </span>

          <span className="text-slate-400">
            ({reviews})
          </span>
        </div>

        {/* Price */}
        <div className="mt-auto flex items-end justify-between gap-2 border-t border-slate-100 mt-3">
          <div className="min-w-0">
            <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-base font-bold text-[#060B1F]">
                {money(item.actualPrice)}
              </span>

              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through">
                  {money(item.price)}
                </span>
              )}
            </p>

            {item.hours > 0 && (
              <p className="mt-1 text-[10px] text-slate-400">
                {item.hours} hours · Self-paced
              </p>
            )}
          </div>

          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#0039bd] text-white transition-colors group-hover:bg-[#ccfc3b] group-hover:text-[#060B1F]">
            <ArrowUpRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}

const Skeleton = () => (
  <div className="flex gap-4 overflow-hidden">
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className="w-[245px] shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white sm:w-[270px]"
      >
        <div className="h-[145px] animate-pulse bg-slate-200" />

        <div className="space-y-3 p-3">
          <div className="h-3 w-1/3 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
          <div className="mt-4 h-8 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
    ))}
  </div>
);




/* ---------------- main ---------------- */
export default function LearnShowcase({ type = "topics", eyebrow, title, subtitle }) {
  const cfg = getListingConfig(type);
  const lower = cfg.labelPlural.toLowerCase();

  const [categories, setCategories] = useState([]);
  const [catSlug, setCatSlug] = useState(""); // "" = Top pick (everything)
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const cache = useRef(new Map());

  const trackRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  /* load data for the selected category ("" = all) */
  useEffect(() => {
    const key = catSlug;
    const apply = (d) => {
      if (!key) setCategories(d.categories);
      setItems(d.items.slice(0, CARD_LIMIT));
      setTotal(d.total);
      setLoading(false);
    };

    setError("");
    if (cache.current.has(key)) return apply(cache.current.get(key));

    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/learn/${type}${key ? `/${encodeURIComponent(key)}` : ""}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((r) => {
        if (!r.success) throw new Error(r.message);
        cache.current.set(key, r.data);
        apply(r.data);
      })
      .catch((e) => {
        if (e.name !== "AbortError") { setError(`Could not load ${lower}.`); setLoading(false); }
      });
    return () => controller.abort();
  }, [type, catSlug, lower]);

  /* reset scroll + arrows when cards change */
  useEffect(() => {
    if (trackRef.current) trackRef.current.scrollTo({ left: 0 });
    const t = setTimeout(updateArrows, 50);
    window.addEventListener("resize", updateArrows);
    return () => { clearTimeout(t); window.removeEventListener("resize", updateArrows); };
  }, [items, updateArrows]);

  const scrollByCard = (dir) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  const byId = useMemo(() => new Map(categories.map((c) => [c._id, c])), [categories]);
  const activeCategory = categories.find((c) => slugOf(c) === catSlug);

  const viewAllHref = catSlug ? listingBasePath(cfg, catSlug) : cfg.listPath;
  const viewAllLabel = activeCategory ? `View all ${activeCategory.name} ${lower}` : `View all ${lower}`;

  return (
    <section className="w-full bg-white font-sans">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-14 sm:px-6 lg:px-0 lg:py-4">
        {/* ---------- heading ---------- */}
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0039bd]">
          {eyebrow || `Learn new skills from`}
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#060B1F] sm:text-4xl">
          {title || `Top ${cfg.label} Categories`}
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-slate-500 sm:text-base">
          {subtitle || `Pick a category and explore ${lower} built for real work, then stand out to recruiters.`}
        </p>

        {/* ---------- category pills (with images) ---------- */}
        <div className="-mx-4 mt-8 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0">
          {[{ _id: "top", name: "Top pick", slug: "", top: true }, ...categories].map((c) => {
            const slug = c.top ? "" : slugOf(c);
            const active = slug === catSlug;
            return (
              <button
                key={c._id}
                type="button"
                onClick={() => setCatSlug(slug)}
                aria-pressed={active}
                className={`flex shrink-0 items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm transition-colors ${
                  active
                    ? "border-[#0039bd] bg-white font-semibold text-[#060B1F] shadow-[0_0_0_1px_#0039bd]"
                    : "border-slate-200 bg-white text-slate-600 hover:border-[#0039bd]/50"
                }`}
              >
                {c.top ? (
                  <Sparkles size={18} className="text-[#0039bd]" />
                ) : c.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.image} alt="" className="h-5 w-5 object-contain" />
                ) : (
                  <Star size={16} className="text-slate-400" />
                )}
                <span className="whitespace-nowrap">{c.name}</span>
              </button>
            );
          })}
        </div>

        {/* ---------- carousel ---------- */}
        <div className="relative mt-6" aria-live="polite">
          {error ? (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
          ) : loading ? (
            <Skeleton />
          ) : items.length ? (
            <>
              <div
                ref={trackRef}
                onScroll={updateArrows}
                className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 [scrollbar-width:none]"
              >
                {items.map((item, i) => (
                  <ShowcaseCard key={item.id} item={item} index={i} category={byId.get(item.category) || activeCategory} />
                ))}
              </div>

              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                disabled={!canLeft}
                aria-label="Previous"
                className={`absolute left-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-white shadow-md transition-opacity sm:grid ${
                  canLeft ? "bg-[#060B1F] hover:bg-[#0039bd]" : "pointer-events-none bg-slate-300 opacity-0"
                }`}
              >
                <ArrowLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                disabled={!canRight}
                aria-label="Next"
                className={`absolute right-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-white shadow-md transition-opacity sm:grid ${
                  canRight ? "bg-[#060B1F] hover:bg-[#0039bd]" : "pointer-events-none bg-slate-300 opacity-0"
                }`}
              >
                <ArrowRight size={18} />
              </button>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 p-14 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[#0039bd]/10 text-[#0039bd]"><Layers size={22} /></div>
              <p className="mt-3 text-sm text-slate-500">No {lower} here yet. Try another category.</p>
            </div>
          )}
        </div>

        {/* ---------- view all ---------- */}
        {!loading && !error && (
          <div className="mt-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-sm text-slate-500">
              Showing <b className="font-semibold text-[#060B1F]">{items.length}</b> of{" "}
              <b className="font-semibold text-[#060B1F]">{total}</b> {lower}
            </p>
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-2 rounded-full bg-[#0039bd] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#ccfc3b] hover:text-[#060B1F]"
            >
              {viewAllLabel}
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}