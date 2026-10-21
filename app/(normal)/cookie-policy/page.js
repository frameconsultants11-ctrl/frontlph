import Link from "next/link";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.learnperhour.com").replace(/\/$/, "");

/* EDIT THESE before publishing */
const LAST_UPDATED = "21 October 2026";
const CONTACT_EMAIL = "privacy@learnperhour.com";
const ADDRESS = "Learn Per Hour, Jaipur, Rajasthan, India";

export const metadata = {
  title: "Cookie Policy | Learn Per Hour",
  description:
    "How Learn Per Hour uses cookies and similar technologies, including Google Analytics, Google Tag Manager and Meta Pixel, and how you can control them.",
  alternates: { canonical: `${SITE_URL}/cookie-policy` },
  openGraph: {
    title: "Cookie Policy | Learn Per Hour",
    description: "How Learn Per Hour uses cookies and how you can control them.",
    url: `${SITE_URL}/cookie-policy`,
    type: "website",
  },
};

/* CHECK these names and durations in your browser (DevTools > Application > Cookies) */
const COOKIES = [
  { group: "Strictly necessary", name: "authjs.session-token", by: "Learn Per Hour (Auth.js)", purpose: "Keeps you signed in to your account.", life: "Session or as set at sign-in" },
  { group: "Strictly necessary", name: "authjs.csrf-token", by: "Learn Per Hour (Auth.js)", purpose: "Protects sign-in forms from forgery.", life: "Session" },
  { group: "Strictly necessary", name: "authjs.callback-url", by: "Learn Per Hour (Auth.js)", purpose: "Remembers the page to return to after sign-in.", life: "Session" },
  { group: "Strictly necessary", name: "csrfToken", by: "Learn Per Hour", purpose: "Protects bookings, profile updates and other requests from forgery.", life: "Session or short-lived" },
  { group: "Strictly necessary", name: "Access and refresh tokens", by: "Learn Per Hour", purpose: "Keep your session secure and renew it without asking you to sign in again.", life: "Short-lived / as configured" },
  { group: "Analytics", name: "_ga", by: "Google Analytics", purpose: "Tells visitors apart so we can count users and sessions.", life: "Up to 2 years" },
  { group: "Analytics", name: "_ga_<ID>", by: "Google Analytics", purpose: "Keeps session state for our Analytics property.", life: "Up to 2 years" },
  { group: "Advertising", name: "_fbp", by: "Meta (Facebook) Pixel", purpose: "Identifies a browser to measure ads and show relevant ads.", life: "About 3 months" },
  { group: "Advertising", name: "_fbc", by: "Meta (Facebook) Pixel", purpose: "Stores the ad click that brought you to our site, to measure ad results.", life: "About 3 months" },
];

/* content: { p } | { ul: [] } | { cookies: true } */
const SECTIONS = [
  {
    id: "overview",
    title: "Overview",
    body: [
      { p: "This Cookie Policy explains how Learn Per Hour (“we”, “us”, “our”) uses cookies and similar technologies on our website. It should be read with our Privacy Policy, which explains how we handle personal data." },
      { p: "By continuing to use the strictly necessary parts of the site you accept the essential cookies. For analytics and advertising cookies, we ask for your choice (see “Your choices”)." },
    ],
  },
  {
    id: "what-are-cookies",
    title: "What are cookies?",
    body: [
      { p: "Cookies are small text files that a website saves on your browser or device. They help a site remember you, keep it secure and understand how it is used. Similar technologies include pixels (small images or scripts that report activity) and local storage." },
      {
        ul: [
          "First-party cookies are set by us. Third-party cookies are set by other companies whose tools we use, such as Google or Meta.",
          "Session cookies disappear when you close your browser. Persistent cookies stay for a set time.",
        ],
      },
    ],
  },
  {
    id: "how-we-use",
    title: "How we use cookies",
    body: [
      { p: "We use cookies for three purposes:" },
      {
        ul: [
          "Strictly necessary: to sign you in, keep your account and bookings secure, and protect requests from forgery. The site cannot work properly without these.",
          "Analytics: to understand which pages people visit and how they use features, so we can improve the platform.",
          "Advertising and measurement: to measure how our ads perform and show our ads to people who may be interested in learning with us.",
        ],
      },
    ],
  },
  {
    id: "cookies-we-use",
    title: "Cookies we use",
    body: [
      { p: "The table below lists the main cookies. Names and lifetimes can change when providers update their tools." },
      { cookies: true },
    ],
  },
  {
    id: "google-analytics",
    title: "Google Analytics",
    body: [
      { p: "We use Google Analytics, a service of Google, to measure traffic and usage, such as pages viewed, time on site, device type and approximate location. It uses cookies to recognise a browser across visits. Google processes this data for us, and we use it only in the form of reports." },
      { p: "You can opt out across all sites by using Google’s browser add-on or by changing your cookie choice with us." },
    ],
  },
  {
    id: "google-tag-manager",
    title: "Google Tag Manager",
    body: [
      { p: "We use Google Tag Manager to manage the tracking tools on our site from one place. Tag Manager itself does not set cookies or collect personal data, but the tags it loads, such as Analytics or the Meta Pixel, may do so. When you decline analytics or advertising cookies, those tags are not meant to run." },
    ],
  },
  {
    id: "meta-pixel",
    title: "Meta (Facebook) Pixel",
    body: [
      { p: "We use the Meta Pixel to measure the results of our ads on Facebook and Instagram, build audiences of people who visited our site and show them relevant ads. The Pixel sends information such as pages viewed and actions taken (for example, viewing a course or booking a free session) to Meta, together with browser identifiers." },
      { p: "Meta may combine this with information it already has about you under its own privacy policy. You can manage ad preferences in your Facebook and Instagram settings." },
    ],
  },
  {
    id: "choices",
    title: "Your choices",
    body: [
      {
        ul: [
          "Cookie banner: when you first visit, you can accept or decline analytics and advertising cookies. Strictly necessary cookies cannot be switched off.",
          "Change your mind: you can update your choice at any time using the cookie settings link in our footer, or by clearing the site’s cookies in your browser.",
          "Browser settings: most browsers let you block or delete cookies. If you block strictly necessary cookies, sign-in and booking may stop working.",
          "Ads: you can limit ad personalisation in your Google Ads settings and in your Facebook and Instagram ad preferences, or use industry tools such as youradchoices.com.",
        ],
      },
    ],
  },
  {
    id: "legal-basis",
    title: "Consent and legal basis",
    body: [
      { p: "We use strictly necessary cookies because they are needed to provide the service you ask for. We use analytics and advertising cookies only with your consent, which you can withdraw at any time. We handle personal data in line with applicable Indian law, including the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023." },
    ],
  },
  {
    id: "retention",
    title: "How long cookies last",
    body: [
      { p: "Session cookies last until you close your browser or sign out. Other cookies last for the time shown in the table, or until you delete them. Data collected by Google and Meta is kept under their own retention settings and policies." },
    ],
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: [
      { p: "We may update this policy when we add or change tools, or when the law changes. When we make important changes, we will update the date at the top of this page and, where needed, ask for your consent again." },
    ],
  },
  {
    id: "contact",
    title: "Contact us",
    body: [
      { p: "If you have questions about cookies or want to exercise your privacy rights, contact us:" },
      { ul: [`Email: ${CONTACT_EMAIL}`, `Address: ${ADDRESS}`] },
    ],
  },
];

const GROUP_CLS = {
  "Strictly necessary": "bg-emerald-50 text-emerald-700",
  Analytics: "bg-blue-50 text-blue-700",
  Advertising: "bg-amber-50 text-amber-700",
};

function CookieTable() {
  return (
    <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
      <table className="w-full min-w-[720px] text-left text-[13px]">
        <thead className="border-b border-slate-100 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
          <tr>
            {["Cookie", "Type", "Set by", "Purpose", "Duration"].map((h) => (
              <th key={h} className="px-4 py-3 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {COOKIES.map((c) => (
            <tr key={c.name} className="align-top">
              <td className="px-4 py-3 font-mono text-[12px] font-semibold text-[#060B1F]">{c.name}</td>
              <td className="px-4 py-3">
                <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold ${GROUP_CLS[c.group]}`}>
                  {c.group}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-600">{c.by}</td>
              <td className="px-4 py-3 text-slate-600">{c.purpose}</td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-600">{c.life}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Block({ block }) {
  if (block.cookies) return <CookieTable />;
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

export default function CookiePolicyPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Cookie Policy", item: `${SITE_URL}/cookie-policy` },
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
              <li aria-current="page" className="font-medium text-white">Cookie Policy</li>
            </ol>
          </nav>
          <p className="mt-8 text-xs font-bold uppercase tracking-wider text-[#ccfc3b]">Legal</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Cookie Policy</h1>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
                    <svg className="mt-1 shrink-0 text-slate-300 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-[#0039bd] group-hover:opacity-100" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </li>
              ))}
            </ol>

            <div className="mt-5 rounded-xl bg-slate-50 p-3">
              <p className="text-[11px] leading-relaxed text-slate-500">
                <span className="font-semibold text-slate-700">Tip:</span> Select any section to jump directly to its content.
              </p>
            </div>
          </nav>
        </aside>

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
            <Link href="/privacy-policy" className="font-semibold text-[#0039bd] hover:underline">Privacy Policy</Link>,{" "}
            <Link href="/terms" className="font-semibold text-[#0039bd] hover:underline">Terms of Service</Link> and{" "}
            <Link href="/refund-policy" className="font-semibold text-[#0039bd] hover:underline">Refund &amp; Cancellation Policy</Link>
            . Questions? Email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-[#0039bd] hover:underline">{CONTACT_EMAIL}</a>.
          </p>
        </article>
      </main>
    </>
  );
}