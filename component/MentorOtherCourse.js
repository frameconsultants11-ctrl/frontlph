"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FolderKanban,
} from "lucide-react";

const COURSES = [
  {
    id: 1,
    type: "Student",
    title: "UI/UX designer",
    description:
      "Master the principles of user interface and user experience design.",
    tasks: 350,
    projects: 3,
    progress: 72,
    bottomLabel: "Modules",
    bottomValue: "12/16",
    button: "Continue",
    image: "/courses/uiux.png",
    bg: "#FCE1F1",
  },
  {
    id: 2,
    type: "Recommended",
    title: "QA engineer",
    description:
      "Learn the fundamentals of quality assurance and software testing.",
    tasks: 622,
    projects: 4,
    progress: 0,
    bottomLabel: "Price",
    bottomValue: "18999/-",
    button: "See More",
    image: "/courses/qa.png",
    bg: "#DFF5FC",
  },
  {
    id: 3,
    type: "Popular",
    title: "Frontend Developer",
    description:
      "Build modern responsive websites using HTML, CSS, JavaScript and React.",
    tasks: 420,
    projects: 5,
    progress: 45,
    bottomLabel: "Price",
    bottomValue: "18999/-",
    button: "See More",
    image: "/courses/frontend.png",
    bg: "#E8E5FF",
  },
  {
    id: 4,
    type: "Recommended",
    title: "Data Analyst",
    description:
      "Learn data analysis, visualization and business intelligence fundamentals.",
    tasks: 510,
    projects: 4,
    progress: 0,
    bottomLabel: "Price",
    bottomValue: "18999/-",
    button: "See More",
    image: "/courses/data.png",
    bg: "#E5F7E9",
  },
  {
    id: 5,
    type: "Student",
    title: "Digital Marketing",
    description:
      "Learn SEO, social media, paid advertising and modern digital marketing.",
    tasks: 380,
    projects: 6,
    progress: 62,
    bottomLabel: "Price",
    bottomValue: "18999/-",
    button: "See More",
    image: "/courses/marketing.png",
    bg: "#FFF0D9",
  },
];

export default function CourseSlider() {
  const viewportRef = useRef(null);

  const [viewportWidth, setViewportWidth] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  /*
   * Number of cards visible depending on screen size.
   */
  const getVisibleCards = () => {
    // Default to 1 (mobile-first) to prevent UI jumps on initial load
    if (typeof window === "undefined") return 1;

    if (window.innerWidth < 768) {
      return 1; // 1 Card on Mobile (under 768px)
    }

    if (window.innerWidth < 1024) {
      return 2; // 2 Cards on Tablet (768px to 1023px)
    }

    return 3; // 3 Cards on Desktop (1024px and above)
  };

  const [visibleCards, setVisibleCards] = useState(1);

  /*
   * Slider is required only when there are more
   * courses than visible cards.
   */
  const hasSlider = COURSES.length > visibleCards;

  /*
   * Gap between cards.
   */
  const GAP = 24;

  /*
   * Duplicate courses.
   */
  const sliderItems = hasSlider ? [...COURSES, ...COURSES] : COURSES;

  /* =========================================================
     MEASURE CONTAINER
  ========================================================== */

  useEffect(() => {
    const updateDimensions = () => {
      if (!viewportRef.current) return;

      setViewportWidth(viewportRef.current.getBoundingClientRect().width);
      setVisibleCards(getVisibleCards());
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);

    if (viewportRef.current) {
      resizeObserver.observe(viewportRef.current);
    }

    window.addEventListener("resize", updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  /*
   * When responsive breakpoint changes,
   * reset slider position.
   */
  useEffect(() => {
    setCurrentIndex(0);
  }, [visibleCards]);

  /*
   * Actual width of ONE card.
   */
  const cardWidth =
    viewportWidth > 0
      ? (viewportWidth - GAP * (visibleCards - 1)) / visibleCards
      : 0;

  /*
   * How far one slide should move.
   */
  const slideDistance = cardWidth + GAP;

  /* =========================================================
     NEXT SLIDE
  ========================================================== */

  const nextSlide = () => {
    if (!hasSlider || isAnimating) return;

    setIsAnimating(true);
    setCurrentIndex((prev) => prev + 1);
  };

  /* =========================================================
     PREVIOUS SLIDE
  ========================================================== */

  const previousSlide = () => {
    if (!hasSlider || isAnimating) return;

    if (currentIndex === 0) {
      setCurrentIndex(COURSES.length);
      return;
    }

    setIsAnimating(true);
    setCurrentIndex((prev) => prev - 1);
  };

  /* =========================================================
     ANIMATION COMPLETE
  ========================================================== */

  const handleAnimationComplete = () => {
    if (currentIndex >= COURSES.length) {
      setIsAnimating(false);

      setTimeout(() => {
        setCurrentIndex(0);
      }, 20);

      return;
    }

    setIsAnimating(false);
  };

  return (
    <section className="w-full">
      <div className="w-full">
        <div className="mb-10">
          <h2 className="text-[24px] md:text-[28px] lg:text-[28px] leading-tight font-bold tracking-[-0.8px] text-[#172033]">
            Other Courses By Vaibhav Joshi
          </h2>

          <p className="mt-4 max-w-[1080px] text-[14px] md:text-[15px] leading-[1.45] text-[#4B5563]">
            Check out the courses offered by vaibhav joshi
          </p>
        </div>
        {/* =====================================================
            SLIDER WRAPPER
        ====================================================== */}

        <div className="relative px-0 sm:px-5">
          {/* =====================================================
              LEFT ARROW
          ====================================================== */}

          {hasSlider && (
            <button
              type="button"
              onClick={previousSlide}
              disabled={isAnimating}
              aria-label="Previous course"
              className="
                absolute
                z-30

                -left-5
                md:-left-0
                top-1/2
                -translate-y-1/2

                w-10
                h-10

                rounded-full

                bg-[#F1F2F2]
                border
                border-gray-200

                flex
                items-center
                justify-center

                text-gray-600

                shadow-sm

                hover:bg-white
                hover:shadow-md

                transition-all

                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* =====================================================
              RIGHT ARROW
          ====================================================== */}

          {hasSlider && (
            <button
              type="button"
              onClick={nextSlide}
              disabled={isAnimating}
              aria-label="Next course"
              className="
                absolute
                z-30

                -right-5
                md:-right-0
                top-1/2
                -translate-y-1/2

                w-10
                h-10

                rounded-full

                bg-[#F1F2F2]
                border
                border-gray-200

                flex
                items-center
                justify-center

                text-gray-600

                shadow-sm

                hover:bg-white
                hover:shadow-md

                transition-all

                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* =====================================================
              VIEWPORT
          ====================================================== */}

          <div
            ref={viewportRef}
            className="w-full overflow-hidden px-1 py-2"
          >
            <motion.div
              className="flex"
              style={{
                gap: `${GAP}px`,
              }}
              animate={{
                x: hasSlider ? -(currentIndex * slideDistance) : 0,
              }}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              onAnimationComplete={handleAnimationComplete}
            >
              {sliderItems.map((course, index) => (
                <CourseCard
                  key={`${course.id}-${index}`}
                  course={course}
                  width={cardWidth}
                  visibleCards={visibleCards}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   COURSE CARD
============================================================ */

function CourseCard({ course, width, visibleCards }) {
  return (
    <div
      className="shrink-0"
      style={{
        // Dynamically fallback based on the active screen configuration 
        // to prevent 33.333% flicker on mobile devices.
        width: width > 0 ? `${width}px` : `${100 / visibleCards}%`,
      }}
    >
      <div
        className="
          overflow-hidden
          rounded-[20px]
          border
          border-white
          bg-white

          shadow-[0_2px_12px_rgba(0,0,0,0.08)]
        "
      >
        {/* =====================================================
            TOP COLORED AREA
        ====================================================== */}

        <div
          className="
            relative
            rounded-[18px]
            p-5
            overflow-hidden
          "
          style={{
            backgroundColor: course.bg,
          }}
        >
          {/* Background Glow */}
          <div
            className="
              pointer-events-none
              absolute

              rounded-full
              bg-white/30
              blur-3xl
            "
          />

          {/* =================================================
              COURSE TYPE
          ================================================== */}

          <div className="relative z-10">
            <span
              className="
                inline-flex
                items-center

                px-3
                py-1.5

                rounded-full

                bg-white/45
                backdrop-blur-sm

                text-[12px]
                font-medium
                text-gray-800
              "
            >
              {course.type}
            </span>
          </div>

          {/* =================================================
              COURSE TEXT
          ================================================== */}

          <div className="relative z-10 mt-5 ">
            <h3 className="text-[19px] md:text-[20px] font-medium text-[#171717]">
              {course.title}
            </h3>

            <p className="mt-2 text-[12px] md:text-[13px] leading-[1.45] text-gray-600">
              {course.description}
            </p>
          </div>

          {/* =================================================
              TASKS / PROJECTS
          ================================================== */}

          <div
            className="
              relative
              z-10
              mt-5

              flex
              items-center
              gap-3

              text-[12px]
              text-gray-800
            "
          >
            <div className="flex items-center gap-1.5">
              <ClipboardList className="w-[17px] h-[17px]" />
              <span>{course.tasks} tasks</span>
            </div>

            <span className="text-gray-500">•</span>

            <div className="flex items-center gap-1.5">
              <FolderKanban className="w-[17px] h-[17px]" />
              <span>{course.projects} projects</span>
            </div>
          </div>
        </div>

        {/* =====================================================
            BOTTOM WHITE AREA
        ====================================================== */}

        <div
          className="
            h-[68px]
            px-5

            flex
            items-center
            justify-between

            bg-white
          "
        >
          <div className="text-[13px] text-gray-600">
            {course.bottomLabel}:{" "}
            <span className="font-semibold text-gray-800">
              {course.bottomValue}
            </span>
          </div>

          <button
            type="button"
            className="
              min-w-[92px]

              px-5
              py-2.5

              rounded-full

              bg-[#111111]
              text-white

              text-[13px]
              font-medium

              hover:bg-gray-800

              active:scale-[0.97]

              transition-all
            "
          >
            {course.button}
          </button>
        </div>
      </div>
    </div>
  );
}