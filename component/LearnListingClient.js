"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight, Filter, Layers, Search, SlidersHorizontal, X } from "lucide-react";
import { CourseCard } from "./ToolsExplorer";
import { getListingConfig, listingBasePath } from "@/lib/listingConfig";

const slugify = (value = "") => String(value).toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
const money = (value) => `₹${Number(value ?? 0).toLocaleString("en-IN")}`;
const listParams = (value) => (value || "").split(",").filter(Boolean);

function FilterGroup({ title, options, selected, onToggle, initiallyOpen = false }) {
  const [open, setOpen] = useState(initiallyOpen);
  const [optionSearch, setOptionSearch] = useState("");
  if (!options?.length) return null;
  const visibleOptions = options.filter((option) => option.label.toLowerCase().includes(optionSearch.toLowerCase()));
  return (
    <section className="border-b border-slate-200 py-4 last:border-b-0">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between text-left text-sm font-semibold text-[#060B1F]">
        {title}<ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="mt-3">
        <label className="relative mb-3 block">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="search" value={optionSearch} onChange={(e) => setOptionSearch(e.target.value)} placeholder={`Search ${title.toLowerCase()}...`} className="h-8 w-full rounded-lg border border-slate-200 pl-8 pr-2 text-xs outline-none focus:border-[#0039bd]" />
        </label>
        <div className="max-h-36 space-y-3 overflow-y-auto pr-1 [scrollbar-width:thin]">
          {visibleOptions.map((option) => (
            <label key={option.value} className="flex cursor-pointer items-start gap-2.5 text-sm text-slate-600">
              <input type="checkbox" checked={selected.includes(option.value)} onChange={() => onToggle(option.value)} className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[#0039bd]" />
              <span className="min-w-0 flex-1">{option.label}</span>
              {option.count != null && <span className="text-xs text-slate-400">{option.count}</span>}
            </label>
          ))}
          {!visibleOptions.length && <p className="text-xs text-slate-400">No matches found.</p>}
        </div>
      </div>}
    </section>
  );
}

const OPTION_KEY = { subCategory: "subCategories", skills: "skills", tools: "tools", level: "levels", duration: "durations" };

export default function LearnListingClient({
  type = "courses",
  slug = "",
  subSlug = "",
  isAll = false,
  initialCategory,
  initialSub = null,
}) {
  const cfg = getListingConfig(type);
  const f = cfg.filters;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  const catSlug = isAll ? "" : initialCategory.slug || slug;
  const basePath = listingBasePath(cfg, catSlug);
  const plural = cfg.labelPlural.toLowerCase();

  // filters that stay as query params (category/subCategory are real pages, not queries)
  const queryKeys = useMemo(
    () => [f.skills && "skills", f.tools && "tools", f.level && "level", f.duration && "duration"].filter(Boolean),
    [f]
  );

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [mobileFilters, setMobileFilters] = useState(false);
  const [priceDraft, setPriceDraft] = useState([Number(searchParams.get("minPrice") || 0), Number(searchParams.get("maxPrice") || 10000)]);

  const updateParams = useCallback((updates, remove = []) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const key of remove) params.delete(key);
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === undefined || value === "") params.delete(key);
      else params.set(key, String(value));
    }
    if (!("page" in updates)) params.delete("page");
    router.replace(`${pathname}${params.size ? `?${params.toString()}` : ""}`, { scroll: false });
  }, [pathname, router, searchParams]);

  // subcategory always lives in the path: {basePath}/{subCategory}
  const currentSub = useMemo(() => {
    if (pathname.startsWith(`${basePath}/`)) {
      const part = pathname.slice(basePath.length + 1).split("/")[0];
      try { return decodeURIComponent(part).toLowerCase(); } catch { return part.toLowerCase(); }
    }
    return String(subSlug || "").toLowerCase();
  }, [pathname, basePath, subSlug]);

  const selected = useCallback(
    (key) => (key === "subCategory" ? (currentSub ? [currentSub] : []) : listParams(searchParams.get(key))),
    [searchParams, currentSub]
  );

  const toggle = useCallback((key, value) => {
    const values = new Set(selected(key));
    if (values.has(value)) values.delete(value); else values.add(value);
    updateParams({ [key]: [...values].join(",") || null });
  }, [selected, updateParams]);

  // keep other filters (search, price, sort...) but drop page when moving to a new page
  const carryQuery = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    params.delete("subCategory");
    params.delete("category");
    const qs = params.toString();
    return qs ? `?${qs}` : "";
  }, [searchParams]);

  // Category click -> /tools/top-tools-cloud-computing  (click the active one -> /tools/top-tools)
  const chooseCategory = useCallback((value) => {
    if (!data) return;
    if (!isAll && value === catSlug) return router.push(`${listingBasePath(cfg, "")}${carryQuery()}`);
    const category = data.categories.find((c) => (c.slug || slugify(c.name)) === value);
    if (category) router.push(`${listingBasePath(cfg, category.slug || slugify(category.name))}${carryQuery()}`);
  }, [data, isAll, catSlug, router, cfg, carryQuery]);

  // Subcategory click -> /tools/top-tools-cloud-computing/docker (works from the "all" page too)
  const chooseSubCategory = useCallback((value) => {
    if (!data) return;
    if (value === currentSub) return router.push(`${basePath}${carryQuery()}`); // untick -> category page
    const sub = data.subCategories.find((s) => (s.slug || slugify(s.name)).toLowerCase() === value);
    const category = isAll
      ? data.categories.find((c) => c._id === sub?.categoryId)
      : { slug: catSlug, name: initialCategory.name };
    if (!category) return;
    const target = listingBasePath(cfg, category.slug || slugify(category.name));
    router.push(`${target}/${value}${carryQuery()}`);
  }, [data, currentSub, basePath, isAll, catSlug, initialCategory, router, cfg, carryQuery]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    const params = new URLSearchParams(queryString);
    if (currentSub) params.set("subCategory", currentSub);
    const qs = params.toString();
    const url = `/api/learn/${type}${catSlug ? `/${encodeURIComponent(catSlug)}` : ""}${qs ? `?${qs}` : ""}`;
    fetch(url, { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || "Could not load data.");
        setData(result.data);
        setPriceDraft([result.data.filters.minPrice ?? 0, result.data.filters.maxPrice ?? result.data.priceBounds.max]);
      })
      .catch((err) => { if (err.name !== "AbortError") setError(err.message || "Could not load data."); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [type, catSlug, currentSub, queryString]);

  useEffect(() => { setSearch(searchParams.get("search") || ""); }, [queryString, searchParams]);

  const options = useMemo(() => {
    if (!data) return {};
    const toOptions = (items = []) => items.map((item) => ({ value: item.slug || slugify(item.name), label: item.name }));
    return {
      categories: toOptions(data.categories),
      subCategories: toOptions(data.subCategories).map((o) => ({ ...o, value: o.value.toLowerCase() })),
      skills: toOptions(data.skills),
      tools: toOptions(data.tools),
      levels: ["beginner", "intermediate", "advanced"].map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) })),
      durations: [{ value: "0-5", label: "Up to 5 hours" }, { value: "6-10", label: "6–10 hours" }, { value: "11-20", label: "11–20 hours" }, { value: "21+", label: "21+ hours" }],
    };
  }, [data]);

  const clearFilters = () => router.replace(basePath, { scroll: false });

  const removeFilterValue = (key, value) => {
    if (key === "subCategory") chooseSubCategory(value);
    else if (queryKeys.includes(key)) {
      const next = selected(key).filter((item) => item !== value);
      updateParams({ [key]: next.length ? next.join(",") : null });
    } else if (key === "price") updateParams({}, ["minPrice", "maxPrice"]);
    else updateParams({ [key]: null });
  };

  const priceMax = data?.priceBounds.max || 10000;
  const hasPrice = f.price && (searchParams.has("minPrice") || searchParams.has("maxPrice"));
  const filterKeys = ["subCategory", ...queryKeys];
  const activeCount = filterKeys.reduce((sum, key) => sum + selected(key).length, 0) + (hasPrice ? 1 : 0) + (searchParams.has("search") ? 1 : 0);
  const appliedFilters = [
    ...filterKeys.flatMap((key) => selected(key).map((value) => ({ key, value, label: options[OPTION_KEY[key]]?.find((o) => o.value === value)?.label || value }))),
    ...(searchParams.get("search") ? [{ key: "search", value: searchParams.get("search"), label: `Search: ${searchParams.get("search")}` }] : []),
    ...(hasPrice ? [{ key: "price", value: "price", label: `Price: ${money(searchParams.get("minPrice") || 0)} – ${money(searchParams.get("maxPrice") || priceMax)}` }] : []),
  ];

  const commitPrice = () => updateParams({ minPrice: priceDraft[0] || null, maxPrice: priceDraft[1] < priceMax ? priceDraft[1] : null });

  const filtersContent = data && (
    <>
      <FilterGroup title="Category" options={options.categories} selected={isAll ? [] : [catSlug]} onToggle={chooseCategory} initiallyOpen />
      <FilterGroup title="Subcategory" options={options.subCategories} selected={selected("subCategory")} onToggle={chooseSubCategory} initiallyOpen={!!currentSub} />
      {f.skills && <FilterGroup title="Skills" options={options.skills} selected={selected("skills")} onToggle={(v) => toggle("skills", v)} />}
      {f.tools && <FilterGroup title="Tools & technologies" options={options.tools} selected={selected("tools")} onToggle={(v) => toggle("tools", v)} />}
      {f.level && <FilterGroup title="Level" options={options.levels} selected={selected("level")} onToggle={(v) => toggle("level", v)} />}
      {f.duration && <FilterGroup title="Duration" options={options.durations} selected={selected("duration")} onToggle={(v) => toggle("duration", v)} />}
      {f.price && (
        <section className="border-b border-slate-200 py-4">
          <h3 className="text-sm font-semibold text-[#060B1F]">Price range</h3>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-600"><span>{money(priceDraft[0])}</span><span>{money(priceDraft[1])}</span></div>
          <div className="mt-3 space-y-3">
            <label className="block text-xs text-slate-500">Minimum price
              <input type="range" min="0" max={priceMax} step="100" value={Math.min(priceDraft[0], priceDraft[1])} onChange={(e) => setPriceDraft(([, max]) => [Math.min(Number(e.target.value), max), max])} onPointerUp={commitPrice} onTouchEnd={commitPrice} className="mt-2 w-full accent-[#0039bd]" />
            </label>
            <label className="block text-xs text-slate-500">Maximum price
              <input type="range" min="0" max={priceMax} step="100" value={Math.max(priceDraft[1], priceDraft[0])} onChange={(e) => setPriceDraft(([min]) => [min, Math.max(Number(e.target.value), min)])} onPointerUp={commitPrice} onTouchEnd={commitPrice} className="mt-2 w-full accent-[#0039bd]" />
            </label>
          </div>
        </section>
      )}
    </>
  );

  const title = initialSub
    ? `Explore ${initialSub.name} ${plural}`
    : isAll
      ? `Explore all ${plural}`
      : `Explore ${initialCategory.name} ${plural}`;

  return (
    <main className="min-h-screen bg-white font-sans px-4 sm:px-0">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="text-xl font-semibold text-[#060B1F]">{title}</h2><p className="mt-1 text-sm text-slate-500">{loading ? `Loading ${plural}…` : `${data?.total ?? 0} ${plural} found`}</p></div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative block w-full sm:w-64"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="search" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") updateParams({ search: search.trim() || null }); }} placeholder={`Search ${plural}…`} className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-[#0039bd] focus:ring-4 focus:ring-blue-100" /></label>
            <select aria-label="Sort" value={searchParams.get("sort") || "popular"} onChange={(e) => updateParams({ sort: e.target.value === "popular" ? null : e.target.value })} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#0039bd]">
              <option value="popular">Recommended</option><option value="newest">Newest</option>
              {f.price && <><option value="priceLow">Price: low to high</option><option value="priceHigh">Price: high to low</option></>}
              <option value="name">Name A–Z</option>
            </select>
            <button type="button" onClick={() => setMobileFilters(true)} className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm lg:hidden"><SlidersHorizontal size={16} />Filters{activeCount > 0 && <span className="rounded-full bg-[#ccfc3b] px-2 py-0.5 text-xs">{activeCount}</span>}</button>
          </div>
        </div>

        {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        {appliedFilters.length > 0 && <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold text-slate-500">Applied filters:</span>
          {appliedFilters.map((fl) => <button key={`${fl.key}-${fl.value}`} type="button" onClick={() => removeFilterValue(fl.key, fl.value)} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 hover:border-[#0039bd]">{fl.label}<X size={12} /></button>)}
          <button type="button" onClick={clearFilters} className="text-xs font-semibold text-[#0039bd] hover:underline">Clear all</button>
        </div>}

        <div className="grid gap-7 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="hidden h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-slate-200 px-5 [scrollbar-width:thin] lg:sticky lg:top-24 lg:block">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white py-4"><div className="flex items-center gap-2 font-semibold text-[#060B1F]"><Filter size={16} />Filters</div><button type="button" onClick={clearFilters} className="text-xs font-semibold text-[#0039bd] hover:underline">Clear all</button></div>
            {filtersContent}
          </aside>

          {mobileFilters && <div className="fixed inset-0 z-50 lg:hidden"><button type="button" aria-label="Close filters overlay" onClick={() => setMobileFilters(false)} className="absolute inset-0 bg-black/40" /><section className="absolute inset-y-0 right-0 w-[min(90vw,390px)] overflow-y-auto bg-white p-5 shadow-2xl"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Filters</h2><button type="button" onClick={() => setMobileFilters(false)} aria-label="Close filters"><X size={20} /></button></div><div className="mt-2">{filtersContent}</div><button type="button" onClick={() => setMobileFilters(false)} className="mt-5 w-full rounded-xl bg-[#0039bd] py-3 text-sm font-semibold text-white">Show results</button></section></div>}

          <section aria-live="polite" className="min-w-0">
            {loading ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="h-[340px] animate-pulse rounded-2xl bg-slate-100" />)}</div> :
              data?.items?.length ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{data.items.map((item, index) => <CourseCard key={item.id} tool={item} index={index} type={type.slice(0, -1)} />)}</div> :
              !error && <div className="rounded-2xl border border-slate-200 p-12 text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-[#0039bd]"><Layers size={25} /></div><h3 className="mt-4 text-lg font-semibold text-[#060B1F]">No {plural} match these filters</h3><p className="mt-2 text-sm text-slate-500">Try changing your filters or clearing them to see all {plural}.</p><button type="button" onClick={clearFilters} className="mt-4 rounded-full bg-[#0039bd] px-5 py-2.5 text-sm font-semibold text-white">Clear filters</button></div>}

            {data?.pageCount > 1 && <div className="mt-8 flex items-center justify-center gap-4"><button type="button" disabled={data.page <= 1} onClick={() => updateParams({ page: data.page - 1 })} className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm disabled:opacity-40"><ChevronLeft size={16} />Previous</button><span className="text-sm text-slate-500">Page {data.page} of {data.pageCount}</span><button type="button" disabled={data.page >= data.pageCount} onClick={() => updateParams({ page: data.page + 1 })} className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm disabled:opacity-40">Next<ChevronRight size={16} /></button></div>}
          </section>
        </div>
      </div>
    </main>
  );
}