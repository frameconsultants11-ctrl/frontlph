
"use client";

import { ArrowUpRight, Quote, Sparkles } from "lucide-react";

const results = [
  {
    type: "stat",
    value: "20x",
    label: "Growth in skills",
    brand: "LearnPerHour",
    color: "yellow",
    className: "lg:col-span-1",
  },
  {
    type: "stat",
    value: "9+",
    label: "Skills to explore",
    brand: "LearnPerHour",
    color: "pink",
    className: "lg:col-span-1",
  },
  {
    type: "quote",
    quote:
      "The hands-on projects helped me understand concepts better and gave me the confidence to start building real applications.",
    name: "Learner testimonial",
    role: "Practical learning",
    brand: "LearnPerHour",
    className: "lg:col-span-2",
  },
  {
    type: "quote",
    quote:
      "The structured learning path made it easier to stay consistent and break complex topics into manageable steps.",
    name: "Learner testimonial",
    role: "Structured learning",
    brand: "LearnPerHour",
    className: "lg:col-span-2",
  },
  {
    type: "stat",
    value: "4+",
    label: "Ways to learn",
    brand: "LearnPerHour",
    color: "green",
    className: "lg:col-span-1",
  },
  {
    type: "stat",
    value: "10h",
    label: "Build your skills",
    brand: "LearnPerHour",
    color: "yellow",
    className: "lg:col-span-1",
  },
  {
    type: "stat",
    value: "3x",
    label: "More hands-on practice",
    brand: "LearnPerHour",
    color: "pink",
    className: "lg:col-span-1",
  },
  {
    type: "stat",
    value: "+15%",
    label: "Progress through consistency",
    brand: "LearnPerHour",
    color: "lavender",
    className: "lg:col-span-1",
  },
  {
    type: "quote",
    quote:
      "Learning at my own pace while practising what I learned made the experience feel much more achievable.",
    name: "Learner testimonial",
    role: "Self-paced learning",
    brand: "LearnPerHour",
    className: "lg:col-span-2",
  },
];

const colorStyles = {
  yellow: "bg-[#fff0a3]",
  pink: "bg-[#f9d8f0]",
  green: "bg-[#d7f4cf]",
  lavender: "bg-[#e5e0ff]",
};

function StatCard({ item }) {
  return (
    <article
      className={`group flex min-h-[160px] flex-col justify-between rounded-xl border border-black/[0.04] p-4 transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:min-h-[175px] ${colorStyles[item.color]}`}
    >
      <div>
        <p className="text-3xl font-semibold tracking-tight text-[#060B1F] sm:text-4xl">
          {item.value}
        </p>

        <p className="mt-1 max-w-[180px] text-xs leading-5 text-slate-600">
          {item.label}
        </p>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-extrabold tracking-tight text-[#060B1F]">
          {item.brand}
        </span>

        <ArrowUpRight
          size={17}
          className="opacity-0 transition group-hover:opacity-100"
        />
      </div>
    </article>
  );
}

function QuoteCard({ item }) {
  return (
    <article
      className={`flex min-h-[190px] flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 transition duration-300 hover:border-[#0039bd]/30 hover:shadow-[0_12px_35px_-22px_rgba(0,57,189,0.3)] sm:min-h-[175px] ${item.className}`}
    >
      <div>
        <Quote
          size={19}
          strokeWidth={2}
          className="mb-3 text-[#0039bd]"
        />

        <p className="text-sm font-medium leading-6 tracking-tight text-[#172033] sm:text-[15px]">
          “{item.quote}”
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#0039bd] text-xs font-bold text-white">
            LP
          </div>

          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-[#060B1F]">
              {item.name}
            </p>
            <p className="mt-0.5 truncate text-[10px] text-slate-500">
              {item.role}
            </p>
          </div>
        </div>

        <span className="shrink-0 text-[10px] font-extrabold tracking-tight text-[#0039bd]">
          {item.brand}
        </span>
      </div>
    </article>
  );
}

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 font-sans">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="relative mb-9  sm:mb-12">

          <h2 className=" mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-[#060B1F] sm:text-4xl lg:text-5xl">
            Real learning.
            <br className="sm:hidden" />{" "}
            <span className="relative inline-block text-[#0039bd]">
              Real progress.
              <span className="absolute -bottom-1 left-0 -z-0 h-2 w-full bg-[#ccfc3b]/70" />
            </span>
          </h2>

          <p className=" mt-4 max-w-lg text-sm leading-6 text-slate-500 sm:text-base">
            Discover a more practical way to learn new skills, build
            projects, and move towards your goals.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {results.map((item, index) =>
            item.type === "stat" ? (
              <div key={index} className={item.className}>
                <StatCard item={item} />
              </div>
            ) : (
              <div key={index} className={item.className}>
                <QuoteCard item={item} />
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
