import {
  Briefcase,
  CheckSquare,
  Heart,
  MessageSquare,
  Star,
  Upload,
  Zap,
} from "lucide-react";

export default function MentorBook({trainer}) {
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

          {/* Pricing Header */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-[36px] font-bold text-gray-900 tracking-tight">
              ₹ {trainer.price}/-
            </span>

            <span className="text-gray-800 text-sm">
              Free 15 min lesson
            </span>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-6 mb-6">

            {/* Rating */}
            <div>
              <div className="flex items-center gap-1 font-bold text-gray-800 text-lg">
                <Star className="w-4 h-4  text-yellow-400" />
                4.9
              </div>

              <div className="text-sm text-gray-500 mt-0.5">
                50 reviews
              </div>
            </div>

            {/* Experience */}
            <div>
              <div className="flex items-center gap-1 font-bold text-gray-800 text-lg">
                <Briefcase className="w-4 h-4  text-gray-700" />
                10+
              </div>

              <div className="text-sm text-gray-500 mt-0.5">
                Years of Exp.
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
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
            Book trial lesson
          </button>

          {/* Secondary Actions */}
          <div className="grid grid-cols-3 gap-3 mb-6">

            {/* Message */}
            <button
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
              "
            >
              <MessageSquare className="w-5 h-5 text-gray-700" />
            </button>

            {/* Heart */}
            <button
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
              "
            >
              <Heart className="w-5 h-5 text-gray-700" />
            </button>

            {/* Share */}
            <button
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
              "
            >
              <Upload className="w-5 h-5 text-gray-700" />
            </button>

          </div>

          {/* Alert Box */}
          <div className="bg-[#e7fcf5] rounded-xl p-4 flex gap-3">

            <div className="shrink-0 mt-0.5">
              <CheckSquare className="w-5 h-5 text-black fill-black/10" />
            </div>

            <div>
              <p className="font-bold text-gray-900 text-sm mb-0.5">
                Not a match?
              </p>

              <p className="text-gray-700 text-sm">
                You still have 1 free tutor trials.
              </p>
            </div>

          </div>

        </div>
      </div>
    </aside>
  );
}