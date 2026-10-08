"use client";

import { Upload, Check } from "lucide-react";
import { useState } from "react";

export default function MentorShareButton({
  referralCode,
  trainer,
  session,
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // Current trainer URL
    const url = new URL(window.location.href);

    /*
     * If logged in + referral code exists:
     * add ?ref=090B30FB
     *
     * If not logged in:
     * share normal URL
     */
    if (session && referralCode) {
      url.searchParams.set("ref", referralCode);
    } else {
      // Remove ref if current URL already has one
      url.searchParams.delete("ref");
    }

    const shareUrl = url.toString();

    try {
      if (navigator.share) {
        await navigator.share({
          title: trainer?.name
            ? `Learn with ${trainer.name}`
            : "Learn with this mentor",

          text: trainer?.name
            ? `Check out ${trainer.name} on Learn Per Hour`
            : "Check out this mentor on Learn Per Hour",

          url: shareUrl,
        });

        return;
      }

      await navigator.clipboard.writeText(shareUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      // User cancelled native share
      if (error?.name !== "AbortError") {
        console.error("Share failed:", error);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="
        flex
        items-center
        justify-center
        py-3
        border-[1.5px]
        border-gray-200
        rounded-full
        hover:bg-gray-50
        hover:border-gray-300
        transition-colors
        relative
        cursor-pointer
        w-full
      "
      title="Share mentor"
    >
      {copied ? (
        <Check className="w-5 h-5 text-green-600" />
      ) : (
        <Upload className="w-5 h-5 text-gray-700" />
      )}

      {copied && (
        <span
          className="
            absolute
            -top-9
            left-1/2
            -translate-x-1/2
            whitespace-nowrap
            bg-gray-900
            text-white
            text-xs
            px-3
            py-1.5
            rounded-lg
          "
        >
          Link copied
        </span>
      )}
    </button>
  );
}