// Path: app/courses/[slug]/CourseDetailPage.jsx

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BarChart3, Briefcase, Clock, FolderKanban, Layers, MonitorCheck, Wrench } from "lucide-react";
import { getCourseDetail, plainText } from "@/lib/courseDetail";
import { categorySlug } from "@/lib/topCourses";
import CourseLearnList from "@/component/CourseLearnList";
import CourseSlider from "@/component/profile/CourseSlider";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import PurchaseCard from "@/component/course/PurchaseCard";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.learnperhour.com").replace(/\/$/, "");

/* Change this to your real enrol route */
const ENROLL_HREF = (slug) => `/checkout?course=${slug}`;

const money = (value) => `₹${Number(value ?? 0).toLocaleString("en-IN")}`;
const cap = (value = "") => (value ? value[0].toUpperCase() + value.slice(1) : "");
const monthYear = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "";

function discountLabel(course) {
  if (!course.discount || course.actualPrice >= course.price) return "";
  return course.discount.type === "percentage"
    ? `${course.discount.value}% off`
    : `${money(course.discount.value)} off`;
}

function Html({ as: Tag = "span", html, className }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

/* ---------------- Metadata ---------------- */
export async function generateCourseMetadata({ params }, type='courses') {
  const { slug } = await params;
  const data = await getCourseDetail(slug, type);
  if (!data) {
    return { title: "Course Not Found | Learn Per Hour", robots: { index: false, follow: false } };
  }

  const { course } = data;
  const canonical = `${SITE_URL}/courses/${course.slug}`;
  const title = course.seoTitle || `${course.name} | Learn Per Hour`;
  const description =
    course.seoDescription ||
    plainText(data.intro.find((block) => block.type === "paragraph")?.html || "").slice(0, 155) ||
    `Learn ${course.name} with Learn Per Hour.`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: course.image ? [{ url: course.image, alt: course.name }] : [],
    },
    twitter: {
      card: course.image ? "summary_large_image" : "summary",
      title,
      description,
      images: course.image ? [course.image] : [],
    },
  };
}

/* ---------------- Small pieces ---------------- */
function RichList({ items, ordered = false, nested = false }) {
  if (!items?.length) return null;

  if (ordered && !nested) {
    return (
      <ol className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((item, index) => {
          const colon = item.content.indexOf(":");
          const hasLead = colon > 0 && colon < 70;
          return (
            <li key={index} className="flex gap-3 rounded-2xl border border-slate-200 p-4">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#ccfc3b] text-xs font-bold text-[#00206b]">
                {index + 1}
              </span>
              <p className="text-sm leading-relaxed text-slate-600">
                {hasLead ? (
                  <>
                    <Html as="strong" className="font-semibold text-[#060B1F]" html={item.content.slice(0, colon)} />
                    <Html html={`: ${item.content.slice(colon + 1).trim()}`} />
                  </>
                ) : (
                  <Html html={item.content} />
                )}
              </p>
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <ul className={`space-y-2.5 ${nested ? "mt-2 pl-5" : "mt-4"}`}>
      {items.map((item, index) => (
        <li key={index} className="flex gap-3 text-[15px] leading-relaxed text-slate-600">
          <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0039bd]" />
          <div className="min-w-0">
            <Html html={item.content} />
            <RichList items={item.items} nested />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Blocks({ blocks }) {
  return blocks.map((block, index) => {
    if (block.type === "paragraph") {
      return <Html key={index} as="p" className="mt-4 text-[15px] leading-7 text-slate-600" html={block.html} />;
    }
    if (block.type === "list") {
      return <RichList key={index} items={block.items} ordered={block.ordered} />;
    }
    if (block.type === "header") {
      return <Html key={index} as="h3" className="mt-6 text-lg font-semibold text-[#060B1F]" html={block.html} />;
    }
    return null;
  });
}


function RelatedCard({ course }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-lg"
    >
      {course.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={course.image} alt="" className="aspect-5/2 w-full object-cover" />
      ) : (
        <div className="aspect-video w-full bg-blue-50" />
      )}
      <div className="p-4">
        <h3 className="line-clamp-2 text-[15px] font-semibold text-[#060B1F] group-hover:text-[#0039bd]">{course.name}</h3>
        <p className="mt-1 text-xs text-slate-500">{course.hours} hours · {cap(course.level)}</p>
        <p className="mt-3 flex items-baseline gap-2">
          <span className="text-base font-bold text-[#060B1F]">{money(course.actualPrice)}</span>
          {course.actualPrice < course.price && (
            <span className="text-xs text-slate-400 line-through">{money(course.price)}</span>
          )}
        </p>
      </div>
    </Link>
  );
}

/* ---------------- Page ---------------- */
export default async function CourseDetailPage({session, type, params }) {
  const { slug } = await params;
  console.log(session)
  const data = await getCourseDetail(slug, type);
  if (!data) notFound();
  const { course, category, subCategory, skills, tools, intro, learn, sections, related } = data;
  const canonical = `${SITE_URL}/learning/${type}/${course.slug}`;
  const categoryPath = category ? `/${type}/top-${type}-${categorySlug(category)}` : `/${type}`;
  const hasProjects = sections.some((section) => /project/i.test(section.title));
  const subtitle = course.seoDescription || plainText(intro[0]?.html || "");

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Courses", href: `/${type}` },
    ...(category ? [{ name: category.name, href: categoryPath }] : []),
    ...(category && subCategory ? [{ name: subCategory.name, href: `${categoryPath}/${subCategory.slug}` }] : []),
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      ...crumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: `${SITE_URL}${crumb.href === "/" ? "" : crumb.href}`,
      })),
      { "@type": "ListItem", position: crumbs.length + 1, name: course.name, item: canonical },
    ],
  };

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    description: subtitle,
    url: canonical,
    image: course.image || undefined,
    educationalLevel: cap(course.level) || undefined,
    timeRequired: course.hours ? `PT${course.hours}H` : undefined,
    provider: { "@type": "Organization", name: "Learn Per Hour", sameAs: SITE_URL },
    offers: {
      "@type": "Offer",
      price: course.actualPrice,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: canonical,
    },
  };

  const perks = [
    course.hours > 0 && { Icon: Clock, text: `${course.hours} hours of guided learning` },
    { Icon: BarChart3, text: `${cap(course.level) || "All"} level` },
    learn.length > 0 && { Icon: Layers, text: `${learn.length} learning outcomes` },
    hasProjects && { Icon: FolderKanban, text: "Hands-on projects" }
  ].filter(Boolean);

  const topicChips = [
    ...skills.map((item) => ({ ...item, kind: "skills" })),
    ...tools.map((item) => ({ ...item, kind: "tools" })),
  ];

  return (
    <div className="overflow-x-clip bg-white pb-24 font-sans lg:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema).replace(/</g, "\\u003c") }} />

      <div className="mx-auto grid max-w-7xl gap-x-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-0">
        {/* ===================== HERO ===================== */}
        <header className="bg-[#0039bd] pb-10 pt-24 text-white shadow-[0_0_0_100vmax_#0039bd] [clip-path:inset(0_-100vmax)] lg:pb-14">
          <nav aria-label="Breadcrumb" className="text-xs text-blue-100/80">
            <ol className="flex flex-wrap items-center gap-2">
              {crumbs.slice(1).map((crumb) => (
                <li key={crumb.href} className="flex items-center gap-2">
                  <Link href={crumb.href} className="hover:text-white hover:underline">{crumb.name}</Link>
                  <span aria-hidden="true">/</span>
                </li>
              ))}
              <li aria-current="page" className="font-medium text-white">{course.name}</li>
            </ol>
          </nav>

          <h1 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{course.name}</h1>
          {subtitle && <p className="mt-4 max-w-3xl text-base leading-relaxed text-blue-100">{subtitle}</p>}

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-blue-100">
            {course.level && (
              <span className="rounded-full bg-[#ccfc3b] px-3 py-1 text-xs font-bold text-[#00206b]">{cap(course.level)}</span>
            )}
            <span className="inline-flex items-center gap-1.5"><Clock size={15} />{course.hours} hours</span>
            {course.updatedAt && <span>Last updated {monthYear(course.updatedAt)}</span>}
          </div>
        </header>

        {/* ===================== PURCHASE CARD ===================== */}
        <aside className="lg:row-span-2 lg:pt-24">
          <div className="mt-6 lg:sticky lg:top-20 lg:mt-0">
            <PurchaseCard course={course} discountLabel={discountLabel} type={type} money={money} perks={perks} />
          </div>
        </aside>

        {/* ===================== BODY ===================== */}
        <div className="min-w-0 py-10">
          {learn.length > 0 && (
            <section className="rounded-2xl border border-slate-200 p-6">
              <h2 className="text-2xl font-semibold text-[#060B1F]">What you’ll learn</h2>
              <CourseLearnList items={learn} />
            </section>
          )}
           {tools.length > 0 && (
            <section className="mt-8 pt-0">
              <h2 className="text-xl font-semibold text-[#060B1F]">Tools and technologies</h2>
              <ul className="mt-5 flex flex-wrap gap-3">
                {tools.map((tool) => (
                  <li key={tool._id}>
                    <Link
                      href={`${categoryPath}?tools=${tool.slug}`}
                      className="flex items-center gap-2 rounded-md border border-slate-200 px-2 py-1text-xs font-medium text-[#060B1F] transition-colors hover:border-[#0039bd]"
                    >
                      {tool.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={tool.image} alt="" className="h-5 w-5 object-contain" />
                      )}
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {topicChips.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-semibold text-[#060B1F]">Explore related topics</h2>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {topicChips.map((item) => (
                  <Link
                    key={`${item.kind}-${item._id}`}
                    href={`/${type}?${item.kind}=${item.slug}`}
                    className="rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-[#060B1F] transition-colors hover:border-[#0039bd] hover:text-[#0039bd]"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {intro.length > 0 && (
            <section className="mt-10 border-t border-slate-200 pt-10">
              <h2 className="text-2xl font-semibold text-[#060B1F]">Description</h2>
              <Blocks blocks={intro} />
            </section>
          )}

          {sections.map((section) => (
            <section key={section.title} className="mt-10 border-t border-slate-200 pt-10">
              <h2 className="text-2xl font-semibold text-[#060B1F]">{section.title}</h2>
              <Blocks blocks={section.blocks} />
            </section>
          ))}

         

          {related.length > 0 && (
            <section className="mt-12 border-t border-slate-200 pt-10">
              <h2 className="text-2xl font-semibold text-[#060B1F]">
                More {category ? `${category.name} ` : ""}courses
              </h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {related.map((item) => <RelatedCard key={item.id} course={item} />)}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* ===================== MOBILE BUY BAR ===================== */}
      
    </div>
  );
}