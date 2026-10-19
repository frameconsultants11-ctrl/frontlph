"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  MotionConfig,
} from "framer-motion";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Tag,
  Layers,
} from "lucide-react";

/*
  Learn Per Hour brand:
  Blue: #0039bd
  Lime: #ccfc3b
  Ink:  #060B1F
*/

const formatPrice = (value) =>
  `₹${Number(value ?? 0).toLocaleString("en-IN")}`;

const capitalize = (value = "") =>
  value.charAt(0).toUpperCase() + value.slice(1);

// Category landing page URL. Change the route here if yours is different.
const slugify = (value) =>
  value
    ?.toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const categoryHref = (category) =>
  category
    ? `/courses/top-courses-${slugify(category.name || category.id)}`
    : "/courses";

function getToolDescription(tool) {
  if (tool.seoDescription) return tool.seoDescription;

  const paragraph = tool.details?.blocks?.find(
    (block) => block.type === "paragraph"
  );

  return (
    paragraph?.data?.text ||
    `Learn ${tool.name} with Learn Per Hour.`
  );
}

/* Shared classes: slider on mobile, grid from sm and up */
const TRACK_CLASSES =
  "flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:pb-0 xl:grid-cols-3";

const SLIDE_CLASSES = "w-[85%] shrink-0 snap-start sm:w-auto";

/* ============================================================
   COURSE CARD
============================================================ */

export function CourseCard({ tool, type, index }) {
  const price = Number(tool.price ?? 0);
  const actualPrice = Number(tool.actualPrice ?? 0);

  const hasDiscount =
    Number(tool.discount?.value ?? 0) > 0 &&
    price > actualPrice;

  const unit = tool.pricingType === "hourly" ? "/hr" : "";

  const discountLabel = tool.discount
    ? `${tool.discount.value}${
        tool.discount.type === "percentage" ? "%" : "₹"
      } off`
    : "";

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: "easeOut",
      }}
      className={`group w-full overflow-hidden rounded-[22px] border border-slate-300 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-md ${SLIDE_CLASSES}`}
    >
      <div className="flex h-full flex-col">
        {/* Course image banner */}
        <div className="relative h-[126px] shrink-0 overflow-hidden rounded-t-[21px] bg-[#f5f8ff]">
          {tool.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={tool.image}
              alt={tool.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0039bd]">
              <Layers size={32} className="text-white" />
            </div>
          )}

          {/* Subtle overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#060B1F]/20 to-transparent" />

          {/* Level badge */}
          {tool.level && (
            <span className="absolute right-3 top-3 rounded-full border border-lime-200/70 bg-lime-300 px-3 py-1 text-[10px] font-semibold text-[#060B1F] shadow-sm">
              {capitalize(tool.level)}
            </span>
          )}
        </div>

        {/* Card body */}
        <div className="flex flex-1 flex-col px-5 pb-4 pt-5">
          {/* Title */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {discountLabel && (
                <span className="rounded bg-[#ccfc3b] px-1.5 py-0.5 text-[10px] font-semibold text-[#060B1F]">
                  {discountLabel}
                </span>
              )}
              <h3 className="mt-2 truncate text-[22px] font-medium leading-tight tracking-tight text-[#060B1F]">
                {tool.name}
              </h3>
            </div>
          </div>

          {/* Description */}
          <p className="mt-2 line-clamp-2 min-h-[35px] text-[12px] leading-[1.5] text-slate-600">
            {tool.description ||
              `Learn ${tool.name} with Learn Per Hour.`}
          </p>

          {/* Pricing and enroll */}
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
            {/* Price */}
            <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-[14px] text-slate-500">
              <Tag size={11} className="shrink-0 text-slate-400" />

              <b className="font-semibold text-[#060B1F]">
                {formatPrice(tool.actualPrice)}
                {unit}
              </b>

              {hasDiscount && (
                <s className="text-xs text-slate-400">
                  {formatPrice(tool.price)}
                </s>
              )}
            </div>

            {/* Enroll Button */}
            <Link
              href={`/learning/${type}/${tool.slug}`}
              className="group inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#0039bd] px-4 py-2 text-[12px] font-medium text-white transition-all duration-600 ease-out hover:-translate-y-0.5 hover:bg-[#ccfc3b] hover:text-black hover:shadow-lg hover:shadow-blue-900/20 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0039bd]"
            >
              <span>Enroll now</span>

              <ArrowUpRight
                size={13}
                strokeWidth={2.5}
                className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ============================================================
   LOADING SKELETON
============================================================ */

function CardSkeleton() {
  return (
    <div className={`rounded-[26px] ${SLIDE_CLASSES}`}>
      <div className="animate-pulse overflow-hidden rounded-[20px] bg-white">
        <div className="h-[116px] bg-[#ccfc3b]/60" />

        <div className="space-y-3 px-5 pb-5 pt-[50px]">
          <div className="h-5 w-1/2 rounded bg-slate-200" />
          <div className="h-3 w-full rounded bg-slate-100" />
          <div className="h-3 w-2/3 rounded bg-slate-100" />
          <div className="h-8 w-1/2 rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   COURSE SLIDER
   Mobile: swipeable slider with arrows + dots
   sm and up: normal grid
============================================================ */

function CourseSlider({ tools, resetKey, active }) {
  const trackRef = useRef(null);
  const [current, setCurrent] = useState(0);

  const count = tools.length;

  // Work out which slide is currently at the left edge.
  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.children.length === 0) return;

    const first = track.children[0];
    const second = track.children[1];
    const step = second
      ? second.offsetLeft - first.offsetLeft
      : first.offsetWidth;

    if (!step) return;

    const index = Math.round(track.scrollLeft / step);
    setCurrent(Math.min(Math.max(index, 0), count - 1));
  }, [count]);

  // Go back to the first slide when the category or search changes.
  useEffect(() => {
    const track = trackRef.current;
    if (track) track.scrollLeft = 0;
    setCurrent(0);
  }, [resetKey, count]);

  const goTo = (index) => {
    const track = trackRef.current;
    const target = track?.children[index];
    if (!target) return;

    track.scrollTo({
      left: target.offsetLeft - track.offsetLeft,
      behavior: "smooth",
    });
  };

  const showControls = count > 1;

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className={TRACK_CLASSES}
        role="group"
        aria-roledescription="carousel"
        aria-label="Courses"
      >
        {tools.map((tool, index) => (
          <CourseCard key={tool.id} tool={tool} index={index} type='course' category={categoryHref(active)} />
        ))}
      </div>

      {/* Slider controls: mobile only */}
      {showControls && (
        <div className="mt-4 flex items-center justify-between sm:hidden">
          {/* Dots, or a counter when there are many slides */}
          {count <= 8 ? (
            <div className="flex items-center gap-1.5">
              {tools.map((tool, index) => (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Go to course ${index + 1}`}
                  aria-current={index === current}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === current
                      ? "w-6 bg-[#0039bd]"
                      : "w-2 bg-slate-300"
                  }`}
                />
              ))}
            </div>
          ) : (
            <p className="text-xs font-medium text-slate-500">
              {current + 1} / {count}
            </p>
          )}

          {/* Prev / Next */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goTo(current - 1)}
              disabled={current === 0}
              aria-label="Previous course"
              className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-[#060B1F] transition hover:bg-[#ccfc3b] disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={() => goTo(current + 1)}
              disabled={current >= count - 1}
              aria-label="Next course"
              className="grid h-9 w-9 place-items-center rounded-full bg-[#0039bd] text-white transition hover:bg-[#ccfc3b] hover:text-[#060B1F] disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   COURSE EXPLORER
============================================================ */

export default function CourseExplorer() {
  const [categories, setCategories] = useState([]);
  const [activeId, setActiveId] = useState(null);

  // Cache tools separately for each category.
  const [toolsByCat, setToolsByCat] = useState({});

  const [catLoading, setCatLoading] = useState(true);
  const [toolLoading, setToolLoading] = useState(false);

  const [catError, setCatError] = useState("");
  const [toolError, setToolError] = useState("");

  const [categoryRetry, setCategoryRetry] = useState(0);
  const [toolRetry, setToolRetry] = useState(0);

  const [search, setSearch] = useState("");

  // Prevent duplicate requests for the same category.
  const inflight = useRef(new Set());

  /* ----------------------------------------------------------
     LOAD CATEGORIES
  ---------------------------------------------------------- */

  useEffect(() => {
    const controller = new AbortController();

    async function loadCategories() {
      try {
        setCatLoading(true);
        setCatError("");

        const response = await fetch("/api/categories", {
          cache: "no-store",
          signal: controller.signal,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to load categories"
          );
        }

        const normalized = (result.data || []).map((category) => ({
          ...category,
          id: String(category._id ?? category.id),
        }));

        setCategories(normalized);

        setActiveId((currentId) => {
          if (
            currentId &&
            normalized.some((category) => category.id === currentId)
          ) {
            return currentId;
          }

          return normalized[0]?.id ?? null;
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Category loading error:", error);
          setCatError(
            error.message || "Couldn't load categories."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setCatLoading(false);
        }
      }
    }

    loadCategories();

    return () => controller.abort();
  }, [categoryRetry]);

  /* ----------------------------------------------------------
     LOAD TOOLS FOR SELECTED CATEGORY
  ---------------------------------------------------------- */

  useEffect(() => {
    if (!activeId) {
      setToolLoading(false);
      return;
    }

    // Use cached data when this category has already loaded.
    if (Object.prototype.hasOwnProperty.call(toolsByCat, activeId)) {
      setToolLoading(false);
      setToolError("");
      return;
    }

    const controller = new AbortController();
    const requestKey = `${activeId}:${toolRetry}`;

    setToolLoading(true);
    setToolError("");

    async function loadTools() {
      try {
        const response = await fetch(
          `/api/tools?category=${encodeURIComponent(activeId)}`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to load courses"
          );
        }

        const normalized = (result.data || []).map((tool) => ({
          ...tool,
          id: String(tool._id ?? tool.id),
          skillsCount: Array.isArray(tool.skills)
            ? tool.skills.length
            : 0,
          description: getToolDescription(tool),
        }));

        setToolsByCat((previous) => ({
          ...previous,
          [activeId]: normalized,
        }));
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Tools loading error:", error);
          setToolError(
            error.message || "Couldn't load courses."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setToolLoading(false);
        }
      }
    }

    // Avoid duplicate requests, including React Strict Mode.
    if (inflight.current.has(requestKey)) return;

    inflight.current.add(requestKey);

    loadTools().finally(() => {
      inflight.current.delete(requestKey);
    });

    return () => controller.abort();
  }, [activeId, toolRetry, toolsByCat]);

  /* ----------------------------------------------------------
     DERIVED STATE
  ---------------------------------------------------------- */

  const active = categories.find(
    (category) => category.id === activeId
  );

  const cachedTools = activeId ? toolsByCat[activeId] : undefined;

  const tools = (cachedTools || []).filter((tool) =>
    tool.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ----------------------------------------------------------
     RENDER
  ---------------------------------------------------------- */

  return (
    <MotionConfig reducedMotion="user">
      <section className="w-full bg-white px-4 py-16 font-sans md:py-24">
        <div className="mx-auto max-w-[1400px]">
          {/* Heading */}
          <div className="">
            <h2 className="text-3xl font-semibold leading-[1.1] tracking-tight text-[#060B1F] md:text-4xl">
              1 on 1 Mentorship{" "}
              Learn New Courses
            </h2>

            <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-500 md:text-base">
              Learn the most in-demand Courses and technologies at your own pace, with 1:1 mentors, hands-on
              projects and certification support, all on a schedule that fits your day.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:mt-12 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-10 ">
            {/* Category tabs */}
            <nav
              aria-label="Course categories"
              className="overflow-hidden rounded-2xl bg-gray-100 px-4 py-2 pb-1 lg:sticky lg:top-32 lg:self-start lg:py-8"
            >
              <p className="mb-3 hidden px-3 text-xs font-semibold text-gray-700 sm:block">
                Browse categories
              </p>

              <ul className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] lg:flex-col lg:gap-1 lg:overflow-visible">
                {categories.map((category) => {
                  const selected = category.id === activeId;

                  return (
                    <li key={category.id} className="shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveId(category.id);
                          setSearch("");
                          setToolError("");
                        }}
                        aria-pressed={selected}
                        className={`relative flex w-full items-center gap-3 whitespace-nowrap rounded-lg px-1.5 py-1 text-left text-sm font-medium transition-colors sm:px-3.5 sm:py-2.5 ${
                          selected
                            ? "text-[#0039bd]"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        {selected && (
                          <motion.span
                            layoutId="course-tab-active"
                            className="absolute inset-0 rounded-lg bg-white shadow-sm ring-1 ring-[#0039bd]/15"
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 40,
                            }}
                          />
                        )}

                        {selected && (
                          <motion.span
                            layoutId="course-tab-bar"
                            className="absolute bottom-2.5 left-0 top-2.5 hidden w-[3px] rounded-full bg-[#ccfc3b] lg:block"
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 40,
                            }}
                          />
                        )}

                        <span className="relative grid h-6 w-6 shrink-0 place-items-center">
                          {category.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={category.image}
                              alt=""
                              className="h-5 w-5 object-contain"
                              loading="lazy"
                            />
                          ) : (
                            <Layers size={16} />
                          )}
                        </span>

                        <span className="relative">
                          {category.name}
                        </span>
                      </button>
                    </li>
                  );
                })}

                {catLoading &&
                  categories.length === 0 &&
                  [0, 1, 2, 3].map((item) => (
                    <li
                      key={item}
                      className="h-10 w-32 shrink-0 animate-pulse rounded-xl bg-slate-200/60 lg:w-full"
                    />
                  ))}
              </ul>
            </nav>

            {/* Course content */}
            <div className="min-w-0">
              {catError ? (
                <div
                  role="alert"
                  className="rounded-2xl bg-white p-8 text-center"
                >
                  <p className="text-sm text-slate-500">
                    Couldn&apos;t load categories.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setCategoryRetry((value) => value + 1)
                    }
                    className="mt-3 text-sm font-semibold text-[#0039bd] underline"
                  >
                    Try again
                  </button>
                </div>
              ) : categories.length === 0 && !catLoading ? (
                <div className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500">
                  No active categories found.
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeId || "loading"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {/* Category title, view all and search */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-2xl font-semibold tracking-tight text-[#060B1F]">
                            {active?.name || "Explore Courses"}
                          </h3>
                        </div>
                        <div className="flex items-end gap-4">
                          <p className="mt-1 text-sm text-slate-500">
                            {toolLoading
                              ? "Finding courses..."
                              : `${tools.length} ${
                                  tools.length === 1
                                    ? "Course"
                                    : "Courses"
                                } available`}
                          </p>
                          {active && (
                            <Link
                              href={categoryHref(active)}
                              className="group inline-flex items-center text-[12px] font-medium text-[#0039bd] transition-all duration-300  hover:text-[#060B1F]"
                            >
                              View all
                              <ArrowUpRight
                                size={12}
                                strokeWidth={2.5}
                                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                              />
                            </Link>
                          )}
                        </div>
                      </div>

                      <label className="block w-full sm:max-w-[250px]">
                        <span className="sr-only">
                          Search courses
                        </span>

                        <input
                          type="search"
                          value={search}
                          onChange={(event) =>
                            setSearch(event.target.value)
                          }
                          placeholder="Search Courses..."
                          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-[#060B1F] outline-none transition placeholder:text-slate-400 focus:border-[#0039bd] focus:ring-4 focus:ring-[#0039bd]/10"
                        />
                      </label>
                    </div>

                    {toolError ? (
                      <div
                        role="alert"
                        className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500"
                      >
                        <p>
                          Couldn&apos;t load courses for{" "}
                          {active?.name}.
                        </p>

                        <button
                          type="button"
                          onClick={() => {
                            if (activeId) {
                              setToolsByCat((previous) => {
                                const next = { ...previous };
                                delete next[activeId];
                                return next;
                              });
                            }

                            setToolRetry((value) => value + 1);
                          }}
                          className="mt-3 font-semibold text-[#0039bd] underline underline-offset-2"
                        >
                          Try again
                        </button>
                      </div>
                    ) : toolLoading || cachedTools === undefined ? (
                      <div className={TRACK_CLASSES}>
                        {[0, 1, 2].map((item) => (
                          <CardSkeleton key={item} />
                        ))}
                      </div>
                    ) : tools.length === 0 ? (
                      <div className="rounded-2xl bg-white p-10 text-center">
                        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#f0f4ff] text-[#0039bd]">
                          <Layers size={25} />
                        </div>

                        <p className="mt-4 text-base font-semibold text-[#060B1F]">
                          {search
                            ? "No matching tools found"
                            : `No tools in ${active?.name} yet`}
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                          {search
                            ? "Try searching with another course name."
                            : "Check back soon for new learning opportunities."}
                        </p>

                        {search && (
                          <button
                            type="button"
                            onClick={() => setSearch("")}
                            className="mt-4 rounded-full bg-[#0039bd] px-5 py-2 text-sm font-medium text-white"
                          >
                            Clear search
                          </button>
                        )}
                      </div>
                    ) : (
                      <>
                        <CourseSlider
                          tools={tools}
                          resetKey={`${activeId}:${search}`}
                          active={active}
                        />

                        {active && (
                          <div className="mt-8 flex justify-center">
                            <Link
                              href={categoryHref(active)}
                              className="group inline-flex items-center gap-2 rounded-full bg-[#060B1F] px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ccfc3b] hover:text-[#060B1F] hover:shadow-lg"
                            >
                              View all {active.name} courses
                              <ArrowUpRight
                                size={15}
                                strokeWidth={2.5}
                                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                              />
                            </Link>
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}