"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight, CalendarClock, CalendarX2, Check, Clock, LoaderCircle, RefreshCw, Receipt, UserCheck, Video, X,
} from "lucide-react";

/* ---------------- status ---------------- */
const STATUS = {
  pending: { label: "Request received", cls: "bg-amber-50 text-amber-700" },
  scheduled: { label: "Call scheduled", cls: "bg-blue-50 text-blue-700" },
  trainer_assigned: { label: "Trainer assigned", cls: "bg-violet-50 text-violet-700" },
  completed: { label: "Completed", cls: "bg-emerald-50 text-emerald-700" },
  cancelled: { label: "Cancelled", cls: "bg-red-50 text-red-700" },
};

const STEPS = [
  { key: "pending", label: "Requested" },
  { key: "scheduled", label: "Call scheduled" },
  { key: "trainer_assigned", label: "Trainer assigned" },
  { key: "completed", label: "Completed" },
];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

const isActive = (s) => s === "pending" || s === "scheduled" || s === "trainer_assigned";
const matchFilter = (b, f) =>
  f === "all" ? true : f === "active" ? isActive(b.status) : b.status === f;

const money = (v) => `₹${Number(v ?? 0).toLocaleString("en-IN")}`;
const dateOnly = (iso) => (iso ? new Date(iso).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "—");
const dateTime = (iso) =>
  iso ? new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—";
const cap = (v = "") => (v ? v[0].toUpperCase() + v.slice(1) : "");
const bookingLabel = (t) => (t === "free_session" ? "Free session" : cap(String(t).replace(/_/g, " ")) || "Booking");

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.pending;
  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${s.cls}`}>{s.label}</span>;
}

function Thumb({ src, name, size = "h-14 w-14" }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className={`${size} shrink-0 rounded-xl border border-gray-100 bg-gray-50 object-contain p-1.5`} />
  ) : (
    <span className={`${size} grid shrink-0 place-items-center rounded-xl bg-[#173f32]/10 text-lg font-bold text-[#173f32]`}>
      {name?.[0]?.toUpperCase()}
    </span>
  );
}

/* ---------------- progress timeline ---------------- */
function Timeline({ status }) {
  if (status === "cancelled") {
    return (
      <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-700">
        <CalendarX2 size={16} /> This booking was cancelled.
      </p>
    );
  }
  const current = STEPS.findIndex((s) => s.key === status);
  return (
    <ol className="space-y-0">
      {STEPS.map((s, i) => {
        const done = i < current || status === "completed";
        const now = i === current && status !== "completed";
        return (
          <li key={s.key} className="relative flex gap-3 pb-5 last:pb-0">
            {i < STEPS.length - 1 && (
              <span className={`absolute left-[11px] top-6 h-[calc(100%-12px)] w-px ${done ? "bg-[#173f32]" : "bg-gray-200"}`} />
            )}
            <span
              className={`relative z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[10px] ${
                done
                  ? "border-[#173f32] bg-[#173f32] text-white"
                  : now
                    ? "border-[#173f32] bg-white text-[#173f32]"
                    : "border-gray-200 bg-white text-gray-300"
              }`}
            >
              {done ? <Check size={13} strokeWidth={3} /> : now ? <span className="h-2 w-2 rounded-full bg-[#173f32]" /> : null}
            </span>
            <span className={`pt-0.5 text-[13px] ${done || now ? "font-semibold text-[#060B1F]" : "text-gray-400"}`}>{s.label}</span>
          </li>
        );
      })}
    </ol>
  );
}

/* ---------------- list card ---------------- */
function BookingCard({ b, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(b.id)}
      className="flex w-full items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 text-left transition hover:border-[#173f32]/40 hover:shadow-[0_12px_30px_-18px_rgba(23,63,50,0.5)]"
    >
      <Thumb src={b.itemImage} name={b.itemName} />
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="truncate text-[15px] font-semibold text-[#060B1F]">{b.itemName}</span>
        </span>
        <span className="mt-0.5 block text-[12px] text-gray-500">
          {b.typeLabel} · {bookingLabel(b.bookingType)} · Booked {dateOnly(b.createdAt)}
        </span>
        <span className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-gray-500">
          {b.clarityCallAt && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarClock size={13} className="text-gray-400" /> {dateTime(b.clarityCallAt)}
            </span>
          )}
          {b.trainer && (
            <span className="inline-flex items-center gap-1.5">
              <UserCheck size={13} className="text-gray-400" /> {b.trainer.name}
            </span>
          )}
        </span>
      </span>
      <span className="flex shrink-0 flex-col items-end gap-2">
        <StatusBadge status={b.status} />
        <span className="text-[13px] font-semibold text-[#060B1F]">{money(b.actualPrice)}</span>
      </span>
    </button>
  );
}

/* ---------------- details drawer ---------------- */
function Section({ title, children }) {
  return (
    <section>
      <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-gray-400">{title}</h3>
      {children}
    </section>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 text-[13px]">
      <dt className="text-gray-500">{label}</dt>
      <dd className="text-right font-medium text-[#060B1F]">{children}</dd>
    </div>
  );
}

function Drawer({ b, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const closed = b.status === "completed" || b.status === "cancelled";
  const hasDiscount = b.actualPrice < b.price;

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="Close details" onClick={onClose} className="absolute inset-0 bg-slate-950/40" />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Booking details"
        className="absolute inset-y-0 right-0 flex w-full max-w-[480px] flex-col bg-white shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-[16px] font-semibold text-[#060B1F]">Booking details</h2>
            <p className="text-[12px] text-gray-500">Reference #{b.id.slice(-8).toUpperCase()}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 space-y-7 overflow-y-auto px-6 py-6">
          {/* item */}
          <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
            <Thumb src={b.itemImage} name={b.itemName} size="h-16 w-16" />
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-[15px] font-semibold text-[#060B1F]">{b.itemName}</p>
              <p className="mt-0.5 text-[12px] text-gray-500">
                {b.typeLabel}
                {b.itemLevel && ` · ${cap(b.itemLevel)}`}
              </p>
              <div className="mt-2"><StatusBadge status={b.status} /></div>
            </div>
          </div>

          {b.itemHref && (
            <Link
              href={b.itemHref}
              className="-mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#173f32] hover:underline"
            >
              View {b.typeLabel.toLowerCase()} <ArrowUpRight size={14} />
            </Link>
          )}

          <Section title="Progress">
            <Timeline status={b.status} />
          </Section>

          {/* clarity call */}
          <Section title="Clarity call">
            {b.clarityCallAt ? (
              <div className="rounded-2xl border border-gray-200 p-4">
                <p className="flex items-center gap-2 text-[14px] font-semibold text-[#060B1F]">
                  <CalendarClock size={16} className="text-[#173f32]" /> {dateTime(b.clarityCallAt)}
                </p>
                {b.meetingLink && !b.status.includes("cancel") ? (
                  <a
                    href={b.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#173f32] text-[13px] font-semibold text-white transition hover:bg-[#10302a]"
                  >
                    <Video size={16} /> {closed ? "Open meeting link" : "Join the call"}
                  </a>
                ) : (
                  <p className="mt-2 text-[12px] text-gray-500">The meeting link will be shared here soon.</p>
                )}
              </div>
            ) : (
              <p className="rounded-2xl border border-dashed border-gray-200 p-4 text-[13px] text-gray-500">
                {b.status === "cancelled"
                  ? "No call was scheduled."
                  : "Our team will schedule your call and share the date and link here."}
              </p>
            )}
          </Section>

          {/* trainer */}
          <Section title="Your trainer">
            {b.trainer ? (
              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 p-4">
                {b.trainer.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.trainer.image} alt="" className="h-12 w-12 rounded-full border border-gray-100 object-cover" />
                ) : (
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-[#173f32] text-sm font-semibold text-white">
                    {b.trainer.name[0]?.toUpperCase()}
                  </span>
                )}
                <p className="text-[14px] font-semibold text-[#060B1F]">{b.trainer.name}</p>
              </div>
            ) : (
              <p className="rounded-2xl border border-dashed border-gray-200 p-4 text-[13px] text-gray-500">
                {b.status === "cancelled" ? "No trainer was assigned." : "A trainer will be assigned after your clarity call."}
              </p>
            )}
          </Section>

          {/* pricing */}
          <Section title="Pricing & hours">
            <dl className="divide-y divide-gray-100 rounded-2xl border border-gray-200 px-4">
              <Row label="Listed price">{hasDiscount ? <s className="text-gray-400">{money(b.price)}</s> : money(b.price)}</Row>
              <Row label="Your price">{money(b.actualPrice)}</Row>
              {b.hours > 0 && <Row label="Hours"><span className="inline-flex items-center gap-1.5"><Clock size={13} className="text-gray-400" />{b.hours}</span></Row>}
            </dl>
            {b.bookingType === "free_session" && (
              <p className="mt-2 flex items-center gap-2 text-[12px] text-gray-500">
                <Receipt size={13} /> The free session has no charge.
              </p>
            )}
          </Section>

          {/* booking info */}
          <Section title="Booking info">
            <dl className="divide-y divide-gray-100 rounded-2xl border border-gray-200 px-4">
              <Row label="Type">{bookingLabel(b.bookingType)}</Row>
              <Row label="Phone">{b.phone || "—"}</Row>
              <Row label="Booked on">{dateTime(b.createdAt)}</Row>
              <Row label="Last updated">{dateTime(b.updatedAt)}</Row>
            </dl>
          </Section>
        </div>
      </aside>
    </div>
  );
}

/* ---------------- page ---------------- */
export default function MyBookings({ initialBookings }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Could not refresh.");
      setBookings(json.bookings);
    } catch (e) {
      setError(e.message || "Could not refresh.");
    } finally {
      setRefreshing(false);
    }
  }, []);

  const visible = bookings.filter((b) => matchFilter(b, filter));
  const open = bookings.find((b) => b.id === openId) || null;
  const count = (f) => bookings.filter((b) => matchFilter(b, f)).length;

  return (
    <>
      <section className="rounded-[28px] border border-gray-200 bg-white">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-6 py-5">
          <div>
            <h1 className="text-[18px] font-semibold text-[#060B1F]">My bookings</h1>
            <p className="text-[12px] text-gray-500">Track your sessions, calls and trainers in one place.</p>
          </div>
          <button
            type="button"
            onClick={refresh}
            disabled={refreshing}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-200 px-3 text-[12px] font-semibold text-[#173f32] transition hover:border-[#173f32] disabled:opacity-60"
          >
            {refreshing ? <LoaderCircle size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            Refresh
          </button>
        </header>

        <div className="px-6 py-6">
          <div className="-mx-1 mb-5 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                aria-pressed={filter === f.key}
                className={`shrink-0 rounded-full border px-4 py-1.5 text-[12px] font-semibold transition ${
                  filter === f.key
                    ? "border-[#173f32] bg-[#173f32] text-white"
                    : "border-gray-200 text-gray-600 hover:border-[#173f32]/50"
                }`}
              >
                {f.label} <span className={filter === f.key ? "text-white/70" : "text-gray-400"}>{count(f.key)}</span>
              </button>
            ))}
          </div>

          {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-[13px] text-red-700">{error}</p>}

          {visible.length ? (
            <div className="space-y-3">
              {visible.map((b) => (
                <BookingCard key={b.id} b={b} onOpen={setOpenId} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 px-6 py-14 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[#173f32]/10 text-[#173f32]">
                <CalendarClock size={22} />
              </span>
              <p className="mt-3 text-[14px] font-semibold text-[#060B1F]">
                {bookings.length ? "No bookings in this filter" : "No bookings yet"}
              </p>
              <p className="mt-1 text-[13px] text-gray-500">
                {bookings.length ? "Try another filter." : "Book a free session on any course, tool, topic or certification."}
              </p>
              {!bookings.length && (
                <Link
                  href="/courses"
                  className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-[#173f32] px-5 text-[13px] font-semibold text-white hover:bg-[#10302a]"
                >
                  Browse courses <ArrowUpRight size={14} />
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {open && <Drawer b={open} onClose={() => setOpenId(null)} />}
    </>
  );
}