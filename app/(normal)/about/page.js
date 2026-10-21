import Link from "next/link";
import {
  ArrowUpRight, CalendarCheck, Clock, GraduationCap, Layers, MessagesSquare, Rocket, ShieldCheck, Sparkles, UserCheck, Users,
} from "lucide-react";
import clientPromise from "@/lib/mongodb";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.learnperhour.com").replace(/\/$/, "");
const CONTACT_EMAIL = "support@learnperhour.com";

/* OPTIONAL: add real photos (full https links or /public paths). Empty = a gradient tile is shown. */
const IMAGES = {
  hero: "/ds.jpg",
  about: "/ds.jpg",
  pillars: ["https://images.pexels.com/photos/4443159/pexels-photo-4443159.jpeg", "https://images.pexels.com/photos/29022334/pexels-photo-29022334.jpeg", "https://images.pexels.com/photos/11035479/pexels-photo-11035479.jpeg", "https://images.unsplash.com/photo-1645484686977-dbddd9e1dc0a"],
  features: ["https://images.pexels.com/photos/37179006/pexels-photo-37179006.jpeg", "https://images.pexels.com/photos/19929565/pexels-photo-19929565.jpeg", "https://images.pexels.com/photos/40062245/pexels-photo-40062245.jpeg", "https://images.pexels.com/photos/19746092/pexels-photo-19746092.jpeg"],
};

export const metadata = {
  title: "About Us | Learn Per Hour",
  description:
    "Learn Per Hour is an online learning platform where you learn tools, topics and certifications with expert trainers, and pay for the hours you need.",
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: "About Us | Learn Per Hour",
    description: "Learn with expert trainers and pay for the hours you need.",
    url: `${SITE_URL}/about`,
    type: "website",
  },
};

const PILLARS = [
  { title: "Courses", Icon: Layers },
  { title: "Tools", Icon: Rocket },
  { title: "Topics", Icon: Sparkles },
  { title: "Certifications", Icon: ShieldCheck },
];

const FEATURES = [
  { title: "Pay per hour", text: "Choose the hours that fit your goal and budget instead of a fixed, long course.", Icon: Clock, bg: "bg-[#0039bd] text-white" },
  { title: "Expert trainers", text: "Learn from professionals who work with the tools they teach.", Icon: UserCheck, bg: "bg-[#060B1F] text-white" },
  { title: "Hands-on learning", text: "Labs and real projects so you build skills you can use at work.", Icon: GraduationCap, bg: "bg-[#ccfc3b] text-[#060B1F]" },
  { title: "Certification prep", text: "Prepare for industry exams with practice built around exam objectives.", Icon: ShieldCheck, bg: "bg-[#dbe6ff] text-[#0039bd]" },
];

const STEPS = [
  { title: "Book a free session", text: "Pick any course, tool, topic or certification and request a free session.", Icon: CalendarCheck },
  { title: "Join a clarity call", text: "We learn your goal and level, then recommend the right plan, hours and trainer.", Icon: MessagesSquare },
  { title: "Learn and grow", text: "Learn live with your trainer and track everything in My bookings.", Icon: Rocket },
];

/* real trainers from your database (name + photo only); the section hides if there are none */
async function getTrainers() {
  try {
    const db = (await clientPromise).db("learnPerHour");
    const docs = await db
      .collection("trainers")
      .find({ isActive: true })
      .project({ name: 1, image: 1, about: 1 })
      .sort({ createdAt: 1 })
      .limit(3)
      .toArray();
    return docs.map((t) => ({
      id: String(t._id),
      name: t.name || "Trainer",
      image: t.image || "",
      about: String(t.about || "").split(/(?<=\.)\s/)[0].slice(0, 120),
    }));
  } catch {
    return [];
  }
}

const Eyebrow = ({ children }) => (
  <p className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
    <span className="h-1 w-1 rounded-full bg-slate-400" /> {children}
  </p>
);

function Tile({ src, Icon, label, className = "" }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#dbe6ff] via-[#c4d6ff] to-[#9db9f5] ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <Icon size={56} strokeWidth={1.2} className="absolute right-4 top-4 text-[#0039bd]/40" />
      )}
      {label && (
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#060B1F]">{label}</span>
      )}
    </div>
  );
}

export default async function AboutPage() {
  const trainers = await getTrainers();

  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Learn Per Hour",
    url: `${SITE_URL}/about`,
    isPartOf: { "@type": "WebSite", name: "Learn Per Hour", url: SITE_URL },
  };

  return (
    <main className="px-4 pb-6 pt-14 font-sans sm:px-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />

<section className="relative flex min-h-[560px] w-full items-end overflow-hidden p-6 sm:p-10 lg:min-h-[660px] lg:p-14 mb-20">
  {/* Full-width background image */}
  <img
    src="https://images.pexels.com/photos/3807755/pexels-photo-3807755.jpeg"
    alt=""
    aria-hidden="true"
    className="absolute inset-0 h-full w-full object-cover object-center rotate-y-180"
  />

  {/* Image overlay */}
  <div className="absolute inset-0 bg-[#060B1F]/60" />

  {/* Decorative elements */}
  <div
    aria-hidden="true"
    className="absolute -right-20 -top-20 h-96 w-96 rounded-full border-[40px] border-white/10"
  />
  <div
    aria-hidden="true"
    className="absolute right-40 top-40 h-52 w-52 rounded-full bg-[#ccfc3b]/15 blur-3xl"
  />

  {/* Content container */}
  <div className="relative mx-auto w-full max-w-[1400px]">
    <div className="max-w-2xl">
      <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-5xl">
        Learning that fits your hours.
      </h1>

      <p className="mt-5 max-w-lg text-sm text-white/80 sm:text-base">
        Practical, job-focused learning with expert trainers. Start with a
        free session and pay only for the hours you need.
      </p>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <Link
          href="/courses"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-[#ccfc3b] px-6 text-sm font-semibold text-[#060B1F] transition-colors hover:bg-white"
        >
          Get started today
          <ArrowUpRight size={15} strokeWidth={2.5} />
        </Link>

        <Link
          href="/faq"
          className="inline-flex h-11 items-center rounded-full border border-white/30 px-6 text-sm font-medium text-white transition-colors hover:bg-white/10"
        >
          Have a question?
        </Link>
      </div>
    </div>
  </div>
</section>

      <div className="mx-auto max-w-[1400px] space-y-20 lg:space-y-28">
        {/* ---------- hero ---------- */}
    

        {/* ---------- about us ---------- */}
        <section className="grid gap-8 lg:grid-cols-[400px_minmax(0,1fr)] lg:gap-10">
          <div className="relative min-h-[320px] lg:min-h-[420px]">
            <Tile src={IMAGES.about} Icon={Users} className="h-full w-full" />
            <Link href="/faq" className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-white/90 py-1.5 pl-4 pr-1.5 text-xs font-semibold text-[#060B1F]">
              Have a question?
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#0039bd] text-white"><ArrowUpRight size={13} /></span>
            </Link>
          </div>

          <div>
            <Eyebrow>About us</Eyebrow>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold leading-tight tracking-tight text-[#060B1F] sm:text-4xl">
              Why choose Learn Per Hour for your learning journey?
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PILLARS.map((p, i) => (
                <Tile key={p.title} src={IMAGES.pillars[i]} Icon={p.Icon} label={p.title} className="aspect-[4/5]" />
              ))}
            </div>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-slate-500">
              At Learn Per Hour, we are rebuilding how people learn technology. You choose a course, tool, topic or certification, meet us on a free clarity call, and we match you with a trainer and the number of hours that fit your goal. No long, fixed programs. You learn what you need, and pay for the hours you use.
            </p>
          </div>
        </section>

        {/* ---------- features ---------- */}
        <section>
          <div className="grid gap-4 lg:grid-cols-2 lg:items-end">
            <div>
              <Eyebrow>Features &amp; benefits</Eyebrow>
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-[#060B1F] sm:text-4xl">
                Your path to better skills
              </h2>
            </div>
            <p className="max-w-md text-sm text-slate-500 lg:ml-auto">
              Everything is designed around your time, your goal and your pace, so you spend hours on learning, not on figuring out where to start.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-start">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`relative flex flex-col justify-between overflow-hidden rounded-3xl p-5 ${f.bg} ${
                  i % 2 ? "min-h-[260px] lg:mt-10" : "min-h-[320px]"
                }`}
              >
                {IMAGES.features[i] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={IMAGES.features[i]} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
                )}
                <div className="relative flex items-start justify-between">
                  <h3 className="text-xl font-medium">{f.title}</h3>
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-white/25"><f.Icon size={16} /></span>
                </div>
                <p className="relative text-xs leading-relaxed opacity-80">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- mission ---------- */}
        <section className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-center">
          <div>
            <Eyebrow>Our mission</Eyebrow>
            <span aria-hidden="true" className="mt-4 block text-7xl font-serif leading-none text-[#0039bd]/30">“</span>
            <p className="-mt-6 max-w-2xl text-2xl font-medium leading-snug text-[#060B1F] sm:text-3xl">
              Make practical, expert-led technology learning simple to start, flexible to follow and fair to pay for.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold text-[#0039bd]">
              {["Practical first", "Flexible hours", "Honest pricing"].map((v) => (
                <span key={v} className="rounded-full bg-[#dbe6ff] px-4 py-2">{v}</span>
              ))}
            </div>
          </div>
          <Tile Icon={Users} src='https://images.pexels.com/photos/939328/pexels-photo-939328.jpeg' className="aspect-[4/3]" />
        </section>

        {/* ---------- trainers (live data) ---------- */}
        {trainers.length > 0 && (
          <section>
            <div className="grid gap-4 lg:grid-cols-2 lg:items-end">
              <div>
                <Eyebrow>Meet our experts</Eyebrow>
                <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-[#060B1F] sm:text-4xl">
                  Our dedicated trainers
                </h2>
              </div>
              <p className="max-w-md text-sm text-slate-500 lg:ml-auto">
                Experienced professionals who work with the tools they teach, matched to your goals after your clarity call.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex min-h-[260px] flex-col justify-between rounded-3xl bg-[#dbe6ff] p-6">
                <p className="text-xl font-medium leading-snug text-[#060B1F]">Trainers with real industry experience</p>
                <p className="text-xs text-slate-600">Linux, cloud, DevOps, containers and more.</p>
              </div>
              {trainers.map((t) => (
                <div key={t.id} className="relative min-h-[260px] overflow-hidden rounded-3xl bg-gradient-to-br from-[#0039bd] to-[#050B24]">
                  {t.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.image} alt={t.name} className="absolute inset-0 h-full w-full object-cover" />
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 pt-16">
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    {t.about && <p className="mt-0.5 line-clamp-2 text-[11px] text-white/70">{t.about}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ---------- how it works ---------- */}
        <section>
          <div className="grid gap-4 lg:grid-cols-2 lg:items-end">
            <div>
              <Eyebrow>How it works</Eyebrow>
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-[#060B1F] sm:text-4xl">
                Your journey in 3 simple steps
              </h2>
            </div>
            <p className="max-w-md text-sm text-slate-500 lg:ml-auto">
              From your first free session to your last class, everything is tracked in one place.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="flex min-h-[300px] flex-col justify-between rounded-3xl bg-slate-100 p-6">
                <p className="max-w-[220px] text-xs leading-relaxed text-slate-500">{s.text}</p>
                <s.Icon size={64} strokeWidth={1} className="mx-auto text-[#0039bd]" />
                <p className="flex items-baseline gap-3 text-2xl font-medium text-[#060B1F]">
                  <span className="text-sm font-bold tabular-nums text-[#0039bd]">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- CTA ---------- */}
        <section className="rounded-[28px] bg-[#dbe6ff] px-6 py-16 text-center sm:py-24">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-[#060B1F] sm:text-5xl">
            Start learning with Learn Per Hour today
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-slate-600">
            Book a free session, meet your trainer and learn the skills that matter for your career.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link href="/courses" className="inline-flex h-11 items-center gap-2 rounded-full bg-[#060B1F] px-6 text-sm font-semibold text-white hover:bg-[#0039bd]">
              Book a free session <ArrowUpRight size={15} strokeWidth={2.5} />
            </Link>
            <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex h-11 items-center rounded-full border border-[#060B1F]/20 px-6 text-sm font-semibold text-[#060B1F] hover:bg-white/60">
              Email us
            </a>
          </div>
        </section>

        
      </div>
    </main>
  );
}