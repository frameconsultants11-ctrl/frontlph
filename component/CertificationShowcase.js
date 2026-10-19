
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import CertificationCard from "./CertificationCard";

function CardSkeleton() {
  return (
    <div className="w-[260px] shrink-0 animate-pulse rounded-xl border border-slate-200 p-3 sm:w-auto">
      <div className="h-[150px] rounded-lg bg-slate-100" />
      <div className="mt-4 h-3 w-1/3 rounded bg-slate-100" />
      <div className="mt-3 h-4 w-4/5 rounded bg-slate-200" />
      <div className="mt-2 h-3 w-full rounded bg-slate-100" />
      <div className="mt-6 h-5 w-1/3 rounded bg-slate-100" />
    </div>
  );
}

export default function CertificationShowcase() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePage, setActivePage] = useState(0);
  const trackRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCertifications() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/certifications?limit=9", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Could not load certifications.");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Could not load certifications.");
        }

        setItems(result.data || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadCertifications();

    return () => controller.abort();
  }, []);

  const scroll = (direction) => {
    if (!trackRef.current) return;

    trackRef.current.scrollBy({
      left: direction * trackRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  const updatePage = () => {
    const track = trackRef.current;
    if (!track) return;

    const pageWidth = track.clientWidth || 1;
    setActivePage(Math.round(track.scrollLeft / pageWidth));
  };

  const pageCount = Math.max(
    1,
    Math.ceil(items.length / 3)
  );

  return (
    <section className="overflow-hidden bg-white py-14 sm:py-16 lg:py-20 font-sans">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1 w-7 rounded-full bg-[#0039bd]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0039bd]">
                LearnPerHour certifications
              </span>
            </div>

            <h2 className="text-2xl font-semibold tracking-tight text-[#060B1F] sm:text-3xl lg:text-4xl">
              Certification Preparation{" "}
              <span className="text-[#0039bd]">We Offer</span>
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Find the certification you want to prepare for.
            </p>
          </div>

          <Link
            href="/certifications"
            className="hidden items-center gap-2 text-sm font-semibold text-[#0039bd] transition hover:text-blue-800 sm:inline-flex"
          >
            View all certifications
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Cards */}
        <div className="relative mt-8">
          {items.length > 3 && !loading && (
            <div className="mb-4 hidden justify-end gap-2 sm:flex">
              <button
                type="button"
                onClick={() => scroll(-1)}
                aria-label="Previous certifications"
                className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-[#0039bd] transition hover:border-[#0039bd] hover:bg-blue-50"
              >
                <ArrowLeft size={16} />
              </button>

              <button
                type="button"
                onClick={() => scroll(1)}
                aria-label="Next certifications"
                className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-[#0039bd] transition hover:border-[#0039bd] hover:bg-blue-50"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }, (_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
              {error}
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-xl border border-slate-200 p-8 text-center text-sm text-slate-500">
              No certifications are available right now.
            </div>
          ) : (
            <div
              ref={trackRef}
              onScroll={updatePage}
              className="grid grid-flow-col auto-cols-[82%] gap-4 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory sm:auto-cols-[calc((100%-1rem)/2)] lg:grid-flow-row lg:grid-cols-3 lg:overflow-visible lg:pb-0"
            >
              {items.map((item) => (
                <div
                  key={item.id}
                  className="h-full min-w-0 snap-start"
                >
                  <CertificationCard item={item} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination indicators */}
        {!loading && items.length > 3 && (
          <div className="mt-5 flex items-center justify-center gap-2 lg:hidden">
            {Array.from({ length: pageCount }, (_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to certification page ${index + 1}`}
                onClick={() => {
                  trackRef.current?.scrollTo({
                    left: index * (trackRef.current.clientWidth || 0),
                    behavior: "smooth",
                  });
                }}
                className={`h-2 rounded-full transition-all ${
                  activePage === index
                    ? "w-7 bg-[#0039bd]"
                    : "w-2 bg-slate-300 hover:bg-[#0039bd]/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/certifications"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-xs font-semibold text-[#060B1F] transition hover:border-[#0039bd] hover:bg-blue-50 hover:text-[#0039bd]"
          >
            Explore All Certifications
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
