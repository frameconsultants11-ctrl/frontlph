"use client";

import {
  Zap,
  MessageSquare,
  Heart,
  Upload,
} from "lucide-react";
import MentorShareButton from "./profile/MentorShareButton";
import CompareButton from "./utils/CompareButton";
import MessageTrainerButton from "./utils/MessageTrainerButton";

export default function MobileBookingBar({trainer, session}) {
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
        font-sans
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
          
                   <MessageTrainerButton trainer={trainer} session={session} />
                   <CompareButton trainerId={trainer.id} />
                    <MentorShareButton referralCode={session?.user?.referralCode} trainer={trainer.name} />
     </div>
      </div>
    </div>
  );
}