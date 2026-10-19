"use client";

// Path: component/CourseSlider.jsx
// Horizontal, swipeable slider of course cards (no library needed).

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const money = (value) => `₹${Number(value ?? 0).toLocaleString("en-IN")}`;
const cap = (value = "") => (value ? value[0].toUpperCase() + value.slice(1) : "");

function SliderCard({ course }) {
  const hasDiscount = course.actualPrice < course.price;
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex h-full w-[260px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0039bd] sm:w-[280px]"
    >
      <div className="relative">
        {course.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={course.image} alt="" loading="lazy" className="aspect-video w-full object-cover" />
        ) : (
          <div className="aspect-video w-full bg-blue-50" />
        )}
        {course.topic && (
          <span className="absolute left-3 top-3 rounded-full bg-[#ccfc3b] px-2.5 py-1 text-xs font-bold text-[#00206b]">
            {course.topic}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 min-h-[2.75rem] text-[15px] font-semibold leading-snug text-[#060B1F] group-hover:text-[#0039bd]">
          {course.name}
        </h3>
        <p className="mt-1.5 text-xs text-slate-500">
          {course.hours} hours{course.level ? ` · ${cap(course.level)}` : ""}
        </p>
        <p className="mt-auto flex items-baseline gap-2 pt-3">
          <span className="text-base font-bold text-[#060B1F]">{money(course.actualPrice)}</span>
          {hasDiscount && <span className="text-xs text-slate-400 line-through">{money(course.price)}</span>}
        </p>
      </div>
    </Link>
  );
}

export default function CourseSlider({ title, courses = [], className = "" }) {
  const scroller = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update, courses.length]);

  const scrollByPage = (direction) => {
    const el = scroller.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: reduce ? "auto" : "smooth" });
  };

  if (!courses.length) return null;

  const arrow =
    "grid h-10 w-10 place-items-center rounded-full border border-slate-300 bg-white text-[#060B1F] transition-colors hover:border-[#0039bd] hover:text-[#0039bd] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-300 disabled:hover:text-[#060B1F]";

  return (
    <section className={className} aria-label={title}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-[#060B1F]">{title}</h2>
        {(canPrev || canNext) && (
          <div className="flex gap-2">
            <button type="button" onClick={() => scrollByPage(-1)} disabled={!canPrev} aria-label="Previous courses" className={arrow}>
              <ChevronLeft size={20} />
            </button>
            <button type="button" onClick={() => scrollByPage(1)} disabled={!canNext} aria-label="Next courses" className={arrow}>
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      <div
        ref={scroller}
        tabIndex={0}
        className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {courses.map((course) => (
          <SliderCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}