'use client'

import React, { useState } from 'react';
import {
  ChevronRight,
  Home,
  Sparkles,
  Star,
  Info,
  FlagIcon,
  LucideComputer,
  SendHorizontalIcon,
  IndianRupeeIcon
} from 'lucide-react';
import Link from 'next/link';

const THEME = {
  heroBg: '#f1f8f3',
  ring: '#dcefe2',
  ringStroke: '#b7d4bf',
  primary: '#166534',
  badgeBg: '#d9eee0',
  text: '#0f1114',
  muted: '#5b6570',
  border: '#d5e3d8',
};

const FONT =
  "'Source Sans 3','Source Sans Pro',system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif";

function polar(r, deg) {
  const a = (deg * Math.PI) / 180;
  return [r * Math.cos(a), r * Math.sin(a)];
}

function sector(R, r, a1, a2) {
  const [x1, y1] = polar(R, a1);
  const [x2, y2] = polar(R, a2);
  const [x3, y3] = polar(r, a2);
  const [x4, y4] = polar(r, a1);

  const large = Math.abs(a2 - a1) > 180 ? 1 : 0;

  return `
    M${x1} ${y1}
    A${R} ${R} 0 ${large} 1 ${x2} ${y2}
    L${x3} ${y3}
    A${r} ${r} 0 ${large} 0 ${x4} ${y4}
    Z
  `;
}
function calculateExperience(experience) {
  if (!Array.isArray(experience) || experience.length === 0) {
    return "0 years";
  }

  const currentYear = new Date().getFullYear();

  const startYears = experience
    .map((item) => Number(item.from))
    .filter((year) => !isNaN(year));

  if (startYears.length === 0) {
    return "0 years";
  }

  const earliestYear = Math.min(...startYears);

  const totalYears = currentYear - earliestYear;

  return `${totalYears} years`;
}
function Ring() {
  const R = 272;
  const r = 135;

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute hidden lg:block"
      style={{
        left: '73.8%',
        top: 410,
        width: 600,
        height: 600,
        transform: 'translate(-50%,-50%)'
      }}
      viewBox="-300 -300 600 600"
    >
      <path d={sector(R, r, 65, 246.3)} fill={THEME.ring} />
      <path d={sector(R, r, 22, 62)} fill={THEME.ring} />

      <path
        d={sector(R, r, -17, 22)}
        fill="none"
        stroke={THEME.ringStroke}
        strokeWidth="1"
      />

      <path
        d={`M${polar(120, 138)[0]} ${polar(120, 138)[1]}
            L${polar(182, 138)[0]} ${polar(182, 138)[1]}`}
        stroke={THEME.ringStroke}
        strokeWidth="1"
      />
    </svg>
  );
}

function Avatar({ size = 32 }) {
  const [failed, setFailed] = useState(false);

  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white"
      style={{
        width: size,
        height: size,
        border: `1px solid ${THEME.border}`
      }}
    >
      {failed ? (
        <span
          className="text-[12px] font-bold"
          style={{ color: THEME.primary }}
        >
          VJ
        </span>
      ) : (
        <img
          src="/vaibhav-joshi.png"
          alt="Vaibhav Joshi"
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}

function Stat({ children, first }) {
  return (
    <div className="relative flex items-center px-6 py-5 lg:py-0 lg:pl-[66px] lg:pr-6">

      {!first && (
        <span
          aria-hidden="true"
          className="absolute bottom-6 left-0 top-6 hidden w-px lg:block"
          style={{ background: THEME.border }}
        />
      )}

      <div>{children}</div>
    </div>
  );
}

export default function MentorshipHero({trainer}) {
  console.log(trainer)
  return (
    <div
      className="min-h-[95vh] bg-white font-sans"
  
    >

      {/* =========================
          BREADCRUMB
      ========================== */}

      <nav
        aria-label="Breadcrumb"
        className="mt-20 px-5 sm:px-0 border-t border-gray-200  bg-white"
      >
        <div className="mx-auto flex h-12 w-full max-w-[1400px] items-center text-[10px] sm:text-[12px] leading-5">

          <Link
            href="/"
            aria-label="Home"
            className="flex items-center hover:underline"
          >
            <Home
              className="h-4 w-4"
              strokeWidth={1.75}
            />
          </Link>

          <ChevronRight
            className="mx-3 h-4 w-4"
            strokeWidth={2}
          />


          <Link href="one-on-one-mentorship" className="hover:underline">
            1:1 Mentorship
          </Link>

          <ChevronRight
            className="mx-3 h-4 w-4"
            strokeWidth={2}
          />

          <span>
            {trainer.name}
          </span>

        </div>
      </nav>


      {/* =========================
          HERO
      ========================== */}
<section
  className="relative overflow-hidden pb-[20px] pt-[47px] px-5 sm:px-0"
  style={{
    background: THEME.heroBg
  }}
>
  <Ring />

  <div className="mx-auto w-full max-w-[1400px]">

    {/* HERO GRID */}
    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-16">

      {/* =========================
          LEFT CONTENT
      ========================== */}

      <div className="max-w-[900px]">

        {/* Badges */}
        <div className="flex gap-3 mb-4 flex-wrap">

          <div className="mt-[2px] flex items-center gap-2 text-[14px] leading-5">
            <span
              className="ml-[2px] inline-flex items-center gap-1 rounded px-2 py-[3px] text-[14px] font-semibold leading-5"
              style={{
                background: THEME.badgeBg
              }}
            >
              <Sparkles
                className="h-[14px] w-[14px]"
                strokeWidth={2.25}
              />
              Top Mentor
            </span>
          </div>

          <div className="mt-[2px] flex items-center gap-2 text-[14px] leading-5">
            <span className="ml-[2px] inline-flex items-center gap-1 rounded px-2 py-[3px] text-[14px] font-semibold leading-5 bg-violet-100 text-violet-800">
              <Sparkles
                className="h-[14px] w-[14px]"
                strokeWidth={2.25}
              />
              Best Rated
            </span>
          </div>

        </div>


        {/* Heading */}

        <h1 className="max-w-[820px] text-[28px] font-bold leading-[40px] sm:text-[44px] sm:leading-[52px]">
          1 on 1 Mentorship with <br/>{trainer.name}
        </h1>


        {/* Description */}

        <p className="mt-[10px] max-w-[780px] text-[14px] sm:text-[16px] leading-6">
          Get on the fast track to a career in Software Development.

          <br />

          In this mentorship program, you’ll learn in-demand skills, get
          personalised guidance from an industry expert. Learn at your own
          pace, tailored entirely to your goals.
        </p>


        {/* Country / Tutor */}

        <div className="flex gap-6 mt-[12px] border-b max-w-xs border-gray-200">

          <div className="mb-[0px] flex h-[46px] items-center gap-3">

            <span className="flex items-center gap-1 text-gray-800 text-xs">
              <FlagIcon size={14} />
              From -
            </span>

            <span
              className="text-[14px] font-bold tracking-tight"
              style={{
                color: THEME.primary
              }}
            >
              India
            </span>

          </div>


          <div className="mb-[0px] flex h-[46px] items-center gap-3">

            <span className="flex items-center gap-1 text-gray-800 text-xs">
              <LucideComputer size={14} />
              Tutor -
            </span>

            <span
              className="text-[14px] font-bold tracking-tight"
              style={{
                color: THEME.primary
              }}
            >
              Cloud Technology
            </span>

          </div>

        </div>


        {/* CTA */}

        <div className="flex flex-col sm:flex-row mt-[24px] gap-4 sm:gap-6">

          <div className="flex items-center">

            <IndianRupeeIcon
              size={16}
              className="mt-2"
            />

            <span className="text-4xl font-bold text-green-800">
              {trainer.price}/-
            </span>

            <span className="mt-3 ml-1 text-xs">
              Per hour
            </span>

          </div>


          <button
            type="button"
            className="flex h-12 rounded-full w-full sm:w-[256px] flex-col items-center justify-center text-white transition-colors hover:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 "
            style={{
              background: THEME.primary,
              outlineColor: THEME.primary
            }}
          >

            <span className="text-[16px] font-semibold leading-5 flex gap-2 items-center">
              Book A Free Trial
              <SendHorizontalIcon size={16} />
            </span>

          </button>

        </div>


        {/* Mentored */}

        <p className="mt-6 text-[14px] leading-5">

          <strong className="font-bold">
            500+
          </strong>{' '}

          professionals mentored

        </p>


        {/* Referral */}

        <p className="mt-[11px] flex flex-col sm:flex-row items-start sm:items-center text-[14px] leading-5">

          Get 10% off With

          <span
            className="ml-0 sm:ml-1 text-[17px] font-bold tracking-tight"
            style={{
              color: THEME.primary
            }}
          >
            Learn Per Hour

            <span
              className="ml-[6px] rounded-[2px] px-[3px] py-[2px]  -mb-[6px] text-[9px] font-bold leading-[10px] tracking-wide text-white bg-red-500 animate-pulse"
            >
              Refferals
            </span>

            <a
              href="#"
              className="underline underline-offset-2"
            >
              <span className="mx-2">
                •
              </span>
              Learn more
            </a>

          </span>

        </p>

      </div>


      {/* =========================
          RIGHT PNG IMAGE
      ========================== */}

      <div className="relative flex items-center justify-center lg:justify-end">

        {/* Green glow */}

        <div
          className="absolute w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] rounded-full blur-[70px] opacity-60"
          style={{
            background: THEME.ring
          }}
        />

        {/* Decorative circle */}

        <div
          className="absolute w-[320px] h-[320px] sm:w-[430px] sm:h-[430px] "
          style={{
            borderColor: THEME.ringStroke
          }}
        />

        <img
          src={trainer.image}
          alt="Mentorship"
          className="relative z-10 w-[280px] sm:w-[380px] lg:w-[460px] xl:w-[520px] h-auto object-contain drop-shadow-2xl"
        />

      </div>

    </div>

  </div>
</section>
   


      {/* =========================
          STATS CARD
      ========================== */}

      <section className="relative z-20 -mt-[48px] px-5">

        <div className="mx-auto w-full max-w-[1400px]">

          <div
            className="rounded-lg bg-white"
            style={{
              boxShadow:
                '0 4px 20px rgba(15,17,20,0.14)',
              border:
                '1px solid rgba(218,225,237,0.6)'
            }}
          >

            <div
              className="grid grid-cols-1 divide-y sm:grid-cols-2 sm:divide-y-0 lg:h-[112px] lg:grid-cols-[366fr_367fr_311fr_299fr]"
              style={{
                borderColor: THEME.border
              }}
            >

              {/* Stat 1 */}

              <Stat first>

                <h3 className="text-[20px] font-semibold leading-6  underline-offset-2">
                  1:1 Live Sessions
                </h3>

                <p
                  className="mt-1 max-w-[172px] text-[14px] leading-5"
                  style={{
                    color: THEME.muted
                  }}
                >
                  Personalised live guidance tailored to your goals
                </p>

              </Stat>


              {/* Stat 2 */}

              <Stat>

                <h3 className="flex items-center text-[16px] font-semibold leading-6">

                  4.9

                  <Star
                    className="ml-2 h-4 w-4 fill-current text-yellow-400"
                  />

                </h3>

                <p
                  className="mt-1 max-w-[225px] text-[14px] leading-5"
                  style={{
                    color: THEME.muted
                  }}
                >
                  from 500+ reviews of mentoring sessions with {trainer.name}
                </p>

              </Stat>


              {/* Stat 3 */}

              <Stat>

                <h3 className="text-[20px] font-semibold leading-6">
                  {calculateExperience(trainer.experience)}+
                </h3>

                <p
                  className="flex items-center text-[14px] leading-5"
                  style={{
                    color: THEME.muted
                  }}
                >
                  Working and training experiece in corporate


                </p>

              </Stat>


              {/* Stat 4 */}

              <Stat>

                <h3 className="text-[20px] font-semibold leading-6">
                  Flexible schedule
                </h3>

                <p
                  className="mt-1 text-[14px] leading-5"
                  style={{
                    color: THEME.muted
                  }}
                >
                  Book at your convenience
                  <br />
                  Learn at your own pace
                </p>

              </Stat>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}