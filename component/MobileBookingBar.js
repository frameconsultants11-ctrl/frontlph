"use client";

import {
  Zap,
  MessageSquare,
  Heart,
  Upload,
} from "lucide-react";

export default function MobileBookingBar() {
  return (
    <div
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-[999]
        lg:hidden
        bg-white
        border-t
        border-gray-200
        px-4
        pt-3
        pb-[calc(12px+env(safe-area-inset-bottom))]
        shadow-[0_-4px_20px_rgba(0,0,0,0.08)]
      "
    >
      <div className="max-w-md mx-auto flex gap-2">
        
        {/* Book Trial */}
        <button
          type="button"
          className="
            w-3/5
            h-[44px]
            bg-green-800
            text-white
            font-semibold
            shadow-sm
            cursor-pointer
            text-md
            px-2
            rounded-full
            flex
            items-center
            justify-center
            gap-2
            transition-all
            hover:bg-gray-800
            active:scale-[0.98]
          "
        >
          <Zap className="w-4 h-4 shrink-0" />
          <span>Book trial lesson</span>
        </button>

        {/* Secondary Actions */}
        <div className="grid grid-cols-3 gap-2 w-2/5">
          
          {/* Message */}
          <button
            type="button"
            aria-label="Message mentor"
            className="
              h-[44px]
              w-full
              flex
              items-center
              justify-center
              border-[1.5px]
              border-gray-200
              rounded-full
              bg-white
              hover:bg-gray-50
              hover:border-gray-300
              transition-colors
            "
          >
            <MessageSquare className="w-4 h-4 text-gray-700" />
          </button>

          {/* Heart */}
          <button
            type="button"
            aria-label="Save mentor"
            className="
              h-[44px]
              w-full
              flex
              items-center
              justify-center
              border-[1.5px]
              border-gray-200
              rounded-full
              bg-white
              hover:bg-gray-50
              hover:border-gray-300
              transition-colors
            "
          >
            <Heart className="w-4 h-4 text-gray-700" />
          </button>

          {/* Share */}
          <button
            type="button"
            aria-label="Share mentor"
            className="
              h-[44px]
              w-full
              flex
              items-center
              justify-center
              border-[1.5px]
              border-gray-200
              rounded-full
              bg-white
              hover:bg-gray-50
              hover:border-gray-300
              transition-colors
            "
          >
            <Upload className="w-4 h-4 text-gray-700" />
          </button>

        </div>
      </div>
    </div>
  );
}