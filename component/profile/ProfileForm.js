"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Briefcase, CheckCircle2, GraduationCap, LoaderCircle, Plus, Search, Sparkles, Trash2, User, X,
} from "lucide-react";

/* ---------------- shared bits (same look as your PasswordInput) ---------------- */
const inputCls = (error) =>
  `h-[45px] w-full rounded-[8px] border bg-white px-3 text-[13px] outline-none transition placeholder:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 ${
    error ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#173f32]"
  }`;

function Field({ label, error, hint, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium text-[#303a35]">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-[11px] text-gray-400">{hint}</p>}
      {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

function TextInput({ label, error, hint, className = "", ...props }) {
  return (
    <Field label={label} error={error} hint={hint}>
      <input {...props} className={`${inputCls(error)} ${className}`} />
    </Field>
  );
}

function Card({ Icon, title, subtitle, action, children }) {
  return (
    <section className="rounded-[28px] border border-gray-200 bg-white">
      <header className="flex items-center justify-between gap-4 border-b border-gray-100 px-6 py-5">
        <div className="flex items-center gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gray-50 text-[#303a35]">
            <Icon size={20} strokeWidth={1.6} />
          </span>
          <div>
            <h2 className="text-[16px] font-semibold text-[#060B1F]">{title}</h2>
            <p className="text-[12px] text-gray-500">{subtitle}</p>
          </div>
        </div>
        {action}
      </header>
      <div className="px-6 py-6">{children}</div>
    </section>
  );
}

const digits = (v) => v.replace(/\D/g, "").slice(0, 4);
const newKey = () => Math.random().toString(36).slice(2, 10);
const blankEdu = () => ({ _k: newKey(), degree: "", school: "", year: "" });
const blankExp = () => ({ _k: newKey(), company: "", title: "", startYear: "", endYear: "", current: false });

const AddButton = ({ onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-[12px] font-semibold text-[#173f32] transition hover:border-[#173f32] hover:bg-[#173f32]/5"
  >
    <Plus size={14} /> {children}
  </button>
);

const RemoveButton = ({ onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className="grid h-8 w-8 place-items-center rounded-md text-gray-400 transition hover:bg-red-50 hover:text-red-500"
  >
    <Trash2 size={15} />
  </button>
);

/* ---------------- combined searchable picker ---------------- */
const TYPE_META = {
  category: { label: "Category", cls: "bg-blue-50 text-blue-700" },
  subCategory: { label: "Subcategory", cls: "bg-violet-50 text-violet-700" },
  skill: { label: "Skill", cls: "bg-emerald-50 text-emerald-700" },
  tool: { label: "Tool", cls: "bg-amber-50 text-amber-700" },
};

function InterestPicker({ options, value, onChange }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef(null);

  const byKey = useMemo(() => new Map(options.map((o) => [o.key, o])), [options]);
  const selected = value.map((k) => byKey.get(k)).filter(Boolean);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    return options
      .filter(
        (o) =>
          !value.includes(o.key) &&
          (!t || `${o.label} ${o.hint} ${TYPE_META[o.type].label}`.toLowerCase().includes(t))
      )
      .slice(0, 50);
  }, [options, value, q]);

  useEffect(() => setActive(0), [q]);

  useEffect(() => {
    const onDoc = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const add = (o) => { onChange([...value, o.key]); setQ(""); setActive(0); };
  const remove = (key) => onChange(value.filter((k) => k !== key));

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((i) => Math.min(i + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); if (open && results[active]) add(results[active]); }
    else if (e.key === "Escape") setOpen(false);
    else if (e.key === "Backspace" && !q && value.length) remove(value[value.length - 1]);
  };

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search tools, skills, categories or subcategories…"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          className={`${inputCls(false)} pl-9`}
        />
      </div>

      {open && (
        <ul
          role="listbox"
          className="absolute z-30 mt-1.5 max-h-72 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg"
        >
          {results.length ? (
            results.map((o, i) => (
              <li key={o.key} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => add(o)}
                  onMouseEnter={() => setActive(i)}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-[13px] ${
                    i === active ? "bg-gray-50" : ""
                  }`}
                >
                  <span className="min-w-0 truncate text-[#060B1F]">
                    {o.label}
                    {o.hint && <span className="ml-2 text-[11px] text-gray-400">in {o.hint}</span>}
                  </span>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${TYPE_META[o.type].cls}`}>
                    {TYPE_META[o.type].label}
                  </span>
                </button>
              </li>
            ))
          ) : (
            <li className="px-3 py-4 text-center text-[12px] text-gray-400">
              {q ? "No matches found." : "Everything is already selected."}
            </li>
          )}
        </ul>
      )}

      <div className="mt-3 flex min-h-[32px] flex-wrap gap-2">
        {selected.length ? (
          selected.map((o) => (
            <span
              key={o.key}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white py-1 pl-3 pr-1.5 text-[12px] text-[#060B1F]"
            >
              {o.label}
              <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${TYPE_META[o.type].cls}`}>
                {TYPE_META[o.type].label}
              </span>
              <button
                type="button"
                onClick={() => remove(o.key)}
                aria-label={`Remove ${o.label}`}
                className="grid h-5 w-5 place-items-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={12} />
              </button>
            </span>
          ))
        ) : (
          <p className="text-[12px] text-gray-400">Nothing selected yet.</p>
        )}
      </div>
    </div>
  );
}

/* ---------------- main form ---------------- */
const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—";

export default function ProfileForm({ initialUser, options }) {
  const u = initialUser;
  const [name, setName] = useState(u.name);
  const [image, setImage] = useState(u.image);
  const [mobile, setMobile] = useState(u.mobile);
  const [interests, setInterests] = useState(u.interests);
  const [education, setEducation] = useState(u.education.map((e) => ({ ...e, _k: newKey() })));
  const [experience, setExperience] = useState(u.experience.map((e) => ({ ...e, _k: newKey() })));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [completed, setCompleted] = useState(u.profileCompleted);

  const patch = (setter, key, patchObj) =>
    setter((rows) => rows.map((r) => (r._k === key ? { ...r, ...patchObj } : r)));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: "", message: "" });
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          image,
          mobile,
          interests,
          education: education.map(({ _k, ...r }) => r),
          experience: experience.map(({ _k, ...r }) => r),
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || "Could not save.");
      // reflect what the server cleaned up (e.g. +91 format)
      setMobile(result.user.mobile);
      setCompleted(result.user.profileCompleted);
      setStatus({ type: "success", message: "Profile saved." });
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Could not save." });
    } finally {
      setSaving(false);
    }
  };

  const initial = (name || u.email)[0]?.toUpperCase();

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      {/* ---------- personal ---------- */}
      <Card Icon={User} title="Personal details" subtitle="Your name, photo and contact number.">
        <div className="mb-6 flex items-center gap-4">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" className="h-16 w-16 rounded-full border border-gray-200 object-cover" />
          ) : (
            <span className="grid h-16 w-16 place-items-center rounded-full bg-[#173f32] text-xl font-semibold text-white">
              {initial}
            </span>
          )}
          <div>
            <p className="text-[14px] font-semibold text-[#060B1F]">{name || "Your name"}</p>
            <p className="text-[12px] text-gray-500">{u.email}</p>
            <span
              className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                completed ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
              }`}
            >
              {completed ? "Profile complete" : "Profile incomplete"}
            </span>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <TextInput label="Full name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" maxLength={80} />
          <TextInput label="Email" value={u.email} disabled readOnly hint="Email can't be changed." />
          <TextInput
            label="Mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            inputMode="tel"
            autoComplete="tel"
            placeholder="10-digit mobile number"
            hint="Saved with +91."
          />
          <TextInput
            label="Profile photo link"
            disabled readOnly
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://…"
          />
        </div>

        <dl className="mt-6 grid gap-3 rounded-2xl border border-gray-100 bg-gray-50/60 p-4 text-[12px] sm:grid-cols-4">
          {[
            ["Sign-in method", u.provider ? u.provider[0].toUpperCase() + u.provider.slice(1) : "—"],
            ["Referral code", u.referralCode || "—"],
            ["Last login", fmtDate(u.lastLogin)],
            ["Active sessions", String(u.activeSessionCount)],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-gray-400">{k}</dt>
              <dd className="mt-0.5 font-semibold text-[#303a35]">{v}</dd>
            </div>
          ))}
        </dl>
      </Card>

      {/* ---------- interests ---------- */}
      <Card
        Icon={Sparkles}
        title="Interested in"
        subtitle="Pick the tools, skills, categories and subcategories you want to learn."
      >
        <InterestPicker options={options} value={interests} onChange={setInterests} />
      </Card>

      {/* ---------- education ---------- */}
      <Card
        Icon={GraduationCap}
        title="Education"
        subtitle="Add your degrees and schools."
        action={<AddButton onClick={() => setEducation((r) => [...r, blankEdu()])}>Add education</AddButton>}
      >
        {education.length ? (
          <div className="space-y-4">
            {education.map((row, i) => (
              <div key={row._k} className="rounded-2xl border border-gray-100 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[12px] font-semibold text-gray-400">Education {i + 1}</p>
                  <RemoveButton label={`Remove education ${i + 1}`} onClick={() => setEducation((r) => r.filter((x) => x._k !== row._k))} />
                </div>
                <div className="grid gap-4 sm:grid-cols-[1fr_1fr_120px]">
                  <TextInput label="Degree" value={row.degree} onChange={(e) => patch(setEducation, row._k, { degree: e.target.value })} placeholder="B.Tech, Computer Science" maxLength={120} />
                  <TextInput label="School / College" value={row.school} onChange={(e) => patch(setEducation, row._k, { school: e.target.value })} placeholder="University name" maxLength={160} />
                  <TextInput label="Year" value={row.year} onChange={(e) => patch(setEducation, row._k, { year: digits(e.target.value) })} inputMode="numeric" placeholder="2024" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-gray-400">No education added yet. Use “Add education”.</p>
        )}
      </Card>

      {/* ---------- experience ---------- */}
      <Card
        Icon={Briefcase}
        title="Experience"
        subtitle="Add the places you have worked."
        action={<AddButton onClick={() => setExperience((r) => [...r, blankExp()])}>Add experience</AddButton>}
      >
        {experience.length ? (
          <div className="space-y-4">
            {experience.map((row, i) => (
              <div key={row._k} className="rounded-2xl border border-gray-100 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[12px] font-semibold text-gray-400">Experience {i + 1}</p>
                  <RemoveButton label={`Remove experience ${i + 1}`} onClick={() => setExperience((r) => r.filter((x) => x._k !== row._k))} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextInput label="Company" value={row.company} onChange={(e) => patch(setExperience, row._k, { company: e.target.value })} placeholder="Company name" maxLength={160} />
                  <TextInput label="Role (optional)" value={row.title} onChange={(e) => patch(setExperience, row._k, { title: e.target.value })} placeholder="Software Engineer" maxLength={120} />
                  <TextInput label="Start year" value={row.startYear} onChange={(e) => patch(setExperience, row._k, { startYear: digits(e.target.value) })} inputMode="numeric" placeholder="2021" />
                  <TextInput
                    label="End year"
                    value={row.current ? "" : row.endYear}
                    onChange={(e) => patch(setExperience, row._k, { endYear: digits(e.target.value) })}
                    inputMode="numeric"
                    placeholder={row.current ? "Present" : "2024"}
                    disabled={row.current}
                  />
                </div>
                <label className="mt-4 flex cursor-pointer items-center gap-2.5 text-[13px] text-[#303a35]">
                  <input
                    type="checkbox"
                    checked={row.current}
                    onChange={(e) => patch(setExperience, row._k, { current: e.target.checked, endYear: e.target.checked ? "" : row.endYear })}
                    className="h-4 w-4 rounded border-gray-300 accent-[#173f32]"
                  />
                  I currently work here
                </label>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-gray-400">No experience added yet. Use “Add experience”.</p>
        )}
      </Card>

      {/* ---------- save ---------- */}
      <div className="flex flex-col-reverse items-stretch justify-end gap-3 sm:flex-row sm:items-center">
        {status.message && (
          <p
            role={status.type === "error" ? "alert" : "status"}
            className={`flex items-center gap-2 text-[13px] sm:mr-auto ${status.type === "error" ? "text-red-600" : "text-emerald-700"}`}
          >
            {status.type === "success" && <CheckCircle2 size={16} />}
            {status.message}
          </p>
        )}
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-[54px] min-w-[200px] items-center justify-center gap-2 rounded-xl bg-[#173f32] px-8 text-[14px] font-semibold text-white transition hover:bg-[#10302a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (<><LoaderCircle size={16} className="animate-spin" /> Saving…</>) : "Save profile"}
        </button>
      </div>
    </form>
  );
}