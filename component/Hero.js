'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, IndianRupee, MonitorPlay, Quote } from 'lucide-react';
import CourseSearchForm from './utils/CourseSearchForm';

/* ============================================================
   Brand: blue #0039bd | deep blue #002f9e | lime #ccfc3b | ink #060B1F
   Replace MENTOR_IMG with a transparent PNG cut-out of a mentor
   for the exact "person standing on the gradient" look.
============================================================ */

const MENTOR_IMG =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=85';

const REVIEWS = [
  {
    side: 'left',
    initials: 'PS',
    quote: 'Cleared my Kubernetes certification in three weeks with a 1:1 mentor.',
    name: 'Priya Sharma',
    role: 'DevOps Engineer',
  },
  {
    side: 'right',
    initials: 'AM',
    quote: 'Mock interviews gave me the confidence to crack my backend round.',
    name: 'Aman Mehta',
    role: 'Backend Developer',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const ReviewCard = ({ review, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.5 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
    className={`absolute z-20 w-[170px] rounded-xl bg-lime-300 p-3 shadow-[0_18px_40px_-14px_rgba(0,20,90,0.45)] sm:w-[220px] sm:p-3.5 ${
      review.side === 'left'
        ? 'bottom-[48%] left-0 sm:-left-16 lg:-left-16'
        : 'bottom-[40%] right-0 sm:-right-16 lg:-right-16'
    }`}
  >
    <div className="flex items-start gap-2.5">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#0039bd] text-[10px] font-semibold text-white">
        {review.initials}
      </span>
      <p className="text-[11px] leading-snug text-slate-900 sm:text-[12px]">{review.quote}</p>
    </div>
    <div className="mt-3 flex items-center justify-between border-t border-slate-600 pt-2.5">
      <div className="min-w-0">
        <p className="truncate text-[11px] font-semibold text-slate-900">{review.name}</p>
        <p className="truncate text-[10px] text-slate-800">{review.role}</p>
      </div>
      <Quote size={14} className="shrink-0 text-[#0039bd]/80" />
    </div>
  </motion.div>
);

const Hero = () => {
  return (
    <section className="relative flex h-[120vh] w-full flex-col items-center overflow-hidden mt-15 bg-gradient-to-b from-[#0039bd] via-[#4d74cf] to-[#ffff] font-sans">
     

{/* Subtle noise texture */}
<svg
  className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12] [mask-image:radial-gradient(ellipse_at_50%_55%,black_20%,transparent_75%)]"
  aria-hidden="true"
>
  <defs>
    <filter id="hero-noise">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.85"
        numOctaves="20"
        stitchTiles="stitch"
      />
      <feColorMatrix type="saturate" values="0" />
    </filter>
  </defs>

  <rect
    width="100%"
    height="100%"
    filter="url(#hero-noise)"
  />
</svg>


      {/* ================= TEXT + SEARCH ================= */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex w-full max-w-7xl flex-col items-center px-4 pt-18 md:pt-24"
      >
        <motion.div
          variants={item}
          className="mb-7 flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-4 py-1.5 backdrop-blur-md"
        >
          <MonitorPlay className="h-4 w-4 text-[#ccfc3b]" />
          <span className="text-xs font-medium text-white">Your #1 platform for 1:1 training</span>
        </motion.div>

        <motion.h1
          variants={item}
          className="max-w-7xl text-center text-xl font-semibold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-[48px]"
        >
          1 on 1 Learning, Interview Prep, Career Counselling <br/>&amp; Project Support
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-5 max-w-3xl px-2 text-center text-base leading-relaxed text-white/85 md:text-lg"
        >
          From mastering individual topics to preparing for interviews, completing courses and
          building real-world projects.
        </motion.p>

        {/* search pill */}
       <CourseSearchForm/>
      </motion.div>

      {/* ================= MENTOR + FLOATING CARDS ================= */}
      <div className="relative mt-12  flex-1 md:mt-2">
       <motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{
    duration: 0.8,
    delay: 0.25,
    ease: [0.22, 1, 0.36, 1],
  }}
  className="relative mx-auto h-[660px] w-full overflow-hidden"
>
  <img
    src="/team.png"
    alt="Mentor smiling"
    className="h-full w-full object-cover object-top"
    loading="eager"
  />


  {/* Bottom fade */}
  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#dbe6ff] to-transparent" />
</motion.div>

        {REVIEWS.map((r, i) => (
          <ReviewCard key={r.name} review={r} index={i} />
        ))}
      </div>
    </section>
  );
};

export default Hero;