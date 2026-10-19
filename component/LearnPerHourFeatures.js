
"use client";

import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  MonitorPlay,
  Sparkles,
  BriefcaseBusiness,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Structured Learning Paths",
    description:
      "Follow a clear, step-by-step roadmap designed to take you from fundamentals to practical, job-ready skills.",
    number: "01",
  },
  {
    icon: MonitorPlay,
    title: "Hands-on Projects",
    description:
      "Learn by doing with practical exercises, real-world projects, and skills you can demonstrate in your portfolio.",
    number: "02",
  },
  {
    icon: Sparkles,
    title: "Learn at Your Own Pace",
    description:
      "Build your skills around your schedule with flexible learning designed for your goals and experience level.",
    number: "03",
  },
  {
    icon: BriefcaseBusiness,
    title: "Career-Focused Skills",
    description:
      "Prepare for your next opportunity with in-demand technologies and practical knowledge that moves you forward.",
    number: "04",
  },
];

function useCountUp(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    let frame;
    let startTime;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;

      const progress = Math.min(
        (timestamp - startTime) / duration,
        1
      );

      // Smooth ease-out animation
      const eased = 1 - Math.pow(1 - progress, 4);

      setCount(Math.round(eased * target));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [started, target, duration]);

  return { ref, count };
}

export default function LearnPerHourFeatures() {
  const { ref, count } = useCountUp(99, 2200);

  return (
    <section className="relative isolate overflow-hidden bg-[#0039bd] text-white font-sans">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_50%,rgba(0,57,189,0.85),transparent_58%),radial-gradient(ellipse_at_90%_10%,rgba(0,57,189,0.28),transparent_45%)]" />

        <div
          className="absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.28) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.28) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#0039bd]/30 blur-[100px]" />

        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#ccfc3b]/10 blur-[110px]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">
        {/* Left: Animated statistic */}
        <div
          ref={ref}
          className="relative flex min-h-[390px] flex-col items-center justify-center overflow-hidden border-b border-white/10 px-6 py-16 text-center sm:min-h-[460px] lg:min-h-[570px] lg:border-b-0 lg:border-r lg:border-white/15"
        >
          {/* Corner markers */}
          <span className="absolute left-5 top-5 h-2.5 w-2.5 rounded-full border-2 border-[#ccfc3b] bg-[#ccfc3b]/30 sm:left-8 sm:top-8" />
          <span className="absolute right-5 top-5 h-2.5 w-2.5 rounded-full border-2 border-white/40 sm:right-8 sm:top-8" />
          <span className="absolute bottom-5 left-5 h-2.5 w-2.5 rounded-full border-2 border-white/40 sm:bottom-8 sm:left-8" />
          <span className="absolute bottom-5 right-5 h-2.5 w-2.5 rounded-full border-2 border-[#ccfc3b] bg-[#ccfc3b]/30 sm:bottom-8 sm:right-8" />


          <p className="text-xs font-medium uppercase tracking-[0.3em] text-blue-100/80 sm:text-sm">
            Your growth starts here
          </p>

          <div className="relative mt-2 flex items-baseline justify-center">
            <span
              className="text-[clamp(100px,17vw,180px)] font-semibold leading-none tracking-[-0.09em] text-white tabular-nums"
              aria-label={`${count} percent`}
            >
              {count}
            </span>

            <span className="ml-1 text-5xl font-medium text-[#ccfc3b] sm:text-7xl lg:text-8xl">
              %
            </span>

            <span className="absolute -right-3 top-2 h-3 w-3 rounded-full bg-[#ccfc3b] shadow-[0_0_25px_rgba(204,252,59,0.7)] sm:-right-5 sm:top-5" />
          </div>

          <div className="mt-5 flex items-center gap-3">
            <span className="h-px w-8 bg-[#ccfc3b]/70" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80 sm:text-sm">
              Skills that move you forward
            </p>
            <span className="h-px w-8 bg-[#ccfc3b]/70" />
          </div>

          <p className="mt-6 max-w-sm text-sm leading-6 text-blue-100/70">
            Learn practical skills, build real projects, and take the next
            step in your career with LearnPerHour.
          </p>

          <Link href={'/courses'} className="mt-8 flex items-center gap-2 text-xs font-semibold text-[#ccfc3b]">
            Explore your potential
            <ArrowUpRight size={15} />
          </Link>
        </div>

        {/* Right: Features */}
        <div className="flex flex-col bg-[#ccfc3b] justify-center px-6 py-14 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
          <div className="mb-9">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-7 bg-[#151515]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#0039bd]">
                The LearnPerHour advantage
              </span>
            </div>

            <h2 className="max-w-lg text-3xl font-semibold text-black leading-tight tracking-tight sm:text-4xl lg:text-[32px]">
              Learn smarter. 
              <span className="text-[#ccfc3b]">Build what&apos;s next.</span>
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-6 text-gray-800 sm:text-base">
              Everything you need to turn your curiosity into practical
              skills and your ambitions into action.
            </p>
          </div>

          <div className="space-y-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.number}
                  className="group relative flex gap-4 pb-3 bg-white/[0.035] transition-all duration-300 border-b border-lime-500 sm:gap-5 "
                >

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h3 className="text-sm font-semibold text-black sm:text-base">
                        {feature.title}
                      </h3>

                    </div>

                    <p className="mt-1.5 max-w-md text-xs leading-[1.65] text-gray-800 sm:text-[13px]">
                      {feature.description}
                    </p>
                  </div>

                  <ArrowUpRight
                    size={17}
                    className="mt-1 shrink-0 text-white/25 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#ccfc3b]"
                  />
                </article>
              );
            })}
          </div>

          <div className="mt-7 flex items-center gap-3">
            <div className="flex -space-x-1.5">
              {[0, 1, 2, 3].map((item) => (
                <span
                  key={item}
                  className="h-2 w-2 rounded-full border border-[#06143b] bg-[#ccfc3b]"
                  style={{ opacity: 1 - item * 0.18 }}
                />
              ))}
            </div>

            <p className="text-xs text-gray-900">
              Your next skill is closer than you think.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
