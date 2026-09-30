"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Clock3,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

/* =========================================================
   REUSABLE PROFILE / COURSE CARD
========================================================= */

const ProfileCard = ({ item, index, type }) => {
  const isCourse = type === "course";

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 18,
        scale: 0.96,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.35,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -5,
      }}
      className="
        group
        bg-white
        rounded-2xl
        overflow-hidden
        border
        border-slate-100
        shadow-sm
        hover:shadow-xl
        transition-shadow
        duration-300
      "
    >
      {/* =================================================
          IMAGE
      ================================================= */}

      <div
        className={`
          relative
          h-[125px]
          overflow-hidden
          ${
            isCourse
              ? "bg-gradient-to-br from-purple-100 via-violet-50 to-fuchsia-200"
              : "bg-gradient-to-br from-green-100 via-green-50 to-emerald-200"
          }
        `}
      >
        {/* Decorative gradient */}

        <div
          className={`
            absolute
            -top-10
            -right-10
            w-32
            h-32
            rounded-full
            blur-2xl
            ${
              isCourse
                ? "bg-purple-300/40"
                : "bg-green-300/40"
            }
          `}
        />

        <div
          className={`
            absolute
            -bottom-10
            -left-10
            w-32
            h-32
            rounded-full
            blur-2xl
            ${
              isCourse
                ? "bg-fuchsia-300/40"
                : "bg-emerald-300/40"
            }
          `}
        />

        {/* IMAGE */}

        {item?.image ? (
          <img
            src={item.image}
            alt={item?.name || "Learn Per Hour"}
            className={`
              relative
              z-10
              w-full
              h-full
              transition-transform
              duration-500
              group-hover:scale-105
              ${
                isCourse
                  ? "object-cover"
                  : "object-contain object-bottom"
              }
            `}
            loading="lazy"
          />
        ) : (
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <Sparkles
              className={`
                w-10
                h-10
                ${
                  isCourse
                    ? "text-purple-500"
                    : "text-green-500"
                }
              `}
            />
          </div>
        )}

        {/* Bottom gradient */}

        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent z-20" />

        {/* Badge */}

        <div className="absolute top-3 left-3 z-30">
          <span
            className={`
              px-2.5
              py-1
              rounded-full
              bg-white/40
              backdrop-blur-sm
              text-[10px]
              font-semibold
              ${
                isCourse
                  ? "text-purple-900"
                  : "text-green-900"
              }
            `}
          >
            {isCourse ? "Course" : "Mentor"}
          </span>
        </div>

        {/* Course Level */}

        {isCourse && item?.level && (
          <div className="absolute top-3 right-3 z-30">
            <span
              className="
                px-2.5
                py-1
                rounded-full
                bg-black/30
                backdrop-blur-sm
                text-[10px]
                font-medium
                text-white
                capitalize
              "
            >
              {item.level}
            </span>
          </div>
        )}
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="p-3.5">

        {/* Name */}

        <h3
          className="
            text-[14px]
            font-semibold
            text-slate-900
            leading-tight
            truncate
          "
          title={item?.name || ""}
        >
          {item?.name || "Untitled"}
        </h3>

        {/* =================================================
            COURSE INFO
        ================================================= */}

        {isCourse ? (
          <div className="flex items-center gap-3 mt-3">

            {/* Hours */}

            <div className="flex items-center gap-1 text-slate-500">
              <Clock3 size={13} />

              <span className="text-[11px] font-medium">
                {item?.hours || 0} Hours
              </span>
            </div>

            {/* Discount */}

            {Number(item?.discount) > 0 && (
              <span className="text-[10px] font-semibold text-green-600">
                {item.discount}% OFF
              </span>
            )}
          </div>
        ) : null}

        {/* =================================================
            PRICE + BUTTON
        ================================================= */}

        <div className="flex items-center justify-between gap-2 mt-3">

          {/* PRICE */}

          {isCourse ? (
            <div className="flex flex-col leading-none">

              <span className="text-sm font-bold text-green-700">
                ₹
                {Number(
                  item?.actualPrice ?? item?.price ?? 0
                ).toLocaleString("en-IN")}
              </span>

              {Number(item?.discount) > 0 &&
                Number(item?.price ?? 0) !==
                  Number(item?.actualPrice ?? item?.price ?? 0) && (
                  <span className="text-[10px] text-slate-400 line-through mt-1">
                    ₹
                    {Number(
                      item?.price ?? 0
                    ).toLocaleString("en-IN")}
                  </span>
                )}
            </div>
          ) : (
            <span className="text-sm font-bold text-green-700 whitespace-nowrap">
              ₹
              {Number(
                item?.price ?? 0
              ).toLocaleString("en-IN")}
              {" / Hour"}
            </span>
          )}

          {/* BUTTON */}

          <Link
            href={
              isCourse
                ? `/courses/${item?.id}`
                : `/one-on-one-mentorship/${item?.id}`
            }
            className={`
              group/button
              flex
              items-center
              justify-center
              gap-1.5
              text-white
              px-3
              py-2
              rounded-full
              text-[11px]
              font-semibold
              transition-all
              duration-200
              shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-2px_4px_rgba(0,0,0,0.35)]
              ${
                isCourse
                  ? "bg-slate-900 hover:bg-green-700"
                  : "bg-slate-900 hover:bg-green-700"
              }
            `}
          >
            Know More

            <ArrowUpRight
              size={13}
              strokeWidth={2.5}
              className="
                transition-transform
                duration-200
                group-hover/button:-translate-y-0.5
                group-hover/button:translate-x-0.5
              "
            />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

/* =========================================================
   API CONFIGURATION
========================================================= */

const TAB_API_CONFIG = {
  trainers: {
    endpoint: "/api/navbar/trainers",
    responseKey: "trainers",
    type: "mentor",
    emptyText: "No mentors available right now.",
  },

  courses: {
    endpoint: "/api/navbar/courses",
    responseKey: "courses",
    type: "course",
    emptyText: "No courses available right now.",
  },

  topic: {
    endpoint: "/api/navbar/topics",
    responseKey: "topics",
    type: "course",
    emptyText: "No topics available right now.",
  },

  topics: {
    endpoint: "/api/navbar/topics",
    responseKey: "topics",
    type: "course",
    emptyText: "No topics available right now.",
  },
};

/* =========================================================
   REUSABLE NAVBAR API COMPONENT
========================================================= */

export function MentorshipTrainers({
  tabId,
  tabName,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError("");
      setItems([]);

      const config = TAB_API_CONFIG[tabId];

      /* =====================================================
         NO CONFIG
      ===================================================== */

      if (!config) {
        console.warn(
          `No API configuration found for tab: ${tabId}`
        );

        setError(
          `No API configuration found for ${tabName || tabId}.`
        );

        setLoading(false);
        return;
      }

      try {
        console.log(
          `Fetching ${tabName || tabId}:`,
          config.endpoint
        );

        const response = await fetch(
          config.endpoint,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `API returned ${response.status}`
          );
        }

        const data = await response.json();

        console.log(
          `${tabName || tabId} API response:`,
          data
        );

        if (cancelled) return;

        /*
         * IMPORTANT:
         *
         * Trainers:
         * data.trainers
         *
         * Courses:
         * data.courses
         *
         * Topics:
         * data.topics
         */

        const result = data?.[config.responseKey];

        /*
         * Always convert invalid/undefined values
         * into an empty array.
         *
         * This prevents:
         *
         * Cannot read properties of undefined
         * (reading 'length')
         */

        if (Array.isArray(result)) {
          setItems(result);
        } else {
          console.warn(
            `Expected ${config.responseKey} to be an array.`,
            {
              received: result,
              response: data,
            }
          );

          setItems([]);
        }
      } catch (error) {
        if (cancelled) return;

        console.error(
          `FETCH ${
            tabName || tabId
          } ERROR:`,
          error
        );

        setError(
          `Failed to load ${
            tabName || "content"
          }.`
        );

        setItems([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    /*
     * Do NOT use [] here.
     *
     * The component must refetch when the
     * active navbar tab changes.
     */

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [tabId, tabName]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return <CardSkeleton />;
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div className="col-span-3 py-10 text-center">
        <p className="text-sm text-slate-500">
          {error}
        </p>
      </div>
    );
  }

  /* =========================================================
     CONFIG
  ========================================================= */

  const config = TAB_API_CONFIG[tabId];

  /* =========================================================
     EMPTY
  ========================================================= */

  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="col-span-3 py-10 text-center">
        <p className="text-sm text-slate-500">
          {config?.emptyText ||
            `No ${
              tabName?.toLowerCase() || "content"
            } available right now.`}
        </p>
      </div>
    );
  }

  /* =========================================================
     CARDS
  ========================================================= */

  return (
    <div className="grid grid-cols-3 gap-4">
      {items.slice(0, 3).map((item, index) => (
        <ProfileCard
          key={
            item?.id ||
            item?._id ||
            `${tabId}-${index}`
          }
          item={{
            ...item,
            id: item?.id || item?._id,
          }}
          index={index}
          type={config?.type || "mentor"}
        />
      ))}
    </div>
  );
}

/* =========================================================
   SHARED SKELETON
========================================================= */

const CardSkeleton = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          className="
            bg-white
            rounded-2xl
            overflow-hidden
            border
            border-slate-100
            shadow-sm
            animate-pulse
          "
        >
          {/* Image */}

          <div className="h-[125px] bg-slate-200" />

          {/* Content */}

          <div className="p-3.5">

            <div className="h-4 bg-slate-200 rounded w-3/4" />

            <div className="h-3 bg-slate-200 rounded w-1/2 mt-3" />

            <div className="flex items-center justify-between mt-3">

              <div className="h-4 bg-slate-200 rounded w-24" />

              <div className="h-8 bg-slate-200 rounded-full w-20" />

            </div>
          </div>
        </div>
      ))}
    </div>
  );
};