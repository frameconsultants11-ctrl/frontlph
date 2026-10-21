"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight, BookOpen, CalendarCheck, CreditCard, HelpCircle, Lock, Plus, Search, ShieldCheck, Sparkles, UserCheck, X,
} from "lucide-react";

const ICONS = { help: HelpCircle, calendar: CalendarCheck, card: CreditCard, book: BookOpen, trainer: UserCheck, shield: ShieldCheck, lock: Lock };

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

function Chat({ faq, instant, onSeen }) {
  const [typing, setTyping] = useState(!instant);

  useEffect(() => {
    if (!typing) return;
    const t = setTimeout(() => { setTyping(false); onSeen(); }, 800);
    return () => clearTimeout(t);
  }, [typing, onSeen]);

  return (
    <div className="space-y-3 px-5 pb-5 pt-1" aria-live="polite">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="flex justify-end">
        <p className="max-w-[85%] rounded-2xl rounded-br-md bg-[#0039bd] px-4 py-2.5 text-sm text-white">{faq.q}</p>
      </motion.div>

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
          {typing ? (
            <Dots />
          ) : (
            <>
              {faq.a}
              {faq.link && (
                <Link href={faq.link.href} className="mt-2 inline-flex items-center gap-1 font-semibold text-[#0039bd] hover:underline">
                  {faq.link.label} <ArrowUpRight size={13} strokeWidth={2.5} />
                </Link>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function FaqTabs({ categories }) {
  const [tab, setTab] = useState(categories[0].id);
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);
  const seen = useRef(new Set());

  const all = useMemo(
    () => categories.flatMap((c) => c.faqs.map((f, i) => ({ ...f, id: `${c.id}-${i}`, category: c.label }))),
    [categories]
  );

  const searching = query.trim().length > 0;
  const list = useMemo(() => {
    if (searching) {
      const t = query.trim().toLowerCase();
      return all.filter((f) => `${f.q} ${f.a}`.toLowerCase().includes(t));
    }
    return all.filter((f) => f.id.startsWith(`${tab}-`));
  }, [all, tab, query, searching]);

  const activeIndex = categories.findIndex((c) => c.id === tab);
  const activeCategory = categories[activeIndex];

  const changeTab = (id) => { setTab(id); setOpenId(null); setQuery(""); };

  return (
    <div className="grid gap-10 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-14">
      {/* ---------- sidebar (same style as the refund page) ---------- */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        {/* mobile: scrolling pills */}
        <div role="tablist" aria-label="FAQ topics" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:hidden">
          {categories.map((c) => {
            const active = !searching && c.id === tab;
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => changeTab(c.id)}
                className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
                  active ? "border-[#0039bd] bg-[#0039bd] text-white" : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {/* desktop: sidebar card */}
        <nav aria-label="FAQ topics" className="hidden overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm lg:block">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#0039bd]">
              <HelpCircle size={18} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight text-slate-900">Help topics</p>
              <p className="mt-0.5 text-[11px] text-slate-400">Pick a topic</p>
            </div>
          </div>

          <div className="mb-3 h-px bg-slate-100" />

          <ol role="tablist" aria-orientation="vertical">
            {categories.map((c, i) => {
              const active = !searching && c.id === tab;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => changeTab(c.id)}
                    className={`group relative flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] transition-all duration-200 ${
                      active ? "bg-blue-50/80" : "hover:bg-blue-50/70"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold tabular-nums transition-colors ${
                        active ? "bg-[#0039bd] text-white" : "bg-slate-50 text-slate-400 group-hover:bg-[#0039bd] group-hover:text-white"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`flex-1 pt-1 leading-5 transition-colors group-hover:font-semibold group-hover:text-[#0039bd] ${
                        active ? "font-semibold text-[#0039bd]" : "text-slate-600"
                      }`}
                    >
                      {c.label}
                    </span>
                    <span className="mt-1 text-[11px] tabular-nums text-slate-400">{c.faqs.length}</span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="mt-5 rounded-xl bg-slate-50 p-3">
            <p className="text-[11px] leading-relaxed text-slate-500">
              <span className="font-semibold text-slate-700">Tip:</span> Select a topic to see its questions, or search all questions on the right.
            </p>
          </div>
        </nav>
      </aside>

      {/* ---------- questions ---------- */}
      <div className="min-w-0">
        <div className="relative">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpenId(null); }}
            placeholder="Search all questions…"
            className="h-12 w-full rounded-full border border-slate-200 bg-white pl-11 pr-11 text-sm outline-none transition focus:border-[#0039bd] focus:ring-4 focus:ring-blue-100"
          />
          {searching && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-slate-400 hover:bg-slate-100">
              <X size={15} />
            </button>
          )}
        </div>

        <h2 className="mt-8 flex items-baseline gap-3 text-xl font-semibold text-[#060B1F]">
          {searching ? (
            <>{list.length} result{list.length === 1 ? "" : "s"} for “{query.trim()}”</>
          ) : (
            <>
              <span className="text-sm font-bold tabular-nums text-[#0039bd]">{String(activeIndex + 1).padStart(2, "0")}</span>
              {activeCategory.label}
            </>
          )}
        </h2>

        {list.length ? (
          <ul className="mt-5 space-y-3">
            {list.map((f) => {
              const open = openId === f.id;
              return (
                <li key={f.id} className={`overflow-hidden rounded-2xl transition-colors ${open ? "bg-[#f3f6ff]" : "bg-slate-100 hover:bg-slate-200/70"}`}>
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : f.id)}
                    aria-expanded={open}
                    aria-controls={`faq-${f.id}`}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                  >
                    <span>
                      <span className="block text-[15px] font-medium text-[#060B1F]">{f.q}</span>
                      {searching && <span className="mt-1 block text-[11px] font-semibold uppercase tracking-wider text-[#0039bd]">{f.category}</span>}
                    </span>
                    <Plus size={22} className={`shrink-0 text-[#0039bd] transition-transform duration-300 ${open ? "rotate-45" : ""}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        id={`faq-${f.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <Chat faq={f} instant={seen.current.has(f.id)} onSeen={() => seen.current.add(f.id)} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 px-6 py-14 text-center">
            <p className="text-[15px] font-semibold text-[#060B1F]">No questions found</p>
            <p className="mt-1 text-sm text-slate-500">Try different words, or ask our team directly.</p>
          </div>
        )}
      </div>
    </div>
  );
}