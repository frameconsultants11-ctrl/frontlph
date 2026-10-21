import Image from "next/image";
import Link from "next/link";

/* ---------------------------------------------------------
   Content (same links as before). Change the hrefs to your
   real routes.
--------------------------------------------------------- */
const COLUMNS = [
  {
    title: "Platform",
    links: [
      { label: "Learnings", href: "/courses" },
      { label: "Certification Prep.", href: "/certifications" },
      { label: "Interview Prep.", href: "/interview-prep" },
      { label: "Career Counseling", href: "/career-counseling" },
      { label: "Projects", href: "/projects" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Our Mentors", href: "/mentors" },
      { label: "Success Stories", href: "/success-stories" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Free Resources", href: "/free-resources" },
      { label: "FAQs", href: "/faqs" },
      { label: "Support", href: "/support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Refund Policy", href: "/refund-policy" },
      { label: "Cookie Policy", href: "/cookie-policy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-0 w-full overflow-hidden bg-[#0039bd] font-sans text-white">
      {/* soft light from the top-left, keeps the blue from feeling flat */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-[#0039bd] opacity-60 blur-[120px]"
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-10">
        {/* ================= TOP ================= */}
        <div className="grid grid-cols-1 gap-12 pb-14 pt-16 md:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1fr_1fr] lg:gap-10 lg:pb-16 lg:pt-20">
          {/* Brand */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link href="/" aria-label="LearnPerHour home" className="inline-flex items-center gap-2.5">
                <Image src='/1.png' alt='logo' height={50} width={180} className="-ml-3" />
            </Link>

            <p className="mt-5 max-w-xs text-base leading-relaxed text-blue-100/80">
              Developed for those who believe in building the future.
            </p>

            <Link
              href="/courses"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#ccfc3b] px-5 py-2.5 text-sm font-semibold text-[#00206b] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Browse courses
            </Link>
          </div>

          {/* Link columns */}
          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="text-sm font-semibold text-[#ccfc3b]">{column.title}</h3>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[15px] text-blue-100/80 transition-colors hover:text-white focus-visible:text-white focus-visible:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* ================= COPYRIGHT ================= */}
        <div className="flex flex-col gap-3 border-t border-white/15 py-7 text-sm text-blue-100/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 LearnPerHour. All rights reserved.  Developed and Maintained By <Link href="https://giptechnologies.com/" title="gip technologies" className="text-white">GIP Technologies</Link></p>
          <p className="flex flex-wrap gap-x-1.5">
            <Link href="/terms" className="underline underline-offset-2 transition-colors hover:text-white">
              Terms of Service
            </Link>
            <span>and</span>
            <Link href="/privacy-policy" className="underline underline-offset-2 transition-colors hover:text-white">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      {/* ================= WATERMARK ================= */}
      <div aria-hidden="true" className="relative h-[16vw] min-h-[90px] select-none overflow-hidden">
        <span
          className="absolute inset-x-0 -bottom-[2.2vw] block whitespace-nowrap text-center text-[15vw] font-bold leading-none tracking-tighter text-transparent"
          style={{ WebkitTextStroke: "1.5px rgba(204, 252, 59, 0.35)" }}
        >
          LearnPerHour
        </span>
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#00206b] to-transparent" />
      </div>
    </footer>
  );
}