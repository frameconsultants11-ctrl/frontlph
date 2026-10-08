"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FolderKanban,
} from "lucide-react";


// =====================================================
// BACKGROUND COLORS
// =====================================================

const CARD_BACKGROUNDS = [
  "#E8F7F0",
  "#E5F2FF",
  "#F2ECFF",
  "#FFF0D9",
  "#FCE1F1",
];


// =====================================================
// COURSE SLIDER
// =====================================================

export default function CourseSlider({ id }) {
  console.log("CourseSlider id:", id);
  const viewportRef =
    useRef(null);

  // ===================================================
  // STATE
  // ===================================================

  const [courses, setCourses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [trainerName, setTrainerName] =
    useState("");

  const [
    viewportWidth,
    setViewportWidth,
  ] = useState(0);

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  const [
    isAnimating,
    setIsAnimating,
  ] = useState(false);

  const [
    visibleCards,
    setVisibleCards,
  ] = useState(1);


  // ===================================================
  // GET VISIBLE CARDS
  // ===================================================

  const getVisibleCards = () => {
    if (
      typeof window === "undefined"
    ) {
      return 1;
    }

    if (
      window.innerWidth < 768
    ) {
      return 1;
    }

    if (
      window.innerWidth < 1024
    ) {
      return 2;
    }

    return 3;
  };


  // ===================================================
  // FETCH SIMILAR COURSES
  // ===================================================

  useEffect(() => {
    if (!id) {
      setCourses([]);
      setLoading(false);
      return;
    }

    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            `/api/trainers/${id}/similar-courses`,
            {
              method: "GET",

              headers: {
                "Content-Type":
                  "application/json",
              },

              cache: "no-store",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to fetch courses"
          );
        }

        setCourses(
          Array.isArray(data.courses)
            ? data.courses
            : []
        );

        setTrainerName(
          data?.trainer?.name || ""
        );

        setCurrentIndex(0);
      } catch (error) {
        console.error(
          "Course API Error:",
          error
        );

        setError(
          error.message ||
            "Failed to load courses"
        );

        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [id]);


  // ===================================================
  // MEASURE CONTAINER
  // ===================================================

  useEffect(() => {
    const updateDimensions =
      () => {
        if (
          !viewportRef.current
        ) {
          return;
        }

        const width =
          viewportRef.current.getBoundingClientRect()
            .width;

        setViewportWidth(width);

        setVisibleCards(
          getVisibleCards()
        );
      };

    updateDimensions();

    const resizeObserver =
      new ResizeObserver(
        updateDimensions
      );

    if (
      viewportRef.current
    ) {
      resizeObserver.observe(
        viewportRef.current
      );
    }

    window.addEventListener(
      "resize",
      updateDimensions
    );

    return () => {
      resizeObserver.disconnect();

      window.removeEventListener(
        "resize",
        updateDimensions
      );
    };
  }, []);


  // ===================================================
  // RESET SLIDER WHEN SCREEN SIZE CHANGES
  // ===================================================

  useEffect(() => {
    setCurrentIndex(0);
  }, [visibleCards]);


  // ===================================================
  // SLIDER SETTINGS
  // ===================================================

  const GAP = 24;

  const hasSlider =
    courses.length >
    visibleCards;


  // ===================================================
  // DUPLICATE COURSES FOR INFINITE SLIDER
  // ===================================================

  const sliderItems =
    hasSlider
      ? [...courses, ...courses]
      : courses;


  // ===================================================
  // CARD WIDTH
  // ===================================================

  const cardWidth =
    viewportWidth > 0
      ? (
          viewportWidth -
          GAP *
            (visibleCards - 1)
        ) /
        visibleCards
      : 0;


  // ===================================================
  // SLIDE DISTANCE
  // ===================================================

  const slideDistance =
    cardWidth + GAP;


  // ===================================================
  // NEXT
  // ===================================================

  const nextSlide = () => {
    if (
      !hasSlider ||
      isAnimating
    ) {
      return;
    }

    setIsAnimating(true);

    setCurrentIndex(
      (prev) => prev + 1
    );
  };


  // ===================================================
  // PREVIOUS
  // ===================================================

  const previousSlide = () => {
    if (
      !hasSlider ||
      isAnimating
    ) {
      return;
    }

    if (
      currentIndex === 0
    ) {
      setCurrentIndex(
        courses.length
      );

      return;
    }

    setIsAnimating(true);

    setCurrentIndex(
      (prev) => prev - 1
    );
  };


  // ===================================================
  // ANIMATION COMPLETE
  // ===================================================

  const handleAnimationComplete =
    () => {
      if (
        currentIndex >=
        courses.length
      ) {
        setIsAnimating(false);

        setTimeout(() => {
          setCurrentIndex(0);
        }, 20);

        return;
      }

      setIsAnimating(false);
    };


  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <section className="w-full">
        <div className="mb-10">
          <h2
            className="
              text-[24px]
              md:text-[28px]
              lg:text-[28px]
              leading-tight
              font-bold
              tracking-[-0.8px]
              text-[#172033]
            "
          >
            Related Courses for You
          </h2>

          <p
            className="
              mt-4
              text-[14px]
              md:text-[15px]
              text-[#4B5563]
            "
          >
            Finding courses related to{" "}
            {trainerName || "this trainer"}...
          </p>
        </div>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            gap-6
          "
        >
          {[1, 2, 3].map(
            (item) => (
              <div
                key={item}
                className="
                  h-[300px]
                  rounded-[20px]
                  bg-gray-100
                  animate-pulse
                "
              />
            )
          )}
        </div>
      </section>
    );
  }


  // ===================================================
  // ERROR
  // ===================================================

  if (error) {
    return (
      <section className="w-full">
        <div className="mb-10">
          <h2
            className="
              text-[24px]
              md:text-[28px]
              lg:text-[28px]
              leading-tight
              font-bold
              tracking-[-0.8px]
              text-[#172033]
            "
          >
            Related Courses for You
          </h2>
        </div>

        <div
          className="
            rounded-2xl
            border
            border-red-100
            bg-red-50
            p-6
            text-sm
            text-red-600
          "
        >
          {error}
        </div>
      </section>
    );
  }


  // ===================================================
  // NO COURSES
  // ===================================================

  if (
    courses.length === 0
  ) {
    return (
      <section className="w-full">
        <div className="mb-10">
          <h2
            className="
              text-[24px]
              md:text-[28px]
              lg:text-[28px]
              leading-tight
              font-bold
              tracking-[-0.8px]
              text-[#172033]
            "
          >
            Related Courses for You
          </h2>

          <p
            className="
              mt-4
              text-[14px]
              md:text-[15px]
              leading-[1.45]
              text-[#4B5563]
            "
          >
            No related courses found for{" "}
            {trainerName || "this trainer"}.
          </p>
        </div>
      </section>
    );
  }


  // ===================================================
  // MAIN
  // ===================================================

  return (
    <section className="w-full">

      <div className="w-full">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-10">

          <h2
            className="
              text-[24px]
              md:text-[28px]
              lg:text-[28px]
              leading-tight
              font-bold
              tracking-[-0.8px]
              text-[#172033]
            "
          >
            Related Courses for You
          </h2>

          <p
            className="
              mt-4
              max-w-[1080px]
              text-[14px]
              md:text-[15px]
              leading-[1.45]
              text-[#4B5563]
            "
          >
            Check out the courses
            similar to{" "}
            {trainerName || "this trainer"}.
          </p>

        </div>


        {/* =================================================
            SLIDER WRAPPER
        ================================================= */}

        <div
          className="
            relative
            px-0
            sm:px-5
          "
        >

          {/* =================================================
              LEFT ARROW
          ================================================= */}

          {hasSlider && (
            <button
              type="button"
              onClick={
                previousSlide
              }
              disabled={
                isAnimating
              }
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
              <ChevronLeft
                className="w-6 h-6"
              />
            </button>
          )}


          {/* =================================================
              RIGHT ARROW
          ================================================= */}

          {hasSlider && (
            <button
              type="button"
              onClick={
                nextSlide
              }
              disabled={
                isAnimating
              }
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
              <ChevronRight
                className="w-6 h-6"
              />
            </button>
          )}


          {/* =================================================
              VIEWPORT
          ================================================= */}

          <div
            ref={viewportRef}
            className="
              w-full
              overflow-hidden
              px-1
              py-2
            "
          >

            <motion.div
              className="flex"
              style={{
                gap: `${GAP}px`,
              }}
              animate={{
                x: hasSlider
                  ? -(
                      currentIndex *
                      slideDistance
                    )
                  : 0,
              }}
              transition={{
                duration: 0.55,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              onAnimationComplete={
                handleAnimationComplete
              }
            >

              {sliderItems.map(
                (course, index) => (
                  <CourseCard
                    key={`${course._id}-${index}`}
                    course={course}
                    width={
                      cardWidth
                    }
                    visibleCards={
                      visibleCards
                    }
                    index={index}
                  />
                )
              )}

            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}


function CourseCard({
  course,
  width,
  visibleCards,
  index,
}) {
  // =========================================================
  // BACKGROUND
  // =========================================================

  const bg =
    CARD_BACKGROUNDS[
      index % CARD_BACKGROUNDS.length
    ];

  // =========================================================
  // COURSE VALUES
  // =========================================================

  const title =
    course.title ||
    course.name ||
    course.seoTitle ||
    "Course";

  const description =
    course.description ||
    course.seoDescription ||
    "Explore this course and develop practical skills.";

  const price =
    Number(course.actualPrice) ||
    Number(course.price) ||
    0;

  const hours =
    Number(course.hours) || 0;

  const level =
    course.level
      ? course.level.charAt(0).toUpperCase() +
        course.level.slice(1)
      : "Course";

  // =========================================================
  // OPEN COURSE
  // =========================================================

  const handleCourseClick = () => {
    if (!course._id) {
      return;
    }

    window.location.href =
      `/courses/${course._id}`;
  };

  return (
    <div
      className="shrink-0"
      style={{
        width:
          width > 0
            ? `${width}px`
            : `${100 / visibleCards}%`,
      }}
    >
      <div
        className="
          overflow-hidden
          rounded-[18px]
          border
          border-gray-100
          bg-white
          shadow-[0_3px_15px_rgba(0,0,0,0.07)]
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]
        "
      >

        {/* =================================================
            COLORED CONTENT
        ================================================= */}

        <div
          className="
            relative
            overflow-hidden
            h-[220px]
            p-5
          "
          style={{
            backgroundColor: bg,
          }}
        >

          {/* Background Glow */}

          <div
            className="
              pointer-events-none
              absolute
              -right-12
              -top-12
              w-32
              h-32
              rounded-full
              bg-white/35
              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -left-16
              -bottom-16
              w-32
              h-32
              rounded-full
              bg-white/25
              blur-3xl
            "
          />

          {/* =================================================
              LEVEL
          ================================================= */}

          <div className="relative z-10">
            <span
              className="
                inline-flex
                items-center
                rounded-full
                border
                border-white/60
                bg-white/50
                px-2.5
                py-1
                text-[10px]
                font-semibold
                tracking-wide
                text-gray-700
                backdrop-blur-sm
              "
            >
              {level}
            </span>
          </div>

          {/* =================================================
              TITLE + DESCRIPTION
          ================================================= */}

          <div
            className="
              relative
              z-10
              mt-4
            "
          >
            <h3
              className="
                text-[18px]
                md:text-[19px]
                font-semibold
                leading-[1.2]
                tracking-[-0.2px]
                text-[#171717]
                line-clamp-2
              "
            >
              {title}
            </h3>

            <p
              className="
                mt-2
                text-[12px]
                leading-[1.45]
                text-gray-600
                line-clamp-2
                max-w-[95%]
              "
            >
              {description}
            </p>
          </div>

          {/* =================================================
              HOURS
          ================================================= */}

          {hours > 0 && (
            <div
              className="
                absolute
                bottom-5
                left-5
                z-10
                inline-flex
                items-center
                gap-1.5
                rounded-full
                bg-white/55
                px-2.5
                py-1.5
                text-[11px]
                font-medium
                text-gray-700
                backdrop-blur-sm
              "
            >
              <Clock3 className="w-3.5 h-3.5" />

              {hours} hours
            </div>
          )}
        </div>

        {/* =================================================
            BOTTOM PRICE + BUTTON
        ================================================= */}

        <div
          className="
            h-[64px]
            px-5
            flex
            items-center
            justify-between
            gap-3
            bg-white
          "
        >

          {/* PRICE */}

          <div>
            <p
              className="
                text-[10px]
                leading-none
                text-gray-400
                mb-1
              "
            >
              Course Price
            </p>

            <p
              className="
                text-[17px]
                leading-none
                font-bold
                tracking-tight
                text-gray-900
              "
            >
              ₹
              {price.toLocaleString("en-IN")}
            </p>
          </div>

          {/* BUTTON */}

          <button
            type="button"
            onClick={handleCourseClick}
            className="
              shrink-0
              px-4
              py-2
              rounded-full
              bg-[#111111]
              text-white
              text-[12px]
              font-semibold

              hover:bg-gray-800
              active:scale-[0.97]

              transition-all
              duration-200

              flex
              items-center
              gap-1.5
            "
          >
            Know More

            <ArrowRight
              size={13}
            />
          </button>

        </div>
      </div>
    </div>
  );
}