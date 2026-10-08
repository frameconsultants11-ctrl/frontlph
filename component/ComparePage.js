"use client";

import Link from "next/link";
import {
  ArrowLeftRight,
  ArrowRight,
  Award,
  BriefcaseBusiness,
  Clock3,
  GraduationCap,
  Lightbulb,
  Star,
  Wrench,
  X,
  Zap,
} from "lucide-react";

import { useEffect, useState } from "react";

import { getCompareIds, removeCompareId } from "@/lib/compare";

export default function ComparePage() {
  const [ids, setIds] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const compareIds = getCompareIds();
    setIds(compareIds);

    if (!compareIds.length) {
      setLoading(false);
      return;
    }

    async function loadTrainers() {
      try {
        const response = await fetch(
          `/api/trainers/compare?ids=${compareIds.join(",")}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load trainers");
        }

        setTrainers(data.trainers || []);
      } catch (error) {
        console.error(error);
        setError(error.message || "Failed to load comparison");
      } finally {
        setLoading(false);
      }
    }

    loadTrainers();
  }, []);

  function handleRemove(id) {
    const newIds = removeCompareId(id);
    setIds(newIds);
    setTrainers((current) =>
      current.filter((trainer) => trainer._id.toString() !== id)
    );
    window.dispatchEvent(new Event("compare-updated"));
  }

  if (loading) return <CompareLoading />;

  if (error) {
    return (
      <main className="min-h-screen bg-[#fafcfb] px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        </div>
      </main>
    );
  }

  if (!ids.length) return <EmptyCompare />;

  return (
    <main className="min-h-screen bg-[#fafcfb] font-sans pb-10">
      {/* HEADER */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-0 pt-25 pb-6 sm:pt-30 sm:pb-10">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-950">
                Compare Trainers
              </h1>

              <p className="mt-1 text-sm sm:text-base text-gray-500">
                Find the mentor that matches your learning goals.
              </p>
            </div>

            <div className="shrink-0 inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-600">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              {trainers.length} / 3
            </div>
          </div>
        </div>
      </section>

      {/* CARDS: swipe carousel on mobile, grid on desktop */}
      <section className="max-w-[1400px] mx-auto pt-6 sm:pt-10">
        <div
          className="
            flex gap-3 overflow-x-auto snap-x snap-mandatory
            px-4 pb-3 -mb-3
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
            md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5
            md:overflow-visible md:px-8 lg:px-10
          "
        >
          {trainers.map((trainer) => (
            <div
              key={trainer._id}
              className="snap-center shrink-0 w-[72vw] max-w-[280px] md:w-auto md:max-w-none"
            >
              <TrainerCard trainer={trainer} onRemove={handleRemove} />
            </div>
          ))}
        </div>

        {trainers.length > 1 && (
          <p className="md:hidden mt-4 text-center text-xs text-gray-400">
            Swipe to see all trainers →
          </p>
        )}
      </section>

      {/* QUICK LOOK */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-10 pt-10 sm:pt-14">
        <div className="mb-5 sm:mb-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-green-700">
            At a glance
          </p>

          <div className="flex items-center justify-between gap-4 mt-1">
            <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-gray-950">
              Quick Look
            </h2>
            <span className="hidden sm:block text-sm text-gray-400">
              Side-by-side comparison
            </span>
          </div>

          <div className="mt-4 h-px bg-gray-200" />
        </div>

        <div className="md:overflow-x-auto md:pb-5">
          <div className="md:min-w-[850px] flex flex-col gap-3 md:gap-0">
            <CompareRow
              icon={Zap}
              label="Hourly Rate"
              trainers={trainers}
              render={(trainer) => (
                <div>
                  <span className="text-lg md:text-xl font-bold text-gray-950">
                    ₹ {trainer.hourlyRate ?? trainer.price ?? 0}
                  </span>
                  <span className="ml-1 text-xs text-gray-400">/ hour</span>
                </div>
              )}
            />

            <CompareRow
              icon={BriefcaseBusiness}
              label="Experience"
              trainers={trainers}
              render={(trainer) => (
                <span className="text-base md:text-lg font-semibold text-gray-900">
                  {getExperience(trainer.experience)}
                </span>
              )}
            />

            <CompareRow
              icon={GraduationCap}
              label="Education"
              trainers={trainers}
              large
              render={(trainer) => (
                <EducationList education={trainer.education} />
              )}
            />

            <CompareRow
              icon={Star}
              label="Rating"
              trainers={trainers}
              render={(trainer) => (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-yellow-50 flex items-center justify-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm md:text-base leading-tight">
                      {trainer.rating ?? "4.9"}
                    </div>
                    <div className="text-xs text-gray-400">
                      {trainer.reviews ?? 0} reviews
                    </div>
                  </div>
                </div>
              )}
            />

            <CompareRow
              icon={Clock3}
              label="Availability"
              trainers={trainers}
              render={(trainer) =>
                trainer.isAvailable ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Available
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    Unavailable
                  </span>
                )
              }
            />

            <CompareRow
              icon={Lightbulb}
              label="Skills"
              trainers={trainers}
              large
              render={(trainer) => <ChipList items={trainer.skills} />}
            />

            <CompareRow
              icon={Wrench}
              label="Tools"
              trainers={trainers}
              large
              render={(trainer) => (
                <ChipList items={trainer.toolsTeach} green />
              )}
            />

            <CompareRow
              icon={Award}
              label="Certifications"
              trainers={trainers}
              large
              render={(trainer) => (
                <CertificationList certifications={trainer.certifications} />
              )}
            />

            <CompareRow
              icon={ArrowLeftRight}
              label="Profile"
              trainers={trainers}
              render={(trainer) => (
                <Link
                  href={`/mentor/${trainer._id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-gray-950 px-4 py-2 md:px-5 md:py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition"
                >
                  View Profile
                  <ArrowLeftRight className="w-4 h-4" />
                </Link>
              )}
            />
          </div>
        </div>
      </section>
    </main>
  );
}


function TrainerCard({ trainer, onRemove }) {
  const price = trainer.hourlyRate ?? trainer.price ?? 0;

  return (
    <article className="relative overflow-hidden rounded-3xl pb-3 sm:pb-0 bg-white border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
      <div className="absolute top-0 left-0 right-0 h-[140px] bg-gradient-to-b from-[#dff9ef] via-[#effbf7] to-white" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-30"
        style={{
          backgroundImage: `
              radial-gradient(
                circle at 1px 1px,
                rgba(16,185,129,0.08) 1px,
                transparent 1.5px
              ),
              linear-gradient(
                to bottom,
                rgba(16,185,129,0.48) 0%,
                rgba(52,211,153,0.18) 30%,
                rgba(110,231,183,0.08) 55%,
                rgba(255,255,255,0) 100%
              )
            `,
          backgroundSize: "8px 8px, 100% 100%",
        }}
      />

      {/* AVAILABILITY */}
      <div className="absolute top-2 left-6 h-10 md:h-0">
        <div className="flex justify-center mt-3">
          {trainer.isAvailable ? (
            <span className="inline-flex items-center bg-white/40 border border-white/80  px-2 py-0.5 rounded-2xl gap-2 text-xs font-semibold text-green-700">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Available
            </span>
          ) : (
            <span className="text-xs text-gray-500">Currently unavailable</span>
          )}
        </div>
      </div>

      {/* REMOVE */}
      <button
        type="button"
        aria-label={`Remove ${trainer.name}`}
        onClick={() => onRemove(trainer._id.toString())}
        className="absolute right-3 top-3 z-20 w-9 h-9 rounded-full bg-white/20 border border-gray-200/20 shadow-sm flex items-center justify-center text-green-600 hover:text-red-500 active:scale-95 transition cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>

      {/* IMAGE */}
      <div className="relative h-[150px] md:h-[180px] flex items-end justify-center">
        {trainer.image ? (
          <img
            src={trainer.image}
            alt={trainer.name}
            className="w-full h-full object-contain object-bottom px-6 pt-5"
          />
        ) : (
          <div className="w-20 h-20 mb-5 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500">
            {trainer.name?.charAt(0)?.toUpperCase()}
          </div>
        )}

        {/* WHITE FADE OVERLAY */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 md:h-16 bg-gradient-to-t from-white via-white/80 to-transparent" />
      </div>

      {/* CONTENT */}
      <div className="relative px-4 pb-2 md:px-6 md:pb-5">
        <div className="flex items-center justify-between gap-2 xp-1">
          <h2 className="text-base md:text-lg font-bold text-gray-950 truncate">
            {trainer.name}
          </h2>

          <div className="flex items-center justify-center gap-1.5 mt-1">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold text-gray-800">
              {trainer.rating ?? "5.0"}
            </span>
            <span className="text-xs text-gray-400">
              ({trainer.reviews ?? 0})
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 xp-1">
          <div className="flex items-center gap-1.5">
            <BriefcaseBusiness className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-500">
              Experience:
            </span>
            <span className="text-sm font-semibold text-gray-500">
              {getExperience(trainer.experience)}
            </span>
          </div>
        </div>

        <div className="px-0 mt-2 text-xs text-gray-500 leading-5 line-clamp-2">
          {trainer.about}
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex mt-4">
            <span className="text-lg sm:text-2xl font-bold text-green-700">₹{price}</span>
          </div>
          <Link
            href={`/one-on-one-mentorship/${trainer._id}`}
            className="group mt-3 flex "
          >
            <span className="px-4 flex items-center justify-center py-2.5 rounded-full bg-gray-950 text-white text-sm font-semibold hover:bg-gray-800 active:scale-[0.98] transition">
              View Profile
            </span>
            <div className="ml-2 px-3 flex items-center justify-center border border-gray-200 py-2 rounded-full text-black text-sm font-semibold group-hover:bg-gray-800 active:scale-[0.98] transition-all duration-300">
              <ArrowRight className="w-4 h-4 text-black group-hover:text-white group-hover:-rotate-45 transition-all" />
            </div>
          </Link>
        </div>
      </div>
    </article>
  );
}


function CompareRow({ icon: Icon, label, trainers, render, large = false }) {
  return (
    <>
      {/* DESKTOP */}
      <div className="hidden md:grid grid-cols-[150px_repeat(3,minmax(220px,1fr))] border-t border-gray-200">
        <div className="py-6 pr-5 flex flex-col justify-center gap-2">
          <div className="w-9 h-9 rounded-md bg-white border border-gray-200 flex items-center justify-center">
            <Icon className="w-4 h-4 text-gray-700" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {label}
          </span>
        </div>

        {trainers.map((trainer) => (
          <div
            key={trainer._id}
            className={`px-5 py-6 flex ${
              large ? "items-start" : "items-center"
            }`}
          >
            {render(trainer)}
          </div>
        ))}

        {Array.from({ length: 3 - trainers.length }).map((_, index) => (
          <div key={`empty-${index}`} className="px-5 py-6" />
        ))}
      </div>

      {/* MOBILE */}
      <div className="md:hidden rounded-2xl bg-white border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
          <Icon className="w-4 h-4 text-gray-600" />
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">
            {label}
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {trainers.map((trainer) => (
            <div
              key={trainer._id}
              className={
                large
                  ? "px-4 py-3 flex flex-col gap-2"
                  : "px-4 py-3 flex items-center justify-between gap-3"
              }
            >
              <span className="text-sm font-medium text-gray-500 truncate">
                {trainer.name}
              </span>
              <div className={large ? "" : "shrink-0"}>{render(trainer)}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}


function ChipList({ items = [], green = false }) {
  if (!items?.length) {
    return <span className="text-sm text-gray-400">—</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5 md:gap-2">
      {items.map((item, index) => {
        const name = item?.name || item;
        const image = item?.image;

        return (
          <span
            key={item?._id || index}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-xs font-medium ${
              green
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {image && (
              <img
                src={image}
                alt=""
                loading="lazy"
                className="w-4 h-4 md:w-[18px] md:h-[18px] shrink-0 object-contain rounded-sm"
              />
            )}
            {name}
          </span>
        );
      })}
    </div>
  );
}

/* ============================================================
   CERTIFICATIONS
============================================================ */

function CertificationList({ certifications = [] }) {
  if (!certifications?.length) {
    return <span className="text-sm text-gray-400">No certifications</span>;
  }

  return (
    <div className="flex flex-col gap-2.5 w-full">
      {certifications.map((certification, index) => (
        <div
          key={certification?._id || index}
          className="flex items-center gap-3"
        >
          {certification?.image ? (
            <img
              src={certification.image}
              alt={certification.name || "Certification"}
              className="w-9 h-9 md:w-10 md:h-10 rounded-xl object-contain border border-gray-100 bg-white p-1"
            />
          ) : (
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <Award className="w-4 h-4 text-gray-500" />
            </div>
          )}

          <span className="text-sm font-medium text-gray-700">
            {certification?.name || certification}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   EDUCATION
============================================================ */

const EDUCATION_LEVELS = {
  school: "School",
  college: "College",
  graduation: "Graduation",
  masters: "Master's",
  phd: "PhD",
};

function getEducationLevel(level) {
  if (!level) return "";
  return (
    EDUCATION_LEVELS[level] || level.charAt(0).toUpperCase() + level.slice(1)
  );
}

function EducationList({ education = [] }) {
  if (!education?.length) {
    return <span className="text-sm text-gray-400">—</span>;
  }

  return (
    <div className="flex flex-col gap-2.5 w-full">
      {education.map((item, index) => (
        <div key={item?._id || index} className="flex items-start gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 shrink-0 rounded-xl bg-gray-100 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-gray-500" />
          </div>

          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-800 leading-tight">
              {item?.institution?.trim() || "—"}
            </div>
            <div className="mt-0.5 text-xs text-gray-400">
              {getEducationLevel(item?.level)}
              {item?.isCurrent
                ? " · Currently studying"
                : item?.year
                ? ` · ${item.year}`
                : ""}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   EXPERIENCE
============================================================ */

function getExperience(experience) {
  if (!Array.isArray(experience) || experience.length === 0) {
    return "0 years";
  }

  const currentYear = new Date().getFullYear();

  const startYears = experience
    .map((item) => Number(item?.from))
    .filter((year) => Number.isFinite(year) && year > 1900);

  if (!startYears.length) return "0 years";

  const earliestYear = Math.min(...startYears);
  const totalYears = Math.max(0, currentYear - earliestYear);

  return `${totalYears} years`;
}

/* ============================================================
   EMPTY
============================================================ */

function EmptyCompare() {
  return (
    <main className="min-h-screen bg-[#fafcfb] flex items-center justify-center px-5">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-[#e7fcf5] flex items-center justify-center">
          <ArrowLeftRight className="w-7 h-7 sm:w-8 sm:h-8 text-green-700" />
        </div>

        <h1 className="mt-5 text-xl sm:text-2xl font-bold text-gray-950">
          No trainers selected
        </h1>

        <p className="mt-2 text-sm sm:text-base text-gray-500 leading-6">
          Add up to three trainers to compare their pricing, experience,
          skills, tools and certifications.
        </p>

        <Link
          href="/mentors"
          className="inline-flex mt-6 rounded-full bg-gray-950 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition"
        >
          Browse Trainers
        </Link>
      </div>
    </main>
  );
}

/* ============================================================
   LOADING
============================================================ */

function CompareLoading() {
  return (
    <main className="min-h-screen bg-[#fafcfb] px-4 py-10">
      <div className="max-w-[1400px] mx-auto animate-pulse">
        <div className="h-4 w-32 rounded bg-gray-200" />
        <div className="mt-5 h-9 w-60 rounded bg-gray-200" />

        <div className="mt-8 flex gap-3 overflow-hidden md:grid md:grid-cols-3 md:gap-5">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="shrink-0 w-[72vw] max-w-[280px] md:w-auto md:max-w-none bg-white rounded-3xl overflow-hidden"
            >
              <div className="h-[150px] md:h-[180px] bg-gray-200" />
              <div className="p-4">
                <div className="mx-auto h-5 w-32 rounded bg-gray-200" />
                <div className="mx-auto mt-4 h-14 rounded-xl bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}