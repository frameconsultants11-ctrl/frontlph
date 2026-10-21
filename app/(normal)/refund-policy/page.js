import Link from "next/link";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.learnperhour.com").replace(/\/$/, "");

/* EDIT THESE before publishing */
const LAST_UPDATED = "21 October 2026";
const CONTACT_EMAIL = "support@learnperhour.com";
const ADDRESS = "Learn Per Hour, Jaipur, Rajasthan, India";
const RESCHEDULE_NOTICE = "24 hours";
const REFUND_WINDOW = "5 to 7 business days";

export const metadata = {
  title: "Refund & Cancellation Policy | Learn Per Hour",
  description:
    "How cancellations, rescheduling and refunds work at Learn Per Hour: free sessions, paid hours, trainer changes, refund timelines and how to request a refund.",
  alternates: { canonical: `${SITE_URL}/refund-policy` },
  openGraph: {
    title: "Refund & Cancellation Policy | Learn Per Hour",
    description: "How cancellations, rescheduling and refunds work at Learn Per Hour.",
    url: `${SITE_URL}/refund-policy`,
    type: "website",
  },
};

/* content: { p: "paragraph" } or { ul: ["item", ...] } */
const SECTIONS = [
  {
    id: "overview",
    title: "Overview",
    body: [
      { p: "This policy explains how cancellations, rescheduling and refunds work at Learn Per Hour (“we”, “us”, “our”). It applies to bookings and paid learning made through our website and forms part of our Terms of Service." },
      { p: "Our goal is to be fair and clear. If something is not covered here, contact us and we will do our best to help." },
    ],
  },
  {
    id: "free-sessions",
    title: "Free sessions and clarity calls",
    body: [
      { p: "Free sessions and clarity calls have no charge, so there is nothing to refund. You can cancel or reschedule one at any time by contacting us or telling our team when they call." },
      { p: "If you miss a call without telling us, we may try to reach you again, but we are not required to rebook it." },
    ],
  },
  {
    id: "paid-learning",
    title: "Paid learning",
    body: [
      { p: "After your clarity call, the final price and number of hours are confirmed with you before you pay. Please read the confirmed amount carefully. Once you pay, the hours are reserved for you with an assigned trainer." },
      {
        ul: [
          "Prices are in Indian rupees (₹) and are based on the hours agreed for your booking.",
          "The amount you pay is the confirmed price, which can differ from the price shown on a listing.",
          "Hours are used up as sessions are delivered.",
        ],
      },
    ],
  },
  {
    id: "cancelling",
    title: "How to cancel a booking",
    body: [
      { p: "You can cancel a booking before your paid sessions begin by emailing us from your registered email address or by telling our team on the clarity call. Please include your booking reference, which you can see in your My bookings page." },
      { p: "We will confirm your cancellation by email or message, and the status in My bookings will change to Cancelled." },
    ],
  },
  {
    id: "rescheduling",
    title: "Rescheduling sessions",
    body: [
      {
        ul: [
          `You can reschedule a session for free if you tell us at least ${RESCHEDULE_NOTICE} before it starts.`,
          "If you give less notice, or do not attend, the session may be counted as delivered, unless we agree it was an emergency.",
          "Rescheduling depends on your trainer’s availability. We will offer the closest available slots.",
        ],
      },
    ],
  },
  {
    id: "eligible-refunds",
    title: "When you are eligible for a refund",
    body: [
      {
        ul: [
          "You cancel before any paid session has started: you receive a full refund of the amount paid, minus any payment-provider charges that we cannot recover.",
          "You cancel part-way through: you receive a refund for the unused hours only.",
          "We cancel a session and cannot reschedule it to a time that suits you: you receive a refund for that session.",
          "We cannot provide the service, for example if we cannot assign a suitable trainer: you receive a full refund for the hours not delivered.",
          "You were charged twice or an incorrect amount by mistake: we will refund the extra amount.",
        ],
      },
    ],
  },
  {
    id: "non-refundable",
    title: "What is not refundable",
    body: [
      {
        ul: [
          "Hours already delivered, including sessions you missed without the notice described above.",
          "Fees charged by other organisations, such as certification exam fees, which we do not collect or control.",
          "Payments made outside the platform. We never ask you to pay a trainer directly, so please report anyone who does.",
          "Discounts or referral rewards already applied are not paid back in cash.",
        ],
      },
    ],
  },
  {
    id: "trainer-changes",
    title: "Trainer changes and quality concerns",
    body: [
      { p: "If you are not happy with your trainer, tell us as early as you can. We will first try to fix the problem, for example by changing your trainer or adjusting the plan. If we cannot resolve it, you can ask for a refund for the hours not yet delivered." },
      { p: "If we need to change your trainer, for example due to availability, your booked hours stay the same." },
    ],
  },
  {
    id: "certifications",
    title: "Certification preparation",
    body: [
      { p: "Our certification courses help you prepare for exams run by other organisations. Refunds are based on the hours delivered, not on exam results. We do not refund fees because you did not pass or did not take an exam, and we do not control exam fees or retake rules set by the issuing body." },
    ],
  },
  {
    id: "how-to-request",
    title: "How to request a refund",
    body: [
      { p: `Email ${CONTACT_EMAIL} from your registered email address with:` },
      {
        ul: [
          "your name and booking reference;",
          "the item you booked (course, tool, topic or certification);",
          "the reason for the refund request;",
          "the payment details or receipt, if you have them.",
        ],
      },
      { p: "We review each request and reply with our decision. We may ask for more details to confirm your identity or the payment." },
    ],
  },
  {
    id: "timelines",
    title: "Refund timelines and method",
    body: [
      { p: `Approved refunds are sent to the original payment method. They normally reach you within ${REFUND_WINDOW} after approval. Your bank or payment provider may take extra time to show the amount.` },
      { p: "If a refund is delayed beyond this time, contact us with your booking reference and we will follow up." },
    ],
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: [
      { p: "We may update this policy from time to time. When we make important changes, we will update the date at the top of this page. The version that applies to you is the one in place when you paid for your booking." },
    ],
  },
  {
    id: "contact",
    title: "Contact us",
    body: [
      { p: "For cancellations, refunds or any question about this policy, contact us:" },
      { ul: [`Email: ${CONTACT_EMAIL}`, `Address: ${ADDRESS}`] },
    ],
  },
];

function Block({ block }) {
  if (block.p) return <p className="mt-3 text-[15px] leading-7 text-slate-600">{block.p}</p>;
  if (block.ul) {
    return (
      <ul className="mt-3 space-y-2.5">
        {block.ul.map((item) => (
          <li key={item} className="flex gap-3 text-[15px] leading-7 text-slate-600">
            <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0039bd]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }
  return null;
}

export default function RefundPolicyPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Refund & Cancellation Policy", item: `${SITE_URL}/refund-policy` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }}
      />

      {/* header */}
      <div className="mt-15 bg-gradient-to-b from-[#0039bd] via-[#3162d3] to-white pb-16 pt-8 font-sans">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="text-xs text-blue-100">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-white">Refund &amp; Cancellation Policy</li>
            </ol>
          </nav>
          <p className="mt-8 text-xs font-bold uppercase tracking-wider text-[#ccfc3b]">Legal</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Refund &amp; Cancellation Policy</h1>
          <p className="mt-3 text-sm text-blue-100">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      {/* body */}
      <main className="mx-auto grid max-w-[1400px] gap-10 px-4 pb-20 font-sans sm:px-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-14 lg:px-8">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav
            aria-label="On this page"
            className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#0039bd]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 6h13M8 12h13M8 18h13" />
                  <path d="M3 6h.01M3 12h.01M3 18h.01" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold tracking-tight text-slate-900">On this page</p>
                <p className="mt-0.5 text-[11px] text-slate-400">Quick navigation</p>
              </div>
            </div>

            <div className="mb-3 h-px bg-slate-100" />

            <ol>
              {SECTIONS.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="group relative flex items-start gap-3 rounded-xl px-3 py-2.5 text-[13px] transition-all duration-200 hover:bg-blue-50/70"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-[10px] font-bold tabular-nums text-slate-400 transition-colors group-hover:bg-[#0039bd] group-hover:text-white">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <span className="flex-1 pt-1 leading-5 text-slate-600 transition-colors group-hover:font-semibold group-hover:text-[#0039bd]">
                      {s.title}
                    </span>

                    <svg
                      className="mt-1 shrink-0 text-slate-300 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-[#0039bd] group-hover:opacity-100"
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </li>
              ))}
            </ol>

            <div className="mt-5 rounded-xl bg-slate-50 p-3">
              <p className="text-[11px] leading-relaxed text-slate-500">
                <span className="font-semibold text-slate-700">Tip:</span> Select any section to jump directly to its
                content.
              </p>
            </div>
          </nav>
        </aside>

        {/* sections */}
        <article className="min-w-0">
          {SECTIONS.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-28 border-b border-slate-100 py-8 first:pt-0 last:border-b-0">
              <h2 className="flex items-baseline gap-3 text-xl font-semibold text-[#060B1F]">
                <span className="text-sm font-bold tabular-nums text-[#0039bd]">{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </h2>
              {s.body.map((block, j) => (
                <Block key={j} block={block} />
              ))}
            </section>
          ))}

          <p className="mt-8 rounded-2xl bg-[#f3f6ff] p-5 text-sm text-slate-600">
            See also our{" "}
            <Link href="/terms" className="font-semibold text-[#0039bd] hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="font-semibold text-[#0039bd] hover:underline">
              Privacy Policy
            </Link>
            . Need a refund? Email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-[#0039bd] hover:underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </article>
      </main>
    </>
  );
}