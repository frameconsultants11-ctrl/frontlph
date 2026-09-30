import React from "react";
import { Search, IndianRupee, MonitorPlay } from "lucide-react";

const Hero = () => {
  const mentors = [
    {
      id: 1,
      bg: "bg-[#f2eadd]",
      offset: "translate-y-12 opacity-60",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      bg: "bg-[#f4f1d6]",
      offset: "translate-y-4",
      img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 3,
      bg: "bg-[#dbeafe]",
      offset: "translate-y-0",
      img: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 4,
      bg: "bg-[#dcfce7]",
      offset: "translate-y-0",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 5,
      bg: "bg-[#ffedd5]",
      offset: "translate-y-4",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 6,
      bg: "bg-[#f3f4f6]",
      offset: "translate-y-12 opacity-60",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <div
      className="
        min-h-screen
        w-full
        flex
        flex-col
        overflow-x-hidden
        font-sans
        relative
      "
      style={{
        backgroundColor: "#fafcfa",
        backgroundImage: `
          radial-gradient(
            circle at 20% 0%,
            rgba(163, 230, 181, 0.6) 0%,
            transparent 40%
          ),
          radial-gradient(
            circle at 80% 0%,
            rgba(163, 230, 181, 0.6) 0%,
            transparent 40%
          ),
          radial-gradient(
            circle at 50% 30%,
            #ffffff 0%,
            transparent 60%
          )
        `,
      }}
    >
      {/* ================= MAIN CONTENT ================= */}
      <main
        className="
          flex-1
          flex
          flex-col
          items-center
          pt-24
          md:pt-32
          px-4
          relative
          z-10
          w-full
          max-w-7xl
          mx-auto
        "
      >
        {/* Badge */}
        <div
          className="
            flex
            items-center
            gap-2
            bg-white/20
            backdrop-blur-md
            border
            border-white
            shadow-sm
            rounded-full
            px-4
            py-1.5
            mb-8
          "
        >
          <MonitorPlay className="w-4 h-4 text-green-600" />

          <span className="text-xs font-semibold text-green-700 tracking-wide">
            Your #1 Platform for 1:1 Training
          </span>
        </div>

        {/* Heading */}
        <h1
          className="
            text-4xl
            md:text-5xl
            lg:text-[56px]
            font-bold
            text-[#14532d]
            text-center
            max-w-4xl
            leading-[1.15]
            tracking-tight
            mb-6
          "
        >
          1:1 Learning, Interview Prep &
          <br className="hidden md:block" />
          Project Support
        </h1>

        {/* Description */}
        <p
          className="
            text-gray-500
            text-base
            md:text-lg
            text-center
            max-w-3xl
            mb-12
            px-4
            leading-relaxed
          "
        >
          From mastering individual topics to preparing for interviews,
          completing courses,
          <br className="hidden md:block" />
          and building real-world projects.
        </p>

        {/* ================= SEARCH BOX ================= */}
        <div
          className="
            bg-white
            rounded-2xl
            sm:rounded-full
            shadow-[0_8px_30px_rgb(0,0,0,0.08)]
            p-2
            w-full
            max-w-3xl
            flex
            flex-col
            md:flex-row
            items-center
            gap-2
            border
            border-gray-100
            transition-all
            focus-within:shadow-[0_8px_30px_rgb(0,0,0,0.12)]
            hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]
          "
        >
          {/* Subject Input */}
          <div
            className="
              flex
              flex-1
              items-center
              px-4
              py-2
              w-full
              min-w-0
            "
          >
            <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />

            <input
              type="text"
              placeholder="e.g. Openshift"
              className="
                w-full
                min-w-0
                text-gray-700
                placeholder-gray-400
                bg-transparent
                text-lg
                outline-none
                focus:ring-0
              "
            />
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-8 bg-gray-200 shrink-0" />

          {/* Price Input */}
          <div
            className="
              flex
              flex-1
              items-center
              px-4
              py-2
              w-full
              min-w-0
              border-t
              md:border-t-0
              border-gray-100
            "
          >
            <div
              className="
                flex
                items-center
                justify-center
                text-gray-400
                rounded-full
                w-7
                h-7
                mr-3
                shrink-0
              "
            >
              <IndianRupee className="w-4 h-4" />
            </div>

            <input
              type="text"
              placeholder="1800/- Hr."
              className="
                w-full
                min-w-0
                text-gray-700
                placeholder-gray-400
                bg-transparent
                text-lg
                outline-none
                focus:ring-0
              "
            />
          </div>

          {/* Search Button */}
          <button
            className="
              w-full
              md:w-auto
              bg-[#e8f5e9]
              hover:bg-[#c8e6c9]
              text-[#14532d]
              border
              border-[#a3d9a5]
              transition-all
              duration-200
              rounded-full
              px-8
              py-2.5
              flex
              items-center
              justify-center
              gap-2
              font-medium
              whitespace-nowrap
              mt-2
              md:mt-0
              shadow-sm
              hover:shadow-md
              hover:-translate-y-0.5
              shrink-0
            "
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>
      </main>

      {/* ================= MENTOR SECTION ================= */}
      <div
        className="
          w-full
          mt-16
          md:mt-24
          pb-0
          overflow-hidden
        "
      >
        <div
          className="
            w-full
            flex
            items-end
            justify-center
            gap-4
            md:gap-6
            px-4
            pt-8
            pb-0
            overflow-hidden
          "
        >
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className={`
                w-[calc((100vw-48px)/3)]
                max-w-[260px]
                min-w-[100px]
                md:w-[260px]
                h-[260px]
                md:h-[340px]
                flex-shrink
                ${mentor.bg}
                rounded-[32px]
                overflow-hidden
                relative
                shadow-sm
                transition-transform
                duration-500
                hover:-translate-y-2
                ${mentor.offset}
              `}
            >
              <img
                src={mentor.img}
                alt={`Mentor profile ${mentor.id}`}
                className="
                  absolute
                  bottom-0
                  left-0
                  w-full
                  h-full
                  object-cover
                  mix-blend-multiply
                  filter
                  contrast-125
                  object-top
                "
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;