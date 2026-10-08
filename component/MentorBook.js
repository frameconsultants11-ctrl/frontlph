import { calculateExperience } from "@/lib/data/calculateExp";
import {
  Briefcase,
  CheckSquare,
  Star,
  Zap,
} from "lucide-react";

import MentorShareButton from "./profile/MentorShareButton";
import CompareButton from "./utils/CompareButton";
import MessageTrainerButton from "./utils/MessageTrainerButton";

export default function MentorBook({ trainer, session }) {
  const isFreeCallUsed = session?.user?.isFreeCallUsed === true;

  return (
    <aside className="w-full lg:w-[380px] shrink-0 sticky top-24 font-sans">
      <div className="relative overflow-hidden bg-white rounded-2xl border border-green-800/20 p-6">

        {/* =====================================================
            GREEN GRADIENT + TRANSPARENT DOTTED OVERLAY
        ====================================================== */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-60"
          style={{
            backgroundImage: `
              radial-gradient(
                circle at 1px 1px,
                rgba(16,185,129,0.08) 1px,
                transparent 1.5px
              ),
              linear-gradient(
                to bottom,
                rgba(16,185,129,0.48) 0%,
                rgba(52,211,153,0.18) 30%,
                rgba(110,231,183,0.08) 55%,
                rgba(255,255,255,0) 100%
              )
            `,
            backgroundSize: "8px 8px, 100% 100%",
          }}
        />

        {/* =====================================================
            CONTENT
        ====================================================== */}
        <div className="relative z-10">

          {/* =====================================================
              PRICING / FREE TRIAL HEADER
          ====================================================== */}
          {!isFreeCallUsed ? (
            <>
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[36px] font-bold text-gray-900 tracking-tight">
                    FREE
                  </span>

                  <span className="text-gray-800 text-sm">
                    15 min trial lesson
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-1">
                  Try a session with {trainer.name} before booking.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-[36px] font-bold text-gray-900 tracking-tight">
                  ₹ {trainer.price}/-
                </span>

                <span className="text-gray-800 text-sm">
                  per lesson
                </span>
              </div>
            </>
          )}

          {/* =====================================================
              STATS ROW
          ====================================================== */}
          <div className="flex items-center gap-6 mb-6">

            {/* Rating */}
            <div>
              <div className="flex items-center gap-1 font-bold text-gray-800 text-lg">
                <Star className="w-4 h-4 text-yellow-400" />
                4.9
              </div>

              <div className="text-sm text-gray-500 mt-0.5">
                50 reviews
              </div>
            </div>

            {/* Experience */}
            <div>
              <div className="flex items-center gap-1 font-bold text-gray-800 text-lg">
                <Briefcase className="w-4 h-4 text-gray-700" />
                {calculateExperience(trainer.experience)}
              </div>

              <div className="text-sm text-gray-500 mt-0.5">
                of Exp.
              </div>
            </div>
          </div>

          {/* =====================================================
              PRIMARY ACTION
          ====================================================== */}
          <button
            className="
              w-full
              bg-gray-950
              text-white
              font-semibold
              shadow-xs
              cursor-pointer
              text-md
              py-3.5
              px-4
              rounded-full
              flex
              items-center
              justify-center
              gap-2
              transition-all
              hover:bg-gray-800
              active:scale-[0.98]
              mb-4
            "
          >
            <Zap className="w-4 h-4" />

            {isFreeCallUsed
              ? "Book lesson"
              : "Book free trial"}
          </button>

          {/* =====================================================
              SECONDARY ACTIONS
          ====================================================== */}
          <div className="grid grid-cols-3 gap-3 mb-6">

            <MessageTrainerButton
              trainer={trainer}
              session={session}
            />

            <CompareButton trainerId={trainer.id} />

            <MentorShareButton
              referralCode={session?.user?.referralCode}
              trainer={trainer.name}
            />

          </div>

          {/* =====================================================
              FREE TRIAL / PAID MESSAGE
          ====================================================== */}
          {!isFreeCallUsed ? (
            <div className="bg-[#e7fcf5] rounded-xl p-4 flex gap-3">

              <div className="shrink-0 mt-0.5">
                <CheckSquare className="w-5 h-5 text-black fill-black/10" />
              </div>

              <div>
                <p className="font-bold text-gray-900 text-sm mb-0.5">
                  Your first lesson is free!
                </p>

                <p className="text-gray-700 text-sm">
                  Get a free 15-minute trial session with this trainer.
                </p>
              </div>

            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-4 flex gap-3 border border-gray-100">

              <div className="shrink-0 mt-0.5">
                <CheckSquare className="w-5 h-5 text-black fill-black/10" />
              </div>

              <div>
                <p className="font-bold text-gray-900 text-sm mb-0.5">
                  Free trial already used
                </p>

                <p className="text-gray-700 text-sm">
                  Your free trial has been used. Book a lesson with this
                  trainer to continue learning.
                </p>
              </div>

            </div>
          )}

        </div>
      </div>
    </aside>
  );
}