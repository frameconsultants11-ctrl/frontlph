import clientPromise from "@/lib/mongodb";
import { LISTING_TYPES, listingBasePath } from "@/lib/listingConfig";
import { categorySlug } from "@/lib/learnListing";

const ITEM_LIMIT = 5;
const CATEGORY_LIMIT = 5;

async function getTypeMenu(db, cfg) {
  const col = db.collection(cfg.collection);

  const [items, groups, total] = await Promise.all([
    col.find({ isActive: true }).sort({ updatedAt: -1 }).limit(ITEM_LIMIT).toArray(),
    col
      .aggregate([
        { $match: { isActive: true, category: { $ne: null } } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: CATEGORY_LIMIT },
      ])
      .toArray(),
    col.countDocuments({ isActive: true }),
  ]);

  const cats = groups.length
    ? await db
        .collection(cfg.categoryCollection)
        .find({ _id: { $in: groups.map((g) => g._id) }, isActive: true })
        .toArray()
    : [];
  const byId = new Map(cats.map((c) => [String(c._id), c]));

  return {
    label: cfg.labelPlural,
    viewAll: cfg.listPath,
    total,
    items: items.map((d) => ({
      id: String(d._id),
      name: d.name || cfg.label,
      href: `${cfg.itemPath}/${d.slug}`,
      description: String(d.seoDescription || "").slice(0, 140),
      image: d.image || "",
      level: d.level || "",
      hours: Number(d.hours ?? 0),
      actualPrice: Number(d.actualPrice ?? d.price ?? 0),
    })),
    categories: groups
      .map((g) => {
        const c = byId.get(String(g._id));
        if (!c) return null;
        return {
          id: String(c._id),
          name: c.name,
          count: g.count,
          href: listingBasePath(cfg, categorySlug(c)),
        };
      })
      .filter(Boolean),
  };
}

export async function getMenuData() {
  const client = await clientPromise;
  const db = client.db("learnPerHour");

  const entries = await Promise.all(
    Object.values(LISTING_TYPES).map(async (cfg) => {
      try {
        return [cfg.key, await getTypeMenu(db, cfg)];
      } catch (error) {
        console.error(`Menu data failed for ${cfg.key}:`, error);
        return [cfg.key, { label: cfg.labelPlural, viewAll: cfg.listPath, total: 0, items: [], categories: [] }];
      }
    })
  );
  return Object.fromEntries(entries);
}