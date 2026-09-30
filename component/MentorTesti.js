"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah J.",
    role: "Registered Nurse",
    image: "/images/testimonials/sarah.jpg",
    text: "I found my dream nursing job quickly thanks to this user-friendly portal. The search filters are excellent. Highly recommend it!",
    rating: 4,
    bg: "#EAF0FC",
    starColor: "#174EA6",
  },
  {
    name: "John M.",
    role: "Healthcare Admin",
    image: "/images/testimonials/john.jpg",
    text: "This job portal streamlined our hiring process, helping us find qualified candidates effortlessly. It's a game-changer for healthcare recruitment.",
    rating: 5,
    bg: "#E8F7F7",
    starColor: "#0795A0",
  },
  {
    name: "Emily R.",
    role: "Junior Doctor",
    image: "/images/testimonials/emily.jpg",
    text: "This site made my job search easy, and I secured a fantastic position within weeks. The resources provided are invaluable.",
    rating: 5,
    bg: "#FFF8E5",
    starColor: "#F2C300",
  },
  {
    name: "Michael T.",
    role: "Medical Officer",
    image: "/images/testimonials/michael.jpg",
    text: "The platform made it extremely easy to discover relevant opportunities and connect with the right employers.",
    rating: 5,
    bg: "#F0EBFC",
    starColor: "#7C4DFF",
  },
  {
    name: "Jessica W.",
    role: "Clinical Specialist",
    image: "/images/testimonials/jessica.jpg",
    text: "I loved how simple the entire process was. The job recommendations were relevant and helped me find a great opportunity.",
    rating: 4,
    bg: "#EAF7EF",
    starColor: "#159947",
  },
  {
    name: "David K.",
    role: "Hospital Manager",
    image: "/images/testimonials/david.jpg",
    text: "A very useful platform for healthcare professionals. The hiring process was much faster than I expected.",
    rating: 5,
    bg: "#FDEDF0",
    starColor: "#E54B65",
  },
];

export default function Testimonials() {
  const viewportRef = useRef(null);
  const cardRef = useRef(null);

  const [cardWidth, setCardWidth] = useState(0);
  const [gap, setGap] = useState(16);
  const [currentIndex, setCurrentIndex] = useState(0);

  const hasSlider = testimonials.length > 3;

  /*
   * Duplicate the cards so that the slider can loop infinitely.
   */
  const sliderItems = hasSlider
    ? [...testimonials, ...testimonials]
    : testimonials;

  /* =========================================================
     GET CARD WIDTH
  ========================================================== */

  useEffect(() => {
    if (!hasSlider) return;

    const calculateSize = () => {
      if (!cardRef.current) return;

      const width = cardRef.current.getBoundingClientRect().width;

      setCardWidth(width);
    };

    calculateSize();

    window.addEventListener("resize", calculateSize);

    return () => {
      window.removeEventListener("resize", calculateSize);
    };
  }, [hasSlider]);

  /* =========================================================
     GET GAP
  ========================================================== */

  useEffect(() => {
    if (!cardRef.current) return;

    const parent = cardRef.current.parentElement;

    if (!parent) return;

    const styles = window.getComputedStyle(parent);

    const calculatedGap =
      parseFloat(styles.columnGap || styles.gap || "16");

    setGap(calculatedGap);
  }, []);

  /* =========================================================
     MOVE SLIDER
  ========================================================== */

  const moveTo = (index) => {
    if (!hasSlider || !cardWidth) return;

    setCurrentIndex(index);
  };

  /* =========================================================
     NEXT
  ========================================================== */

  const nextSlide = () => {
    if (!hasSlider) return;

    setCurrentIndex((prev) => {
      const next = prev + 1;

      /*
       * When we reach the duplicated set,
       * jump back to the beginning.
       */
      if (next >= testimonials.length) {
        return 0;
      }

      return next;
    });
  };

  /* =========================================================
     PREVIOUS
  ========================================================== */

  const previousSlide = () => {
    if (!hasSlider) return;

    setCurrentIndex((prev) => {
      if (prev === 0) {
        return testimonials.length - 1;
      }

      return prev - 1;
    });
  };

  return (
    <section className="w-full bg-white py-6 md:py-6">
      <div className="max-w-[1200px] mx-auto px-0 md:px-0">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-10">
          <h2 className="text-[26px] md:text-[28px] lg:text-[28px] leading-tight font-bold tracking-[-0.8px] text-[#172033]">
            Reviews About Vaibhav Joshi
          </h2>

          <p className="mt-4 max-w-[1080px] text-[15px] md:text-[15px] leading-[1.45] text-[#4B5563]">
            See how other students rate the Vaibhav Joshi teaching at out plateform
          </p>
        </div>

        {/* =====================================================
            SLIDER
        ====================================================== */}

        <div className="relative px-0 sm:px-5">

          {/* LEFT BUTTON */}

          {hasSlider && (
            <button
              type="button"
              onClick={previousSlide}
              aria-label="Previous testimonial"
              className="
                absolute
                z-30
                left-[-20px]
                md:left-[-0px]
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
                text-[#6B7280]
                shadow-sm
                hover:bg-white
                hover:shadow-md
                transition-all
              "
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* RIGHT BUTTON */}

          {hasSlider && (
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next testimonial"
              className="
                absolute
                z-30
                right-[-20px]
                md:right-[-0px]
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
                text-[#6B7280]
                shadow-sm
                hover:bg-white
                hover:shadow-md
                transition-all
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
            className="overflow-hidden px-1 pt-6"
          >
            <motion.div
              animate={{
                x: hasSlider
                  ? -(currentIndex * (cardWidth + gap))
                  : 0,
              }}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex gap-4"
              style={{
                width: "max-content",
              }}
            >

              {sliderItems.map((item, index) => (
                <TestimonialCard
                  key={`${item.name}-${index}`}
                  item={item}
                  cardRef={index === 0 ? cardRef : null}
                />
              ))}

            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   TESTIMONIAL CARD
========================================================= */

function TestimonialCard({ item, cardRef }) {
  return (
    <div
      ref={cardRef}
      className="
        relative
        shrink-0

        w-[calc(100vw-52px)]

        sm:w-[calc((100vw-80px)/2)]

        lg:w-[calc((min(1200px,100vw-64px)-32px)/3)]
      "
    >

      {/* =====================================================
          PROFILE IMAGE
      ====================================================== */}

      <div
        className="
          absolute
          z-20
          left-1/2
          -translate-x-1/2
          -top-7

          w-[64px]
          h-[64px]

          rounded-full
          overflow-hidden

          border-[2px]
          border-white

          shadow-sm

          bg-gray-100
        "
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* =====================================================
          CARD
      ====================================================== */}

      <div
        className="
          min-h-[190px]

          rounded-[11px]

          px-7
          pt-[42px]
          pb-4

          flex
          flex-col
          items-center
          text-center
        "
        style={{
          backgroundColor: item.bg,
        }}
      >

        {/* Name */}

        <h3 className="text-[16px] md:text-[17px] font-bold text-[#172033] leading-tight">
          {item.name}, {item.role}
        </h3>

        {/* Description */}

        <p className="mt-3 text-[13px] md:text-[14px] leading-[1.4] text-[#68717F] max-w-[290px]">
          {item.text}
        </p>

        {/* Stars */}

        <div className="mt-auto pt-3 flex items-center justify-center gap-[2px]">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className="w-[18px] h-[18px]"
              fill={
                index < item.rating
                  ? item.starColor
                  : "rgba(148,163,184,0.30)"
              }
              strokeWidth={0}
            />
          ))}
        </div>

      </div>
    </div>
  );
}