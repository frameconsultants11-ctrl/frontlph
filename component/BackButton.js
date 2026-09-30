"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton({
  label = "Back",
  className = "",
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={`
        inline-flex
        h-6
        items-center
        gap-2
        cursor-pointer
        rounded-lg
        border
        border-gray-200
        bg-white
        px-3.5
        text-xs
        font-medium
        text-gray-600
        shadow-sm
        transition-all
        duration-200
        hover:border-gray-300
        hover:bg-gray-50
        hover:text-gray-900
        active:scale-[0.97]
        ${className}
      `}
    >
      <ArrowLeft size={14} strokeWidth={2} />
      <span>{label}</span>
    </button>
  );
}