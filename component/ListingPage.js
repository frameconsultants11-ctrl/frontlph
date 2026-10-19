import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { categorySlug, getListingData } from "@/lib/learnListing";
import { getListingConfig, listingBasePath } from "@/lib/listingConfig";
import LearnListingClient from "@/component/LearnListingClient";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.learnperhour.com").replace(/\/$/, "");

const load = async (type, params) => {
  const cfg = getListingConfig(type);
  if (!cfg) {
    throw new Error(
      `ListingPage needs a valid type ("courses" | "certifications" | "tools" | "topics"), got: ${type}`
    );
  }
  const { slug, subSlug } = (await params) || {};
  const data = await getListingData(type, slug, subSlug ? { subCategory: subSlug } : {});

  const catSlug = data.category && !data.isAll ? categorySlug(data.category) : "";
  const sub = data.subCategory || null;

  // content for SEO + header: subcategory first, then category
  const content = sub || data.category;
  const categoryUrl = `${SITE_URL}${listingBasePath(cfg, catSlug)}`;
  const canonical = sub ? `${categoryUrl}/${sub.slug}` : categoryUrl;

  const heading = sub
    ? `Top ${sub.name} ${cfg.labelPlural}`
    : data.isAll
      ? `Top ${cfg.labelPlural}`
      : `Top ${data.category?.name} ${cfg.labelPlural}`;

  return { cfg, data, sub, content, slug: catSlug, subSlug: sub ? sub.slug : "", canonical, categoryUrl, heading };
};

export async function listingMetadata(type, params) {
  const { data, content, canonical } = await load(type, params);
  if (!data.category) {
    return { title: "Not Found | Learn Per Hour", robots: { index: false, follow: false } };
  }
  return {
    title: content.seoTitle,
    description: content.seoDescription,
    alternates: { canonical },
    openGraph: {
      title: content.seoTitle,
      description: content.seoDescription,
      url: canonical,
      type: "website",
      images: content.image ? [{ url: content.image, alt: content.name }] : [],
    },
    twitter: {
      card: content.image ? "summary_large_image" : "summary",
      title: content.seoTitle,
      description: content.seoDescription,
      images: content.image ? [content.image] : [],
    },
  };
}

export default async function ListingPage({ type, params }) {
  const session = await auth();
  const { cfg, data, sub, content, slug, subSlug, canonical, categoryUrl, heading } = await load(type, params);
  if (!data.category) notFound();

  // Home > Tools > Top Cloud Computing Tools > Top Docker Tools
const crumbs = [{ name: "Home", url: SITE_URL, href: "/" }];

if (data.isAll) {
  crumbs.push({ name: cfg.labelPlural, url: canonical, href: null });
} else {
  crumbs.push({ name: cfg.labelPlural, url: `${SITE_URL}${cfg.listPath}`, href: cfg.listPath });
  crumbs.push({
    name: `Top ${data.category.name} ${cfg.labelPlural}`,
    url: categoryUrl,
    href: sub ? listingBasePath(cfg, slug) : null,
  });
  if (sub) crumbs.push({ name: heading, url: canonical, href: null });
}

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.url })),
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: content.seoTitle,
    description: content.seoDescription,
    url: canonical,
    isPartOf: { "@type": "WebSite", name: "Learn Per Hour", url: SITE_URL },
    about: { "@type": "Thing", name: sub ? sub.name : data.isAll ? `Online ${cfg.labelPlural}` : data.category.name },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: data.items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}${item.href}`,
        name: item.name,
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
            {crumbs.map((c, i) => (
              <li key={c.name + i} className="flex items-center gap-2">
                {c.href ? (
                  <Link href={c.href} className="hover:text-[#0039bd]">{c.name}</Link>
                ) : (
                  <span aria-current="page" className="font-medium text-[#fff]">{c.name}</span>
                )}
                {i < crumbs.length - 1 && <span aria-hidden="true">/</span>}
              </li>
            ))}
          </ol>
        </nav>
        <header className="mb-8 rounded-3xl max-w-7xl mx-auto px-4 sm:px-0">
          <p className="text-xs mt-8 font-bold uppercase text-[#ccfc3b]">{cfg.label} library</p>
          <h1 className="mt-3 max-w-4xl text-2xl font-semibold leading-tight tracking-tight text-[#ffffff] sm:text-4xl lg:text-4xl">
            Learn {content.seoTitle || `Learn ${heading} Online`}
          </h1>
          <p className="mt-4 max-w-3xl text-sm text-slate-100 sm:text-base">{content.intro}</p>
        </header>
      </div>
      <LearnListingClient
        type={type}
        slug={slug}
        subSlug={subSlug}
        isAll={data.isAll}
        initialCategory={data.category}
        initialSub={sub}
        session={session}
      />
    </>
  );
}