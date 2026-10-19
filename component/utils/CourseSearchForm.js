"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";

export default function CourseSearchForm({ item }) {
  const router = useRouter();
  const [toolSearch, setToolSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (toolSearch.trim()) {
      // Supports comma-separated tools, e.g. Bash, AWS
      const tools = toolSearch
        .split(",")
        .map((tool) => tool.trim().toLowerCase())
        .filter(Boolean);

      if (tools.length) {
        params.set("tools", tools.join(","));
      }
    }

    if (maxPrice.trim() && Number.isFinite(Number(maxPrice)) && Number(maxPrice) >= 0) {
      params.set("maxPrice", String(Number(maxPrice)));
    }

    router.push(`/courses${params.size ? `?${params.toString()}` : ""}`);
  };

  return (
    <motion.form
      variants={item}
      onSubmit={handleSearch}
      className="mt-9 flex w-full max-w-2xl flex-col items-center gap-1 rounded-2xl border border-white/40 bg-white/20 p-1 shadow-[0_20px_50px_-15px_rgba(0,15,70,0.55)] md:flex-row md:rounded-full"
    >
      <label className="flex w-full min-w-0 flex-1 items-center px-4 py-2">
        <Search className="mr-3 h-[18px] w-[18px] shrink-0 text-slate-50" />
        <input
          type="text"
          value={toolSearch}
          onChange={(e) => setToolSearch(e.target.value)}
          placeholder="e.g. Bash, AWS"
          aria-label="Search by tools"
          className="w-full min-w-0 bg-transparent text-[15px] text-slate-800 placeholder-slate-50 outline-none"
        />
      </label>

      <div className="hidden h-7 w-px shrink-0 bg-slate-200 md:block" />

      <label className="flex w-full min-w-0 flex-1 items-center border-t border-slate-100 px-4 py-2 md:border-t-0">
        <IndianRupee className="mr-3 h-[18px] w-[18px] shrink-0 text-slate-50" />
        <input
          type="number"
          min="0"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Max price (e.g. 700)"
          aria-label="Maximum course price"
          className="w-full min-w-0 bg-transparent text-[15px] text-slate-800 placeholder-slate-50 outline-none"
        />
      </label>

      <button
        type="submit"
        className="mt-1 flex w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#ccfc3b] px-7 py-3 text-sm font-semibold text-[#060B1F] transition-colors hover:bg-[#c4f035] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#060B1F] md:mt-0 md:w-auto"
      >
        <Search className="h-4 w-4" />
        Search
      </button>
    </motion.form>
  );
}