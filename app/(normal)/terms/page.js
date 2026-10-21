import Link from "next/link";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.learnperhour.com").replace(/\/$/, "");

/* EDIT THESE before publishing */
const LAST_UPDATED = "21 October 2026";
const CONTACT_EMAIL = "support@learnperhour.com";
const ADDRESS = "Learn Per Hour, Jaipur, Rajasthan, India";
const JURISDICTION = "Jaipur, Rajasthan";

export const metadata = {
  title: "Terms of Service | Learn Per Hour",
  description:
    "The terms that apply when you use Learn Per Hour: accounts, bookings, free sessions, trainers, pricing, payments, acceptable use and more.",
  alternates: { canonical: `${SITE_URL}/terms` },
  openGraph: {
    title: "Terms of Service | Learn Per Hour",
    description: "The terms that apply when you use Learn Per Hour.",
    url: `${SITE_URL}/terms`,
    type: "website",
  },
};

/* content: { p: "paragraph" } or { ul: ["item", ...] } */
const SECTIONS = [
  {
    id: "acceptance",
    title: "Acceptance of these terms",
    body: [
      { p: "These Terms of Service (“Terms”) are a binding agreement between you and Learn Per Hour (“we”, “us”, “our”). They apply when you visit our website, create an account, book a session or use any of our services." },
      { p: "By using Learn Per Hour you confirm that you have read and accepted these Terms and our Privacy Policy. If you do not agree, please do not use the platform." },
    ],
  },
  {
    id: "our-services",
    title: "Our services",
    body: [
      { p: "Learn Per Hour is an online learning platform. You can explore courses, tools, topics and certification preparation, book free sessions and learn with trainers. We may add, change or remove features at any time." },
      { p: "Course, tool, topic and certification pages describe what is taught. They are for information and do not guarantee any particular result, job or income." },
    ],
  },
  {
    id: "eligibility-and-accounts",
    title: "Eligibility and accounts",
    body: [
      {
        ul: [
          "You must be 18 or older, or use the platform with the consent of a parent or legal guardian.",
          "You can sign up with email and password or with Google. You must give accurate information and keep it up to date.",
          "You are responsible for keeping your password private and for everything that happens under your account. Tell us at once if you think your account has been used without your permission.",
          "One person, one account. You may not sell, share or transfer your account.",
        ],
      },
    ],
  },
  {
    id: "bookings",
    title: "Bookings, free sessions and clarity calls",
    body: [
      { p: "You can request a free session for a course, tool, topic or certification. A request is not a confirmed class. Our team will contact you on the mobile number you provide to schedule a clarity call to understand your goals." },
      {
        ul: [
          "The date, time and meeting link of your clarity call are shared with you in your My bookings page and may also be sent by phone, email or message.",
          "After the call we may assign a trainer who matches your goals. We can change a trainer when needed, for example due to availability.",
          "We may reschedule, decline or cancel a booking, and you can ask us to cancel yours. Please give notice if you cannot attend a call.",
          "A free session has no charge. Any paid learning is agreed with you separately before it starts.",
        ],
      },
    ],
  },
  {
    id: "pricing-and-payments",
    title: "Pricing and payments",
    body: [
      {
        ul: [
          "Prices are shown in Indian rupees (₹) and are usually based on hours of learning. The price on a listing is the listed price before any discount.",
          "After your clarity call, we confirm the final price and the number of hours for your booking. That confirmed amount is what applies to you, and it can differ from the listing.",
          "Discounts, offers and referral rewards are limited, can be changed or withdrawn, and cannot be combined unless we say so.",
          "Taxes may apply and, where they do, are shown or added at payment.",
          "You must pay through the methods we provide. We do not ask you to pay anyone outside the platform, so do not share payment details with trainers directly unless we have told you to.",
        ],
      },
    ],
  },
  {
    id: "refunds",
    title: "Cancellations and refunds",
    body: [
      { p: "You may cancel a booking before your paid sessions begin by contacting us. If you have paid for hours you have not used, we will refund the unused portion as set out in the refund terms we give you at the time of purchase, subject to payment-provider charges where they apply." },
      { p: "Hours already delivered are not refundable. If we cancel a session or cannot provide the service, we will reschedule it or refund the amount for the missed session." },
    ],
  },
  {
    id: "certifications",
    title: "Certification preparation",
    body: [
      { p: "Our certification courses help you prepare for exams run by other organisations. Certification is awarded only by the issuing body after you pass its official exam. Completing a course with us does not grant any certification, and we do not guarantee that you will pass." },
      { p: "Names of certifications and organisations belong to their owners. We are not affiliated with them unless we say so." },
    ],
  },
  {
    id: "trainers",
    title: "Trainers",
    body: [
      { p: "Trainers on Learn Per Hour are screened by us, but they deliver sessions using their own knowledge and judgement. We do not guarantee any specific outcome from a session." },
      {
        ul: [
          "Treat trainers with respect, join sessions on time and do not record a session without the trainer’s permission.",
          "Trainers must not ask you for payment outside the platform. Report anyone who does.",
          "We may remove a trainer or end a booking if conduct or quality standards are not met.",
        ],
      },
    ],
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: [
      { p: "You agree not to:" },
      {
        ul: [
          "break the law or violate anyone’s rights;",
          "give false information or pretend to be someone else;",
          "harass, abuse or threaten learners, trainers or our team;",
          "try to access accounts, data or systems that are not yours, or probe or disrupt our security;",
          "use bots, scrapers or other automated tools to copy or overload the platform;",
          "upload malware or harmful content;",
          "misuse referral codes, for example by creating fake accounts to earn rewards.",
        ],
      },
    ],
  },
  {
    id: "referrals",
    title: "Referrals and offers",
    body: [
      { p: "Your account may include a referral code. Referral benefits, if any, are described when the offer is made. We may check referrals for abuse and cancel rewards or accounts involved in it." },
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    body: [
      { p: "The platform, including its text, design, logos, course material and software, belongs to Learn Per Hour or its licensors and is protected by law. We give you a personal, limited, non-transferable right to use it for your own learning." },
      { p: "You may not copy, sell, share, record for distribution or republish our materials without our written permission. Learning material shared by trainers is for your personal study." },
    ],
  },
  {
    id: "your-content",
    title: "Your content",
    body: [
      { p: "You keep ownership of information you give us, such as profile details and messages. You allow us to use it to run and improve the platform and to provide your services, as described in the Privacy Policy." },
    ],
  },
  {
    id: "third-party-services",
    title: "Third-party services",
    body: [
      { p: "The platform may use or link to services run by others, such as Google sign-in and meeting tools like Google Meet or Zoom. Their own terms and privacy policies apply, and we are not responsible for them." },
    ],
  },
  {
    id: "suspension",
    title: "Suspension and termination",
    body: [
      { p: "You can stop using Learn Per Hour at any time and ask us to delete your account. We may suspend or end your access, with or without notice, if you break these Terms, create risk or harm for others, or if required by law. Sections that should continue after termination, such as payments owed, intellectual property and liability, will continue." },
    ],
  },
  {
    id: "disclaimer",
    title: "Disclaimers",
    body: [
      { p: "The platform and services are provided “as is” and “as available”. To the fullest extent the law allows, we do not promise that the platform will be uninterrupted, error-free or secure, or that it will meet every need or lead to a particular result." },
    ],
  },
  {
    id: "liability",
    title: "Limit of liability",
    body: [
      { p: "To the fullest extent the law allows, Learn Per Hour will not be liable for indirect, incidental or consequential losses, or loss of profit, data or opportunity, arising from your use of the platform. Our total liability for any claim relating to the services is limited to the amount you paid us for the service in question in the three months before the claim." },
      { p: "Nothing in these Terms limits liability that cannot be limited by law." },
    ],
  },
  {
    id: "changes",
    title: "Changes to these Terms",
    body: [
      { p: "We may update these Terms from time to time. When we make important changes, we will update the date at the top of this page and, where appropriate, tell you by email or on the platform. If you keep using Learn Per Hour after a change, you accept the new Terms." },
    ],
  },
  {
    id: "governing-law",
    title: "Governing law and disputes",
    body: [
      { p: `These Terms are governed by the laws of India. Please contact us first so we can try to resolve any issue informally. If we cannot, the courts at ${JURISDICTION} will have exclusive jurisdiction, subject to any rights you have under consumer protection law.` },
    ],
  },
  {
    id: "contact",
    title: "Contact us",
    body: [
      { p: "If you have questions about these Terms, contact us:" },
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

export default function TermsOfServicePage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Terms of Service", item: `${SITE_URL}/terms` },
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
              <li aria-current="page" className="font-medium text-white">Terms of Service</li>
            </ol>
          </nav>
          <p className="mt-8 text-xs font-bold uppercase tracking-wider text-[#ccfc3b]">Legal</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Terms of Service</h1>
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
        <p className="text-sm font-bold tracking-tight text-slate-900">
          On this page
        </p>
        <p className="mt-0.5 text-[11px] text-slate-400">
          Quick navigation
        </p>
      </div>
    </div>

    <div className="mb-3 h-px bg-slate-100" />

    <ol className="">
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
        <span className="font-semibold text-slate-700">Tip:</span> Select any
        section to jump directly to its content.
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
            <Link href="/privacy-policy" className="font-semibold text-[#0039bd] hover:underline">
              Privacy Policy
            </Link>
            . Questions? Email{" "}
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