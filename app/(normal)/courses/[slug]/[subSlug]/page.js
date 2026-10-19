// FILE 1
// Path: app/courses/[slug]/[subSlug]/page.jsx
// (the [subSlug] folder goes inside the same folder as your category page.jsx)

import { notFound } from "next/navigation";
import { categorySlug, getTopCoursesData } from "@/lib/topCourses";
import TopCoursesClient from "@/component/LearnListingClient";
import Link from "next/link";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.learnperhour.com").replace(/\/$/, "");

// Builds every SEO / header value in one place, with fallbacks when the subcategory has no custom SEO fields
function buildSeo(data) {
  const category = data.category;
  const sub = data.subCategory;
  const categoryPath = `/courses/top-courses-${categorySlug(category)}`;
  const subPath = `${categoryPath}/${categorySlug(sub)}`;

  return {
    categoryUrl: `${SITE_URL}${categoryPath}`,
    canonical: `${SITE_URL}${subPath}`,
    title: sub.seoTitle || `Top ${sub.name} Courses in ${category.name} Online | Learn Per Hour`,
    description:
      sub.seoDescription ||
      `Explore top ${sub.name} courses in ${category.name}. Compare topics, levels, duration and pricing to find the right ${sub.name} learning path with Learn Per Hour.`,
    intro:
      sub.intro ||
      `Explore ${sub.name} courses under ${category.name} designed to help you build practical, job-ready skills. Compare course topics, learning levels, duration, and pricing to find the right learning path.`,
    image: sub.image || category.image || "",
  };
}

export async function generateMetadata({ params }) {
  const { slug, subSlug } = await params;
  const data = await getTopCoursesData(slug, { subCategory: subSlug });

  if (!data.category || !data.subCategory) {
    return { title: "Courses Not Found | Learn Per Hour", robots: { index: false, follow: false } };
  }

  const seo = buildSeo(data);
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: seo.canonical },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.canonical,
      type: "website",
      images: seo.image ? [{ url: seo.image, alt: data.subCategory.name }] : [],
    },
    twitter: {
      card: seo.image ? "summary_large_image" : "summary",
      title: seo.title,
      description: seo.description,
      images: seo.image ? [seo.image] : [],
    },
  };
}

export default async function TopCoursesSubCategoryPage({ params }) {
  const { slug, subSlug } = await params;
  const data = await getTopCoursesData(slug, { subCategory: subSlug });

  // unknown category OR unknown subcategory -> real 404
  if (!data.category || !data.subCategory) notFound();

  const seo = buildSeo(data);
  const category = data.category;
  const sub = data.subCategory;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Courses", item: `${SITE_URL}/courses` },
      { "@type": "ListItem", position: 3, name: `Top ${category.name} Courses`, item: seo.categoryUrl },
      { "@type": "ListItem", position: 4, name: `${sub.name} Courses`, item: seo.canonical },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: seo.title,
    description: seo.description,
    url: seo.canonical,
    isPartOf: { "@type": "WebSite", name: "Learn Per Hour", url: SITE_URL },
    about: { "@type": "Thing", name: sub.name },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: (data.courses || []).map((course, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/courses/${course.slug}`,
        name: course.name,
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema).replace(/</g, "\\u003c") }} />

      <div className="h-78 sm:h-74 bg-gradient-to-b from-[#0039bd] via-[#3162d3] to-[#ffff] mt-15 pt-4">
        <nav aria-label="Breadcrumb" className="mb-2 text-xs text-slate-400 max-w-7xl mx-auto px-4 sm:px-0">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/" className="hover:text-[#0039bd]">Home</Link></li><li aria-hidden="true">/</li>
            <li><Link href="/courses" className="hover:text-[#0039bd]">Courses</Link></li><li aria-hidden="true">/</li>
            <li>
              <Link href={`/courses/top-courses-${categorySlug(category)}`} className="hover:text-[#0039bd]">
                Top {category.name} Courses
              </Link>
            </li><li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-[#fff]">{sub.name} Courses</li>
          </ol>
        </nav>

        <header className="mb-8 rounded-3xl max-w-7xl mx-auto px-4 sm:px-0">
          <p className="text-xs mt-8 font-bold uppercase text-[#ccfc3b]">{category.name} · Course library</p>
          <h1 className="mt-3 max-w-4xl text-2xl font-semibold leading-tight tracking-tight text-[#ffffff] sm:text-4xl lg:text-4xl">
            {seo.title.replace(/\s*\|\s*Learn Per Hour\s*$/i, "")}
          </h1>
          <p className="mt-4 max-w-3xl text-sm text-slate-100 sm:text-base">{seo.intro}</p>
        </header>
      </div>

      <TopCoursesClient slug={slug} subSlug={subSlug} initialCategory={category} />
    </>
  );
}