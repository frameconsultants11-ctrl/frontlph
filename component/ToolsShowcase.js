

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Wrench } from "lucide-react";

function ToolSkeleton() {
  return (
    <div className="flex w-full flex-col items-center gap-2.5">
      <div className="h-10 w-10 animate-pulse rounded-full bg-slate-100 sm:h-14 sm:w-14" />
      <div className="h-2.5 w-10 animate-pulse rounded bg-slate-100 sm:w-12" />
    </div>
  );
}

function ToolLogo({ tool }) {
  const [imageFailed, setImageFailed] = useState(false);

  const href = tool.href || `/tools/${tool.slug || ""}`;

  return (
    <Link
      href={`/courses?tools=${tool.name}`}
      title={tool.name}
      aria-label={`Explore ${tool.name}`}
      className="group flex w-full min-w-0 flex-col items-center gap-2 rounded-xl py-1.5 outline-none transition duration-300 focus-visible:ring-2 focus-visible:ring-[#0039bd] sm:gap-2.5 sm:py-2"
    >
      <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-100 bg-white shadow-[0_4px_16px_-10px_rgba(6,11,31,0.25)] transition duration-300 group-hover:-translate-y-1 group-hover:border-[#0039bd]/20 group-hover:shadow-[0_10px_22px_-12px_rgba(0,57,189,0.4)] sm:h-14 sm:w-14">
        {tool.image && !imageFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={tool.image}
            alt={tool.name || "Tool"}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-6 w-6 object-contain transition duration-300 group-hover:scale-110 sm:h-8 sm:w-8"
          />
        ) : (
          <span className="text-base font-bold text-[#0039bd] sm:text-lg">
            {tool.name?.charAt(0)?.toUpperCase() || "T"}
          </span>
        )}

        <span
          aria-hidden="true"
          className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#ccfc3b] opacity-0 transition group-hover:opacity-100"
        />
      </div>

      <span className="block w-full truncate px-0.5 text-center text-[9px] font-medium text-slate-500 transition group-hover:text-[#0039bd] sm:px-1 sm:text-[11px]">
        {tool.name}
      </span>
    </Link>
  );
}

export default function ToolsShowcase() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchTools() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/front/tools", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load tools right now.");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Unable to load tools.");
        }

        setTools(Array.isArray(result.data) ? result.data.slice(0, 24) : []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchTools();

    return () => controller.abort();
  }, []);

  // 24 tools: 9 in row 1, 8 in row 2, 7 in row 3.
  const rows = [
    tools.slice(0, 9),
    tools.slice(9, 17),
    tools.slice(17, 24),
  ];

  const skeletonRows = [9, 8, 7];

  return (
    <section className="relative overflow-hidden bg-gray-50 py-14 sm:py-20 lg:py-10 font-sans">
      {/* Soft blue background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-28 h-56 w-96 -translate-x-1/2 rounded-full bg-[#0039bd]/[0.035] blur-3xl"
      />

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-[#060B1F] sm:text-4xl lg:text-[42px]">
            Learn the tools.
            <br className="sm:hidden" /> Build your{" "}
            <span className="relative inline-block text-[#0039bd]">
              future.
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 -z-0 h-2.5 w-full bg-[#ccfc3b]/70"
              />
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Explore the technologies and industry tools that help you
            build practical skills and grow your career with LearnPerHour.
          </p>
        </div>

        {/* Centered 9–8–7 tools grid */}
        <div className="mx-auto mt-9 max-w-7xl sm:mt-12">
          <div className="relative ro px-2 py-6 sm:px-6 sm:py-8">
            {/* Lime accent */}
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-0 h-1 w-16 -translate-x-1/2 rounded-b-full bg-[#ccfc3b]"
            />

            {error ? (
              <div className="py-8 text-center">
                <p className="text-sm text-slate-500">{error}</p>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-3 text-sm font-semibold text-[#0039bd] hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : loading ? (
              <div className="flex flex-col items-center gap-5 sm:gap-7">
                {skeletonRows.map((count, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="flex w-full justify-center gap-1 sm:gap-4 lg:gap-6"
                  >
                    {Array.from({ length: count }, (_, index) => (
                      <div
                        key={index}
                        className="w-0 min-w-0 max-w-[90px] flex-1"
                      >
                        <ToolSkeleton />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : tools.length > 0 ? (
              <div className="flex flex-col items-center gap-5 sm:gap-7">
                {rows.map((rowTools, rowIndex) =>
                  rowTools.length > 0 ? (
                    <div
                      key={rowIndex}
                      className="flex w-full justify-center gap-1 sm:gap-4 lg:gap-6"
                    >
                      {rowTools.map((tool) => (
                        <div
                          key={tool.id || tool.slug || tool.name}
                          className="w-0 min-w-0 max-w-[90px] flex-1"
                        >
                          <ToolLogo tool={tool} />
                        </div>
                      ))}
                    </div>
                  ) : null
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center py-8 text-center">
                <Wrench
                  size={28}
                  className="text-[#0039bd]/50"
                  aria-hidden="true"
                />
                <p className="mt-3 text-sm text-slate-500">
                  Tools will appear here soon.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <p className="text-xs leading-5 text-slate-500">
            From cloud computing to development, discover tools for your next skill.
          </p>

          <Link
            href="/tools"
            className="group inline-flex items-center gap-2 rounded-full bg-[#0039bd] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#ccfc3b] hover:text-[#060B1F]"
          >
            Explore all tools

            <ArrowRight
              size={15}
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
