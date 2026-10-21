import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import FaqTabs from "@/component/FaqTabs";
import { FAQ_CATEGORIES } from "@/lib/faqData";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.learnperhour.com").replace(/\/$/, "");
const CONTACT_EMAIL = "support@learnperhour.com";

export const metadata = {
  title: "FAQ | Learn Per Hour",
  description:
    "Answers to common questions about Learn Per Hour: free sessions, pricing, trainers, courses, certifications, bookings and your account.",
  alternates: { canonical: `${SITE_URL}/faq` },
  openGraph: {
    title: "FAQ | Learn Per Hour",
    description: "Answers to common questions about Learn Per Hour.",
    url: `${SITE_URL}/faq`,
    type: "website",
  },
};

export default function FaqPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "FAQ", item: `${SITE_URL}/faq` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_CATEGORIES.flatMap((c) =>
      c.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      }))
    ),
  };

  const json = (o) => ({ __html: JSON.stringify(o).replace(/</g, "\\u003c") });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={json(breadcrumbSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={json(faqSchema)} />

      {/* header */}
      <div className="mt-15 bg-gradient-to-b from-[#0039bd] via-[#3162d3] to-white pb-16 pt-8 font-sans">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="text-xs text-blue-100">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-white">FAQ</li>
            </ol>
          </nav>
          <p className="mt-8 text-xs font-bold uppercase tracking-wider text-[#ccfc3b]">Help center</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Frequently Asked Questions</h1>
          <p className="mt-3 max-w-2xl text-sm text-blue-100 sm:text-base">
            Quick answers about free sessions, pricing, trainers, courses, certifications and your account.
          </p>
        </div>
      </div>

{/* body */}
<main className="mx-auto max-w-[1400px] px-4 pb-20 font-sans sm:px-6 lg:px-8">
  <FaqTabs categories={FAQ_CATEGORIES} />

  <div className="mt-14 flex flex-col items-start justify-between gap-4 rounded-2xl bg-[#f3f6ff] p-6 sm:flex-row sm:items-center lg:ml-[calc(660px+3.5rem)]">
    <div className="flex items-center gap-3">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#ccfc3b] text-[#060B1F]">
        <Sparkles size={19} />
      </span>
      <div>
        <p className="text-sm font-semibold text-[#060B1F]">Still have questions?</p>
        <p className="text-xs text-slate-500">Book a free session or email our team.</p>
      </div>
    </div>
    <div className="flex flex-wrap gap-2">
      <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex h-10 items-center rounded-full border border-slate-300 bg-white px-5 text-sm font-semibold text-[#060B1F] hover:border-[#0039bd]">
        Email us
      </a>
      <Link href="/courses" className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#0039bd] px-5 text-sm font-semibold text-white hover:bg-[#002f9e]">
        Book a free session <ArrowUpRight size={14} strokeWidth={2.5} />
      </Link>
    </div>
  </div>
</main>
    </>
  );
}