
import clientPromise from "@/lib/mongodb";
import { getListingConfig } from "@/lib/listingConfig";
import { categorySlug } from "@/lib/learnListing";

/* Editor.js blocks contain small HTML tags. Keep only a safe list. */
export const cleanHtml = (html = "") =>
  String(html)
    .replace(
      /<(?!\/?(?:b|strong|i|em|u|br|code|mark)\b)[^>]*>/gi,
      ""
    )
    .replace(
      /<(b|strong|i|em|u|br|code|mark)\b[^>]*>/gi,
      "<$1>"
    )
    .replace(/&nbsp;/g, " ");

export const plainText = (html = "") =>
  String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

const safeDecode = (value) => {
  try {
    return decodeURIComponent(String(value || ""));
  } catch {
    return String(value || "");
  }
};

const normItems = (items = []) =>
  (Array.isArray(items) ? items : []).map((item) =>
    typeof item === "string"
      ? { content: cleanHtml(item), items: [] }
      : {
          content: cleanHtml(item?.content || ""),
          items: normItems(item?.items),
        }
  );

const normBlocks = (blocks = []) =>
  (Array.isArray(blocks) ? blocks : [])
    .map((block) => {
      const data = block?.data || {};

      if (block?.type === "paragraph") {
        return {
          type: "paragraph",
          html: cleanHtml(data.text),
        };
      }

      if (block?.type === "header") {
        return {
          type: "header",
          level: Number(data.level) || 2,
          html: cleanHtml(data.text),
          text: plainText(data.text),
        };
      }

      if (block?.type === "list") {
        return {
          type: "list",
          ordered: data.style === "ordered",
          items: normItems(data.items),
        };
      }

      return null;
    })
    .filter(Boolean)
    .filter(
      (block) =>
        block.type !== "paragraph" || plainText(block.html)
    );

const flattenList = (items = []) =>
  items.flatMap((item) => [
    item.content,
    ...flattenList(item.items),
  ]);

/*
 * Splits blocks into:
 * - Intro paragraphs
 * - "What You'll Learn" / "Learning Outcomes" list
 * - Remaining titled sections
 */
function buildSections(blocks) {
  const intro = [];
  let sections = [];
  let current = null;

  for (const block of blocks) {
    if (block.type === "header") {
      current = {
        title: block.text,
        blocks: [],
      };

      sections.push(current);
    } else if (current) {
      current.blocks.push(block);
    } else {
      intro.push(block);
    }
  }

  let learn = [];

  const learnIndex = sections.findIndex((section) =>
    /what\s+you.?ll\s+learn|learning\s+outcomes/i.test(
      section.title
    )
  );

  if (learnIndex !== -1) {
    const section = sections[learnIndex];

    const listIndex = section.blocks.findIndex(
      (block) => block.type === "list"
    );

    if (listIndex !== -1) {
      learn = flattenList(section.blocks[listIndex].items);
      section.blocks.splice(listIndex, 1);
    }

    if (!section.blocks.length) {
      sections = sections.filter(
        (_, index) => index !== learnIndex
      );
    }
  }

  return { intro, learn, sections };
}

/* Normalize category, subcategory, skill, and tool options. */
const serializeOption = (item) => ({
  _id: String(item._id),
  name: item.name || "",
  slug: categorySlug(item),
  image: item.image || "",
});

/* Normalize related items from the selected collection. */
const serializeRelated = (doc, cfg, topic = "") => ({
  id: String(doc._id),
  topic,
  name: doc.name || cfg.label,
  slug: doc.slug,
  href: `${cfg.itemPath}/${doc.slug}`,
  image: doc.image || "",
  hours: Number(doc.hours ?? 0),
  level: doc.level || "",
  price: Number(doc.price ?? 0),
  actualPrice: Number(doc.actualPrice ?? doc.price ?? 0),
});

/*
 * Get a detail record from the collection configured for its type.
 *
 * Supported types depend on lib/listingConfig.js:
 * courses       -> courses
 * topics        -> topicLearn
 * certifications -> certificationLearn
 * tools         -> toolsLearn
 */
export async function getLearnDetail(type, rawSlug) {
  const cfg = getListingConfig(type);

  if (!cfg) {
    throw new Error(`Unknown listing type: ${type}`);
  }

  const slug = safeDecode(
    Array.isArray(rawSlug) ? rawSlug[0] : rawSlug
  )
    .trim()
    .toLowerCase();

  if (!slug) return null;

  const client = await clientPromise;
  const db = client.db("learnPerHour");

  // Dynamically select the main collection.
  const collection = db.collection(cfg.collection);

  const item = await collection.findOne({
    slug,
    isActive: true,
  });

  if (!item) return null;

  /*
   * Fetch linked documents.
   * These supporting collection names come from the configuration
   * where applicable, while skills and tools use their shared
   * lookup collections.
   */
  const [category, subCategory, skills, tools] =
    await Promise.all([
      item.category
        ? db
            .collection(cfg.categoryCollection)
            .findOne({ _id: item.category })
        : null,

      item.subCategory
        ? db
            .collection(cfg.subCategoryCollection)
            .findOne({ _id: item.subCategory })
        : null,

      item.skills?.length
        ? db
            .collection("skills")
            .find({ _id: { $in: item.skills } })
            .toArray()
        : [],

      item.tools?.length
        ? db
            .collection("tools")
            .find({ _id: { $in: item.tools } })
            .toArray()
        : [],
    ]);

  // Related items: same subcategory first, then same category.
  const RELATED_LIMIT = 12;
  let related = [];

  if (item.subCategory) {
    const sameSub = await collection
      .find({
        isActive: true,
        _id: { $ne: item._id },
        subCategory: item.subCategory,
      })
      .sort({ updatedAt: -1 })
      .limit(RELATED_LIMIT)
      .toArray();

    related = sameSub.map((doc) => ({
      doc,
      topic: subCategory?.name || "",
    }));
  }

  if (related.length < RELATED_LIMIT && item.category) {
    const excludedIds = [
      item._id,
      ...related.map(({ doc }) => doc._id),
    ];

    const sameCategory = await collection
      .find({
        isActive: true,
        category: item.category,
        _id: { $nin: excludedIds },
      })
      .sort({ updatedAt: -1 })
      .limit(RELATED_LIMIT - related.length)
      .toArray();

    related = [
      ...related,
      ...sameCategory.map((doc) => ({
        doc,
        topic: category?.name || "",
      })),
    ];
  }

  const { intro, learn, sections } = buildSections(
    normBlocks(item.details?.blocks)
  );

  return {
    type: cfg.key,

    // Keep the "course" property for compatibility with
    // existing detail pages and PurchaseCard components.
    course: {
      id: String(item._id),
      type: cfg.key,
      name: item.name || cfg.label,
      slug: item.slug,
      href: `${cfg.itemPath}/${item.slug}`,
      image: item.image || "",
      hours: Number(item.hours ?? 0),
      level: item.level || "",
      pricingType: item.pricingType || "fixed",
      price: Number(item.price ?? 0),
      actualPrice: Number(
        item.actualPrice ?? item.price ?? 0
      ),
      discount: item.discount?.value
        ? {
            type: item.discount.type,
            value: Number(item.discount.value),
          }
        : null,
      seoTitle: item.seoTitle || "",
      seoDescription: item.seoDescription || "",
      createdAt: item.createdAt
        ? new Date(item.createdAt).toISOString()
        : null,
      updatedAt: item.updatedAt
        ? new Date(item.updatedAt).toISOString()
        : null,
    },

    category: category ? serializeOption(category) : null,
    subCategory: subCategory
      ? serializeOption(subCategory)
      : null,

    skills: skills.map(serializeOption),
    tools: tools.map(serializeOption),

    intro,
    learn,
    sections,

    related: related.map(({ doc, topic }) =>
      serializeRelated(doc, cfg, topic)
    ),
  };
}
