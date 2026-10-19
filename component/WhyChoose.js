'use client';

import React from 'react';
import { motion, MotionConfig } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, CalendarClock, BadgeCheck, GraduationCap, ArrowUpRight } from 'lucide-react';

/* Brand: blue #0039bd | lime #ccfc3b | ink #060B1F
   Swap BG_IMAGE for your own photo (put it in /public and use "/why-banner.jpg") */

const BG_IMAGE =
  'https://images.pexels.com/photos/16323434/pexels-photo-16323434.jpeg';

const FEATURES = [
  {
    icon: CalendarClock,
    title: 'Book by the hour',
    text: '1:1 mentorship on your schedule. Pick a mentor, choose a slot and pay only for the hours you learn.',
  },
  {
    icon: BadgeCheck,
    title: 'Certification ready',
    text: 'Prepare for industry certifications with a mentor and earn a certificate when you finish.',
  },
  {
    icon: GraduationCap,
    title: 'Full courses, your pace',
    text: 'Structured courses from the basics to job-ready, with a mentor beside you at every step.',
  },
];

const ease = [0.22, 1, 0.36, 1];

export default function WhyChooseBanner() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="w-full bg-white px-3 py-10 font-sans md:px-6 md:py-16">
        <div className="relative mx-auto flex min-h-[920px] flex-col justify-end overflow-hidden rounded-[28px] bg-[#0039bd] md:min-h-[980px] md:rounded-[36px]">
          {/* background photo */}
          <motion.img
            src={BG_IMAGE}
            alt=""
            aria-hidden="true"
            initial={{ scale: 1.08 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease }}
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* brand-blue tint + legibility gradients */}
          <div className="absolute inset-0 bg-[#0039bd]/35 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060B1F]/80 via-[#060B1F]/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060B1F]/55 via-transparent to-transparent" />

          {/* content */}
          <div className="relative z-10 px-5 pb-5 pt-56 md:px-14 md:pb-14 md:pt-40">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease }}
            >
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <Sparkles size={18} strokeWidth={1.8} className="text-[#ccfc3b]" />
                Why choose Learn Per Hour
              </div>

              <h2 className="mt-4 max-w-xl text-4xl font-medium leading-[1.04] tracking-tight text-white md:text-6xl">
                Stop searching.
                <br />
                Start learning.
              </h2>

              <Link
                href="/certifications"
                className="group mt-6 inline-flex items-center gap-2 rounded-full bg-[#ccfc3b] py-2.5 pl-6 pr-2.5 text-sm font-semibold text-[#060B1F] transition-colors hover:bg-[#c4f035] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Check Certifications Offering
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[#060B1F] text-[#ccfc3b] transition-transform group-hover:rotate-45">
                  <ArrowUpRight size={15} strokeWidth={2.5} />
                </span>
              </Link>
            </motion.div>

            {/* glass cards */}
            <div className="mt-8 grid gap-4 md:mt-12 md:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, text }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease }}
                  className="flex min-h-[170px] flex-col justify-between rounded-2xl border border-white/25 bg-white/10 p-6 backdrop-blur-md transition-colors duration-300 hover:bg-white/[0.16] md:min-h-[195px]"
                >
                  <Icon size={30} strokeWidth={1.5} className="text-white" />
                  <div>
                    <h3 className="text-xl font-medium tracking-tight text-white">{title}</h3>
                    <p className="mt-2 max-w-[280px] text-sm leading-snug text-white/85">{text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}