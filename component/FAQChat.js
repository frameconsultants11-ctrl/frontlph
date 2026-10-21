"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Plus, Sparkles } from "lucide-react";

/* EDIT THESE: placeholder answers, check them against your real policies */
const FAQS = [
  {
    q: "What is Learn Per Hour?",
    a: "Learn Per Hour is a learning platform where you pick courses, tools, topics or certification prep and learn with trainers who teach practical, job-focused skills. Pricing is built around hours of learning, so you pay for what you need.",
  },
  {
    q: "How does the free session work?",
    a: "Tap “Book A Free Session” on any course, tool, topic or certification. Our team contacts you, schedules a clarity call to understand your goals, and shares the date and meeting link in your My bookings page.",
  },
  {
    q: "How is pricing calculated?",
    a: "Most listings are priced per hour, and the price on the page is what you see before any discount. After your clarity call, we confirm the final price and the number of hours that fit your goal.",
  },
  {
    q: "Who will be my trainer?",
    a: "After the clarity call we assign a trainer whose skills and tools match what you want to learn. You can see their name in your booking details once they are assigned.",
  },
  {
    q: "Do you offer certification preparation?",
    a: "Yes. Certification Prep. has its own section with preparation courses. Certification is awarded by the issuing body once you pass its official exam; completing a course alone does not grant it.",
  },
  {
    q: "Can I track my bookings?",
    a: "Yes. Open My bookings from your dashboard to see the status, call time, meeting link, assigned trainer and pricing for every booking.",
  },
];

const Dots = () => (
  <span className="inline-flex items-center gap-1 px-1" aria-label="Typing">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="h-1.5 w-1.5 rounded-full bg-slate-400"
        animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
      />
    ))}
  </span>
);

function Chat({ q, a, instant, onSeen }) {
  const [typing, setTyping] = useState(!instant);

  useEffect(() => {
    if (!typing) return;
    const t = setTimeout(() => {
      setTyping(false);
      onSeen();
    }, 900);
    return () => clearTimeout(t);
  }, [typing, onSeen]);

  return (
    <div className="space-y-3 px-5 pb-5 pt-1" aria-live="polite">
      {/* you */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex justify-end"
      >
        <p className="max-w-[85%] rounded-2xl rounded-br-md bg-[#0039bd] px-4 py-2.5 text-sm text-white">{q}</p>
      </motion.div>

      {/* Learn Per Hour */}
      <div className="flex items-end gap-2.5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#ccfc3b] text-[#060B1F]">
          <Sparkles size={15} />
        </span>
        <motion.div
          key={typing ? "typing" : "answer"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="max-w-[85%] rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-2.5 text-sm leading-relaxed text-slate-600"
        >
          {typing ? <Dots /> : a}
        </motion.div>
      </div>
    </div>
  );
}

export default function FaqChat({
  title = "Frequently Asked Questions",
  subtitle = "Find quick answers to common questions about Learn Per Hour, our courses, learning process and platform features.",
  faqs = FAQS,
  contactHref = "/contact",
}) {
  const [openIndex, setOpenIndex] = useState(0);
  const seen = useRef(new Set());

  return (
    <section className="w-full bg-white font-sans">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.25fr] lg:gap-20 lg:px-0 lg:py-24">
        {/* left */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="max-w-md text-4xl font-semibold leading-[1.1] tracking-tight text-[#060B1F] sm:text-5xl">
            {title}
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-500">{subtitle}</p>

   
        </div>

        {/* right */}
        <ul className="space-y-3">
          {faqs.map((f, i) => {
            const open = openIndex === i;
            return (
              <li key={f.q} className={`overflow-hidden rounded-2xl transition-colors ${open ? "bg-[#f3f6ff]" : "bg-slate-100 hover:bg-slate-200/70"}`}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? -1 : i)}
                  aria-expanded={open}
                  aria-controls={`faq-panel-${i}`}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                >
                  <span className="text-[15px] font-medium text-[#060B1F]">{f.q}</span>
                  <Plus
                    size={22}
                    strokeWidth={2}
                    className={`shrink-0 text-[#0039bd] transition-transform duration-300 ${open ? "rotate-45" : ""}`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      id={`faq-panel-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <Chat
                        q={f.q}
                        a={f.a}
                        instant={seen.current.has(i)}
                        onSeen={() => seen.current.add(i)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}