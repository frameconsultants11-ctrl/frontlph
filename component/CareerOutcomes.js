
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  ChartNoAxesColumnIncreasing,
  CheckCircle2,
  Code2,
  FileText,
  GraduationCap,
  Laptop,
  MessageCircle,
  Sparkles,
} from "lucide-react";

const companies = [
  { name: "Google", style: "font-bold tracking-tight" },
  { name: "amazon", style: "font-extrabold tracking-tight" },
  { name: "Microsoft", style: "font-semibold" },
  { name: "Netflix", style: "font-black tracking-wide" },
  { name: "Adobe", style: "font-bold" },
  { name: "PayPal", style: "font-bold italic" },
  { name: "Flipkart", style: "font-bold italic" },
  { name: "Infosys", style: "font-bold" },
];

const supportFeatures = [
  {
    icon: BriefcaseBusiness,
    title: "Curated job opportunities",
    description:
      "Explore relevant openings and discover roles that match your skills and career goals.",
  },
  {
    icon: FileText,
    title: "Resume & LinkedIn guidance",
    description:
      "Present your projects, experience, and technical skills with a stronger professional profile.",
  },
  {
    icon: MessageCircle,
    title: "Interview preparation",
    description:
      "Practice explaining your projects and prepare for technical and career conversations.",
  },
];

function CompanyStrip() {
  return (
    <div className="mt-8 overflow-hidden">
      <div className="flex min-w-max animate-[marquee_28s_linear_infinite] gap-0 hover:[animation-play-state:paused]">
        {[...companies, ...companies].map((company, index) => (
          <div
            key={`${company.name}-${index}`}
            className="flex h-14 w-32 items-center justify-center border-r border-slate-200 px-5 sm:w-40"
          >
            <span
              className={`text-sm text-slate-500 grayscale transition hover:grayscale-0 ${company.style}`}
            >
              {company.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudentStoryCard({
  image,
  imageAlt,
  eyebrow,
  title,
  description,
  tags,
  quote,
  name,
  role,
}) {
  return (
    <article className="group grid overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_8px_30px_-24px_rgba(6,11,31,0.35)] transition duration-300 hover:-translate-y-1 hover:border-[#0039bd]/30 hover:shadow-[0_18px_45px_-25px_rgba(0,57,189,0.24)] sm:grid-cols-[0.88fr_1.12fr] sm:gap-5 sm:p-4">
      <div className="relative min-h-[210px] overflow-hidden rounded-xl bg-blue-50 sm:min-h-[245px]">
        <img
          src={image}
          alt={imageAlt}
          sizes="(max-width: 640px) 100vw, 40vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#060B1F]/75 to-transparent p-4 pt-12">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur-md">
            <GraduationCap size={13} />
            LearnPerHour journey
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-center px-2 py-5 sm:px-1 sm:py-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0039bd]">
          {eyebrow}
        </span>

        <h3 className="mt-2 text-xl font-bold leading-snug tracking-tight text-[#060B1F] sm:text-2xl">
          {title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          {description}
        </p>

        {quote && (
          <blockquote className="mt-4 border-l-2 border-[#ccfc3b] pl-3 text-sm italic leading-6 text-slate-700">
            “{quote}”
          </blockquote>
        )}

        {(name || role) && (
          <div className="mt-4">
            {name && (
              <p className="text-sm font-bold text-[#060B1F]">
                {name}
              </p>
            )}
            {role && (
              <p className="mt-1 text-xs text-slate-500">
                {role}
              </p>
            )}
          </div>
        )}

        {tags?.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1.5 text-[10px] font-semibold text-[#0039bd]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function CareerSupport() {
  return (
    <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10 lg:p-8">
      <div className="flex flex-col justify-center">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#ccfc3b]/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#060B1F]">
          <Sparkles size={13} />
          Beyond the course
        </span>

        <h3 className="mt-5 text-2xl font-bold leading-tight tracking-tight text-[#060B1F] sm:text-3xl">
          Skills are the start.
          <span className="mt-1 block text-[#0039bd]">
            Your next move matters.
          </span>
        </h3>

        <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
          Build a stronger professional profile and prepare to put your
          new skills to work.
        </p>

        <Link
          href="/courses"
          className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#0039bd] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ccfc3b] hover:text-[#060B1F]"
        >
          Explore courses
          <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {supportFeatures.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="flex gap-4 py-5 first:pt-1 last:pb-1"
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#0039bd]">
                <Icon size={20} strokeWidth={1.8} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#060B1F]">
                    {feature.title}
                  </h4>
                  <CheckCircle2
                    size={14}
                    className="text-[#0039bd]"
                  />
                </div>

                <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CareerOutcomes() {
  return (
    <section className="relative overflow-hidden font-sans bg-white py-16 text-[#060B1F] sm:py-20 lg:py-4">
      {/* Soft brand glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-[#0039bd]/[0.05] blur-3xl"
      />

      <div className="relative px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        {/* Section heading */}
        <div className="max-w-2xl">

          <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Turn your skills into
            <span className="relative ml-2 inline-block">
              <span className="relative z-10 text-[#0039bd]">
                opportunities.
              </span>
              <span className="absolute bottom-1 left-0 -z-0 h-3 w-full bg-[#ccfc3b]/70" />
            </span>
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            Learn in-demand technologies, work on practical projects, and
            prepare for the next chapter of your career with LearnPerHour.
          </p>
        </div>

        {/* Company-inspired strip */}
        <CompanyStrip />

        <div className="mt-3 border-t border-slate-200" />

        {/* Career stories */}
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <StudentStoryCard
            image="https://images.pexels.com/photos/7752846/pexels-photo-7752846.jpeg"
            imageAlt="LearnPerHour learner working on their career goals"
            eyebrow="Learn by doing"
            title="Build skills that go beyond theory."
            description="Develop your knowledge through guided learning, practical exercises, and projects that help you demonstrate what you know."
            tags={[
              "Hands-on projects",
              "Practical learning",
              "Career-ready skills",
            ]}
          />

          <StudentStoryCard
            image="https://images.pexels.com/photos/8178754/pexels-photo-8178754.jpeg"
            imageAlt="Learner preparing for a technology career"
            eyebrow="Your journey, your pace"
            title="Make your next career move with confidence."
            description="Strengthen your portfolio, practise explaining your work, and build a learning path that supports your professional goals."
            quote="Consistent learning and practical experience can open new doors."
            name="Your next chapter starts here"
            role="Explore learning paths at LearnPerHour"
          />
        </div>

        {/* Career support */}
        <div className="mt-6">
          <CareerSupport />
        </div>

      
      </div>

      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          :global(.animate-\\[marquee_28s_linear_infinite\\]) {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
