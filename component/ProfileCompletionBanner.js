"use client";

import Link from "next/link";

export default function ProfileCompletionBanner({ session }) {
  if (!session?.user) {
    return null;
  }

  if (session.user.profileCompleted !== false) {
    return null;
  }

  return (
    <div className="w-full bg-[#b9d63b] mt-19 sticky top-19 z-50 flex items-center justify-center gap-2 px-4">
      <div className="flex items-center justify-center gap-2 px-4 py-2">
        <Link href="/profile" className="text-center text-xs text-gray-800 sm:text-sm">
          Complete your profile to get a free session with the best trainer as
          per your profile{" "}
        <span
          
          className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-black transition hover:underline sm:text-sm"
        >
          Complete Profile
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12h14M13 6l6 6-6 6"
            />
          </svg>
        </span>
        </Link>
      </div>
    </div>
  );
}