import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { getListingConfig, listingBasePath } from "@/lib/listingConfig";

export const slugify = (value = "") =>
  String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export const categorySlug = (category) => category?.slug || slugify(category?.name || "");

const safeDecode = (value) => {
  try {
    return decodeURIComponent(String(value || ""));
  } catch {
    return String(value || "");
  }
};

const matchesItem = (item, value) => {
  const wanted = safeDecode(value).trim().toLowerCase();
  if (!wanted) return false;
  return (
    categorySlug(item).toLowerCase() === wanted ||
    slugify(item.name || "") === wanted ||
    String(item._id) === wanted
  );
};

const parseList = (value) =>
  String(value || "").split(",").map((i) => i.trim()).filter(Boolean).slice(0, 50);

const numOrNull = (v) => {
  if (v === "" || v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(0, n) : null;
};

const textFromDetails = (doc) => {
  const p = doc?.details?.blocks?.find((b) => b?.type === "paragraph" && b?.data?.text);
  return String(p?.data?.text || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
};

const escapeRegex = (v) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const NO_MATCH_ID = () => new ObjectId("000000000000000000000000");

const serializeOption = (item) => ({
  _id: String(item._id),
  categoryId: item.categoryId ? String(item.categoryId) : "",
  name: item.name || "",
  slug: item.slug || slugify(item.name || ""),
  image: item.image || "",
  seoTitle: item.seoTitle || "",
  seoDescription: item.seoDescription || "",
  intro: item.intro || "",
});

const serializeItem = (doc, cfg) => {
  const slug = doc.slug || slugify(doc.name || cfg.label);
  return {
    _id: String(doc._id),
    id: String(doc._id),
    type: cfg.key,
    name: doc.name || cfg.label,
    slug,
    href: `${cfg.itemPath}/${slug}`,
    image: doc.image || "",
    description:
      doc.shortDescription ||
      doc.description ||
      doc.seoDescription ||
      textFromDetails(doc) ||
      `Explore ${doc.name || "this"} with Learn Per Hour.`,
    price: Number(doc.price ?? 0),
    actualPrice: Number(doc.actualPrice ?? doc.price ?? 0),
    discount: doc.discount || null,
    pricingType: doc.pricingType || "fixed",
    hours: Number(doc.hours ?? 0),
    level: doc.level || "",
    category: doc.category ? String(doc.category) : "",
    subCategory: doc.subCategory ? String(doc.subCategory) : "",
    skills: Array.isArray(doc.skills) ? doc.skills.map(String) : [],
    tools: Array.isArray(doc.tools) ? doc.tools.map(String) : [],
  };
};

const notFoundResult = (cfg) => ({
  type: cfg.key,
  category: null,
  isAll: false,
  categories: [],
  subCategory: null,
  subCategories: [],
  skills: [],
  tools: [],
  items: [],
  filters: {},
  total: 0,
});

export async function getListingData(type, slug, searchParams = {}) {
  const cfg = getListingConfig(type);
  if (!cfg) throw new Error(`Unknown listing type: ${type}`);
  const f = cfg.filters;

  const client = await clientPromise;
  const db = client.db("learnPerHour");

  // "top-tools-cloud-computing" -> "cloud-computing" ; "top-tools" or "" -> "" (= all)
  const bare = cfg.slugPrefix.replace(/-$/, "");
  let rawSlug = safeDecode(Array.isArray(slug) ? slug[0] : slug).trim().toLowerCase();
  if (rawSlug === bare) rawSlug = "";
  else if (rawSlug.startsWith(cfg.slugPrefix)) rawSlug = rawSlug.slice(cfg.slugPrefix.length);
  const hasSlug = Boolean(rawSlug);

  const categories = await db
    .collection(cfg.categoryCollection)
    .find({ isActive: true })
    .sort({ name: 1 })
    .toArray();

  let category = null;
  if (hasSlug) {
    category = categories.find(
      (c) => categorySlug(c).toLowerCase() === rawSlug || slugify(c.name || "") === rawSlug
    );
    if (!category) return notFoundResult(cfg);
  }

  const [allSubCategories, skills, tools] = await Promise.all([
    db.collection(cfg.subCategoryCollection).find({ isActive: true }).sort({ name: 1 }).toArray(),
    f.skills ? db.collection("skills").find({ isActive: true }).sort({ name: 1 }).toArray() : [],
    f.tools ? db.collection("tools").find({ isActive: true }).sort({ name: 1 }).toArray() : [],
  ]);

  const subCategories = category
    ? allSubCategories.filter((s) => String(s.categoryId) === String(category._id))
    : allSubCategories;

  const params = {
    category: parseList(searchParams.category),
    subCategory: parseList(searchParams.subCategory),
    skills: parseList(searchParams.skills),
    tools: parseList(searchParams.tools),
    level: parseList(searchParams.level).map((x) => x.toLowerCase()),
    duration: parseList(searchParams.duration),
    minPrice: numOrNull(searchParams.minPrice),
    maxPrice: numOrNull(searchParams.maxPrice),
    search: String(searchParams.search || "").trim().slice(0, 100),
    sort: String(searchParams.sort || "popular"),
    page: Math.max(1, Math.min(10000, Number.parseInt(searchParams.page || "1", 10) || 1)),
  };

  const query = { isActive: true };

  // ---- category ----
  if (category) {
    query.category = category._id;
  } else if (params.category.length) {
    const ids = params.category
      .map((v) => categories.find((c) => matchesItem(c, v)))
      .filter(Boolean)
      .map((c) => c._id);
    query.category = { $in: ids.length ? ids : [NO_MATCH_ID()] };
  }

  // ---- subcategory ----
  const selectedSubItems = params.subCategory
    .map((v) => subCategories.find((s) => matchesItem(s, v)))
    .filter(Boolean);

  // subcategory requested but not found under this category -> 404
  if (params.subCategory.length && !selectedSubItems.length) return notFoundResult(cfg);

  if (params.subCategory.length) {
    query.subCategory = { $in: selectedSubItems.map((s) => s._id) };
  }

  if (f.skills && params.skills.length) {
    const ids = params.skills.map((v) => skills.find((s) => matchesItem(s, v))).filter(Boolean).map((s) => s._id);
    query.skills = { $in: ids.length ? ids : [NO_MATCH_ID()] };
  }
  if (f.tools && params.tools.length) {
    const ids = params.tools.map((v) => tools.find((t) => matchesItem(t, v))).filter(Boolean).map((t) => t._id);
    query.tools = { $in: ids.length ? ids : [NO_MATCH_ID()] };
  }
  if (f.level && params.level.length) query.level = { $in: params.level };

  if (params.search) {
    const rx = { $regex: escapeRegex(params.search), $options: "i" };
    query.$or = [{ name: rx }, { seoTitle: rx }, { seoDescription: rx }];
  }

  const allMatching = await db.collection(cfg.collection).find(query).toArray();
  const priceOf = (d) => Number(d.actualPrice ?? d.price ?? 0);

  const filtered = allMatching.filter((d) => {
    if (f.price) {
      const p = priceOf(d);
      if (params.minPrice !== null && p < params.minPrice) return false;
      if (params.maxPrice !== null && p > params.maxPrice) return false;
    }
    if (f.duration && params.duration.length) {
      const h = Number(d.hours || 0);
      const ok = params.duration.some((r) =>
        r === "0-5" ? h <= 5 : r === "6-10" ? h >= 6 && h <= 10 : r === "11-20" ? h >= 11 && h <= 20 : r === "21+" ? h >= 21 : false
      );
      if (!ok) return false;
    }
    return true;
  });

  const sorters = {
    popular: (a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0),
    priceLow: (a, b) => priceOf(a) - priceOf(b),
    priceHigh: (a, b) => priceOf(b) - priceOf(a),
    name: (a, b) => String(a.name || "").localeCompare(String(b.name || "")),
    newest: (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
  };
  filtered.sort(sorters[params.sort] || sorters.popular);

  const pageSize = 12;
  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(params.page, pageCount);
  const pageItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const plural = cfg.labelPlural;
  const lower = plural.toLowerCase();

  const categoryData = category
    ? {
        ...serializeOption(category),
        seoTitle: category.seoTitle || `Top ${category.name} ${plural} Online | Learn Per Hour`,
        seoDescription:
          category.seoDescription ||
          `Explore top ${category.name} ${lower} with practical learning and skills to support your career growth.`,
        intro:
          category.intro ||
          `Explore ${category.name} ${lower} designed to help you build practical skills. Compare topics, levels and pricing to find the right learning path.`,
      }
    : {
        _id: "",
        name: "All",
        slug: "",
        image: "",
        seoTitle: `Top ${plural} Online | Learn Per Hour`,
        seoDescription: `Explore top ${lower} across all categories with practical learning and skills to support your career growth.`,
        intro: `Explore ${lower} across every category. Compare topics, levels and pricing to find the right learning path.`,
      };

  // subcategory page uses the subcategory's OWN content (not the category's)
  const selectedSub = selectedSubItems[0] || null;
  const subCategoryData = selectedSub
    ? {
        ...serializeOption(selectedSub),
        seoTitle: selectedSub.seoTitle || `Top ${selectedSub.name} ${plural} Online | Learn Per Hour`,
        seoDescription:
          selectedSub.seoDescription ||
          `Explore top ${selectedSub.name} ${lower} with practical learning and skills to support your career growth.`,
        intro:
          selectedSub.intro ||
          `Explore ${selectedSub.name} ${lower} designed to help you build practical skills. Compare topics, levels and pricing to find the right learning path.`,
      }
    : null;

  return {
    type: cfg.key,
    basePath: listingBasePath(cfg, category ? categorySlug(category) : ""),
    isAll: !category,
    category: categoryData,
    categories: categories.map(serializeOption),
    subCategory: subCategoryData,
    subCategories: subCategories.map(serializeOption),
    skills: skills.map(serializeOption),
    tools: tools.map(serializeOption),
    items: pageItems.map((d) => serializeItem(d, cfg)),
    total,
    page: currentPage,
    pageSize,
    pageCount,
    filters: params,
    priceBounds: { min: 0, max: Math.max(1000, ...allMatching.map(priceOf)) },
  };
}