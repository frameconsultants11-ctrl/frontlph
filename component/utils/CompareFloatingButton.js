"use client";

import Link from "next/link";
import {
  ArrowLeftRight,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  getCompareIds,
  clearCompare,
} from "@/lib/compare";

export default function CompareFloatingButton() {
  const [ids, setIds] = useState([]);

  useEffect(() => {
    const update = () => {
      setIds(getCompareIds());
    };

    update();

    window.addEventListener("compare-updated", update);
    window.addEventListener("storage", update);

    return () => {
      window.removeEventListener("compare-updated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  if (!ids.length) {
    return null;
  }

  const handleClear = () => {
    clearCompare();

    setIds([]);

    window.dispatchEvent(
      new Event("compare-updated")
    );
  };

  return (
    <div
      className="
        fixed
        right-0
        top-1/2
        -translate-y-1/2
        z-[9999]
        flex
        flex-col
        items-center
      "
    >
      {/* Compare */}
      <Link
        href="/compare"
        className="
          relative
          w-[40px]
          min-h-[110px]
          bg-gray-950
          text-white
          shadow-xl
          hover:bg-gray-800
          transition-colors
          flex
          flex-col
          items-center
          justify-center
          gap-3
        "
      >
        {/* Count */}
        <span
          className="
            absolute
            -top-2
            -left-2
            w-6
            h-6
            rounded-full
            bg-green-500
            text-white
            text-xs
            font-bold
            flex
            items-center
            justify-center
            border-2
            border-white
          "
        >
          {ids.length}
        </span>

        <ArrowLeftRight className="w-5 h-5" />

        {/* Vertical text */}
        <span
          className="
            text-xs
            font-semibold
            [writing-mode:vertical-rl]
            rotate-180
          "
        >
          Compare
        </span>
      </Link>

      {/* Clear */}
      <button
        type="button"
        onClick={handleClear}
        className="
          w-9.5
          h-7
          bg-white
          border
          border-gray-200
          shadow
          flex
          items-center
          justify-center
          cursor-pointer
          hover:bg-gray-50
        "
        title="Clear comparison"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );
}