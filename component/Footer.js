"use client";

const NAV_LINKS = [
  "Learnings",
  "Certification Prep.",
  "Interview Prep.",
  "Career Counseling",
  "Projects",
];

const COMPANY_LINKS = [
  "About Us",
  "Careers",
  "Our Mentors",
  "Success Stories",
  "Contact Us",
];

const RESOURCE_LINKS = [
  "Blog",
  "Free Resources",
  "Roadmap",
  "FAQs",
  "Support",
];

const LEGAL_LINKS = [
  "Privacy Policy",
  "Terms of Use",
  "Refund Policy",
  "Cookie Policy",
  "Security",
];

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-[#fffefa] text-[#242235] font-sans mt-12">

      {/* =====================================================
          MAIN FOOTER
      ====================================================== */}

      <div className="relative z-10 mx-auto max-w-[1510px] px-6 sm:px-10 lg:px-0">

        {/* TOP CONTENT */}
        <div
          className="
            grid
            grid-cols-1
            gap-12
            pt-[70px]
            pb-[90px]

            md:grid-cols-2

            lg:grid-cols-[1.8fr_1fr_1fr_1fr_1fr]
            lg:gap-16
            lg:pt-[105px]
            lg:pb-[95px]
          "
        >

          {/* =================================================
              BRAND
          ================================================== */}

          <div>
            {/* Logo */}
            <div className="mb-5 flex items-center">
              <div
                className="
                  mr-2
                  flex
                  h-[31px]
                  w-[31px]
                  items-center
                  justify-center
                  rounded-full
                  border-[2px]
                  border-[#29263b]
                  text-[18px]
                  font-bold
                "
              >
                L
              </div>

              <span
                className="
                  text-[30px]
                  font-medium
                  leading-none
                  tracking-[-1.7px]
                "
              >
                LearnPerHour
              </span>
            </div>

            {/* Description */}
            <p
              className="
                max-w-[290px]
                text-[18px]
                leading-[1.55]
                tracking-[-0.3px]
                text-[#6d687b]
              "
            >
              Developed for those who
              <br />
              believe in building the future.
            </p>

            {/* Optional app / CTA */}
            <button
              type="button"
              className="
                mt-7
                rounded-full
                border
                border-[#e6e2e7]
                bg-white
                px-5
                py-2.5
                text-[14px]
                font-medium
                text-[#302c40]
                shadow-[0_1px_2px_rgba(0,0,0,0.03)]
                transition-all
                hover:border-[#d7d2db]
                hover:bg-[#fafafa]
              "
            >
              LearnPerHour
            </button>
          </div>

          {/* =================================================
              PLATFORM
          ================================================== */}

          <FooterColumn
            title="Platform"
            links={NAV_LINKS}
          />

          {/* =================================================
              COMPANY
          ================================================== */}

          <FooterColumn
            title="Company"
            links={COMPANY_LINKS}
          />

          {/* =================================================
              RESOURCES
          ================================================== */}

          <FooterColumn
            title="Resources"
            links={RESOURCE_LINKS}
          />

          {/* =================================================
              LEGAL
          ================================================== */}

          <FooterColumn
            title="Legal"
            links={LEGAL_LINKS}
          />

        </div>


        {/* =====================================================
            DIVIDER
        ====================================================== */}

        <div className="h-px w-full bg-[#e5e1dc]" />


        {/* =====================================================
            COPYRIGHT
        ====================================================== */}

        <div
          className="
            flex
            flex-col
            gap-4
            py-8

            text-[15px]
            text-[#6d687b]

            sm:flex-row
            sm:items-center
            sm:justify-between

            lg:py-[42px]
          "
        >
          <p>
            © 2026 LearnPerHour. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-x-2">
            <a
              href="#"
              className="underline underline-offset-2 transition-colors hover:text-[#242235]"
            >
              Terms of Service
            </a>

            <span>and</span>

            <a
              href="#"
              className="underline underline-offset-2 transition-colors hover:text-[#242235]"
            >
              Privacy Policy
            </a>
          </div>
        </div>

      </div>


      {/* =====================================================
          BOTTOM GRADIENT
      ====================================================== */}

      <div
        className="
          relative
          h-[350px]
          overflow-hidden

          bg-[linear-gradient(
            to_bottom,
            #fffefa_0%,
            #fff7f8_13%,
            #fce6f8_32%,
            #efd5fa_53%,
            #c8a8fa_75%,
            #a887ed_100%
          )]
        "
      >

        {/* Soft pink glow */}
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-0
            h-[300px]
            w-[900px]
            -translate-x-1/2
            rounded-full
            bg-green-200/40
            blur-[100px]
          "
        />

        {/* Large watermark */}
        <div
          className="
            absolute
            bottom-[-45px]
            left-1/2
            -translate-x-1/2
            whitespace-nowrap

            text-[190px]
            font-medium
            leading-none
            tracking-[-10px]

            text-green-800/30

            sm:text-[260px]
            lg:text-[290px]
          "
        >
          LearnPerHour
        </div>

      </div>

    </footer>
  );
}


/* =========================================================
   FOOTER COLUMN
========================================================= */

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3
        className="
          mb-5
          text-[17px]
          font-semibold
          leading-none
          tracking-[-0.3px]
          text-[#29263b]
        "
      >
        {title}
      </h3>

      <ul className="space-y-[13px]">
        {links.map((link) => (
          <li key={link}>
            <a
              href="#"
              className="
                text-[15px]
                leading-[1.35]
                tracking-[-0.2px]
                text-[#323133]
                transition-colors
                hover:text-[#29263b]
              "
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}