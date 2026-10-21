import Link from "next/link";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.learnperhour.com").replace(/\/$/, "");

/* EDIT THESE before publishing */
const LAST_UPDATED = "21 October 2026";
const CONTACT_EMAIL = "privacy@learnperhour.com";
const ADDRESS = "Learn Per Hour, Jaipur, Rajasthan, India";

export const metadata = {
  title: "Privacy Policy | Learn Per Hour",
  description:
    "How Learn Per Hour collects, uses, shares and protects your personal information, and the choices and rights you have.",
  alternates: { canonical: `${SITE_URL}/privacy-policy` },
  openGraph: {
    title: "Privacy Policy | Learn Per Hour",
    description: "How Learn Per Hour collects, uses, shares and protects your personal information.",
    url: `${SITE_URL}/privacy-policy`,
    type: "website",
  },
};

/* content: { p: "paragraph" } or { ul: ["item", ...] } */
const SECTIONS = [
  {
    id: "overview",
    title: "Overview",
    body: [
      { p: "Learn Per Hour (“we”, “us”, “our”) runs an online learning platform where you can explore courses, tools, topics and certification preparation, book free sessions and learn with trainers. This policy explains what personal information we collect, why we collect it, who we share it with and the choices you have." },
      { p: "By creating an account or using Learn Per Hour, you agree to the practices described here. If you do not agree, please do not use the platform." },
    ],
  },
  {
    id: "information-we-collect",
    title: "Information we collect",
    body: [
      { p: "We collect the following types of information:" },
      {
        ul: [
          "Account information: your name, email address and profile photo, and your password (stored only as a one-way hash) if you sign up with email. If you sign in with Google, we receive your name, email and profile photo from Google.",
          "Profile information you choose to add: mobile number, education, work experience, and the tools, skills, categories and subcategories you are interested in.",
          "Booking information: the course, tool, topic or certification you book, the mobile number you give for the booking, the status of the booking, clarity call date, time and meeting link, the trainer assigned, and the price and hours agreed.",
          "Referral information: a referral code linked to your account.",
          "Sign-in and device information: login times, the number of active sessions, IP address, browser and device type, used for security and to keep you signed in.",
          "Usage information: pages you view and features you use, so we can improve the platform.",
          "Messages: anything you send us when you contact our team.",
        ],
      },
    ],
  },
  {
    id: "how-we-use",
    title: "How we use your information",
    body: [
      {
        ul: [
          "To create and manage your account and keep it secure.",
          "To process your bookings, schedule clarity calls and assign a trainer.",
          "To contact you about your bookings, by phone, email or message, including reminders and meeting links.",
          "To personalise recommendations based on your interests.",
          "To process payments and issue receipts where a paid service is used.",
          "To prevent fraud, abuse and unauthorised access, and to enforce our terms.",
          "To improve our content, features and performance.",
          "To meet legal obligations.",
        ],
      },
      { p: "We do not sell your personal information." },
    ],
  },
  {
    id: "consent-and-legal-basis",
    title: "Consent and legal basis",
    body: [
      { p: "We process your personal data with your consent, which you give when you sign up, submit a booking or fill in your profile, and where it is needed to provide the services you ask for or to comply with the law. You can withdraw consent at any time (see “Your rights”), though some services may then no longer be available to you." },
      { p: "We handle personal data in line with applicable Indian law, including the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023." },
    ],
  },
  {
    id: "sharing",
    title: "Who we share information with",
    body: [
      { p: "We share information only as needed to run the platform:" },
      {
        ul: [
          "Trainers: a trainer assigned to your booking can see the details needed to teach you, such as your name and learning goals. We do not give trainers your password or other account data.",
          "Service providers that help us operate, such as hosting, database, file storage, email, meeting tools (for example Google Meet or Zoom), analytics and payment processors. They may process data only on our instructions.",
          "Google, when you choose to sign in with Google.",
          "Authorities or other parties when required by law, court order or to protect rights, safety and security.",
          "A successor, if Learn Per Hour is merged, acquired or sold, subject to this policy.",
        ],
      },
    ],
  },
  {
    id: "cookies",
    title: "Cookies and sessions",
    body: [
      { p: "We use cookies and similar technologies that are needed for the platform to work: to keep you signed in, to protect forms and requests from forgery (security tokens), and to remember basic preferences. We may also use analytics tools to understand how the site is used." },
      { p: "You can block or delete cookies in your browser settings, but sign-in and booking may stop working without them." },
    ],
  },
  {
    id: "retention",
    title: "How long we keep your information",
    body: [
      { p: "We keep your information while your account is active and for as long as needed to provide our services, resolve disputes, keep records and meet legal requirements. When you ask us to delete your account, we delete or anonymise your personal data, except what we must keep by law (for example payment and tax records)." },
    ],
  },
  {
    id: "security",
    title: "How we protect your information",
    body: [
      { p: "We use reasonable technical and organisational safeguards, including hashed passwords, encrypted connections (HTTPS), request-forgery protection, access controls and audit logs for administrative actions. No system is completely secure, so we cannot guarantee absolute security. Please use a strong password and keep it private." },
    ],
  },
  {
    id: "your-rights",
    title: "Your rights and choices",
    body: [
      { p: "Subject to applicable law, you can:" },
      {
        ul: [
          "Access and update most of your information from your profile page.",
          "Ask us for a copy of the personal data we hold about you.",
          "Ask us to correct inaccurate data or delete your data.",
          "Withdraw your consent to processing.",
          "Nominate another person to exercise your rights if you are unable to.",
          "Raise a complaint with us, and if you are not satisfied, with the Data Protection Board of India once it is operational.",
        ],
      },
      { p: `To use any of these rights, email us at ${CONTACT_EMAIL}. We may need to verify your identity first.` },
    ],
  },
  {
    id: "children",
    title: "Children’s privacy",
    body: [
      { p: "Learn Per Hour is intended for users aged 18 and over. If you are under 18, you may use the platform only with the verifiable consent of a parent or legal guardian. We do not knowingly collect data from children without that consent. If you believe a child has given us data without it, contact us and we will delete it." },
    ],
  },
  {
    id: "transfers",
    title: "Storage and transfers",
    body: [
      { p: "Your information may be stored and processed on servers located outside your state or outside India, operated by our service providers. Where this happens, we take steps to ensure your data is handled with appropriate protection." },
    ],
  },
  {
    id: "third-party-links",
    title: "Third-party links",
    body: [
      { p: "Our platform may link to other websites and services, such as meeting providers. We are not responsible for their privacy practices, so please read their policies." },
    ],
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: [
      { p: "We may update this policy from time to time. When we make important changes, we will update the date at the top of this page and, where appropriate, notify you by email or on the platform. Continued use after a change means you accept the updated policy." },
    ],
  },
  {
    id: "contact",
    title: "Contact us and grievance officer",
    body: [
      { p: "If you have questions, requests or complaints about this policy or how we handle your data, contact us:" },
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

export default function PrivacyPolicyPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Privacy Policy", item: `${SITE_URL}/privacy-policy` },
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
              <li aria-current="page" className="font-medium text-white">Privacy Policy</li>
            </ol>
          </nav>
          <p className="mt-8 text-xs font-bold uppercase tracking-wider text-[#ccfc3b]">Legal</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Privacy Policy</h1>
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

    <ol className="space-y-0">
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
            Questions about your privacy? Email{" "}
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