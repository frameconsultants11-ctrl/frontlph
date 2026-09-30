"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Loader2 } from "lucide-react";

export default function SearchableSelect({
  label,
  value,
  valueId,
  editable,
  endpoint,
  placeholder = "Search...",
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!editable || !open) return;

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${endpoint}?q=${encodeURIComponent(search)}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setResults(data.results || []);
        }
      } catch (error) {
        console.error(
          "SEARCH OPTIONS ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [search, endpoint, editable, open]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  if (!editable) {
    return (
      <div>
        <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.4px] text-[#89938e]">
          {label}
        </label>

        <div className="flex min-h-[42px] items-center rounded-[9px] bg-white px-3 text-[12px] text-[#53605a]">
          {value || "Not added"}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className="relative"
    >
      <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.4px] text-[#89938e]">
        {label}
      </label>

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-[42px] w-full items-center justify-between rounded-[9px] border border-[#dfe6e2] bg-white px-3 text-left text-[12px] text-[#17251f]"
      >
        <span
          className={
            value
              ? "text-[#17251f]"
              : "text-[#9aa39e]"
          }
        >
          {value || placeholder}
        </span>

        <ChevronDown
          size={15}
          className="text-[#7b8781]"
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-30 mt-1 overflow-hidden rounded-[12px] border border-[#dfe6e2] bg-white shadow-[0_10px_30px_rgba(23,63,50,0.10)]">
          <div className="border-b border-[#edf0ee] p-2">
            <input
              autoFocus
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder={placeholder}
              className="h-[36px] w-full rounded-[8px] bg-[#f7f9f7] px-3 text-[11px] text-[#17251f] outline-none placeholder:text-[#9aa39e]"
            />
          </div>

          <div className="max-h-[220px] overflow-y-auto p-1">
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2
                  size={17}
                  className="animate-spin text-[#173f32]"
                />
              </div>
            ) : results.length === 0 ? (
              <p className="px-3 py-5 text-center text-[11px] text-[#89938e]">
                No results found
              </p>
            ) : (
              results.map((option) => (
                <button
                  type="button"
                  key={option.id}
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="flex w-full items-center justify-between rounded-[8px] px-3 py-2.5 text-left text-[11px] text-[#53605a] hover:bg-[#f3f7f3]"
                >
                  <span>{option.name}</span>

                  {valueId === option.id && (
                    <Check
                      size={14}
                      className="text-[#173f32]"
                    />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}