"use client";

// Path: component/CourseLearnList.jsx

import { useState } from "react";
import { Check } from "lucide-react";

export default function CourseLearnList({ items = [], initial = 8 }) {
  const [open, setOpen] = useState(false);
  const visible = open ? items : items.slice(0, initial);

  return (
    <>
      <ul className="mt-5 grid gap-x-8 gap-y-3.5 md:grid-cols-2">
        {visible.map((html, index) => (
          <li key={index} className="flex gap-3 text-sm leading-relaxed text-slate-700">
            <Check size={16} className="mt-0.5 shrink-0 text-[#0039bd]" aria-hidden="true" />
            <span dangerouslySetInnerHTML={{ __html: html }} />
          </li>
        ))}
      </ul>

      {items.length > initial && (
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="mt-5 text-sm font-semibold text-[#0039bd] hover:underline"
        >
          {open ? "Show less" : `Show all ${items.length} outcomes`}
        </button>
      )}
    </>
  );
}