
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

const DB_NAME = 'learnPerHour';

function toArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function getId(value) {
  if (!value) return null;

  if (typeof value === "object") {
    return value._id?.toString?.() || value.id?.toString?.() || null;
  }

  return String(value);
}

function getName(value) {
  if (!value) return "";

  if (typeof value === "object") {
    return value.name || value.title || "";
  }

  return "";
}

function getSlug(item) {
  return (
    item.slug ||
    item.seoSlug ||
    item.permalink ||
    item._id.toString()
  );
}

function serialize(item) {
  return JSON.parse(
    JSON.stringify(item, (_, value) =>
      value?._bsontype === "ObjectId" ? value.toString() : value
    )
  );
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 6, 1),
      24
    );

    const client = await clientPromise;
    const db = DB_NAME
      ? client.db(DB_NAME)
      : client.db();

    const certificationsCollection = db.collection("certificationLearn");

    const certifications = await certificationsCollection
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    const categoryIds = new Set();
    const subCategoryIds = new Set();
    const skillIds = new Set();
    const toolIds = new Set();

    for (const item of certifications) {
      for (const value of toArray(item.category || item.categories)) {
        const id = getId(value);
        if (id) categoryIds.add(id);
      }

      for (const value of toArray(
        item.subCategory || item.subcategory || item.subCategories
      )) {
        const id = getId(value);
        if (id) subCategoryIds.add(id);
      }

      for (const value of toArray(item.skills || item.skill)) {
        const id = getId(value);
        if (id) skillIds.add(id);
      }

      for (const value of toArray(item.tools || item.tool)) {
        const id = getId(value);
        if (id) toolIds.add(id);
      }
    }

    const findReferenced = async (collectionName, ids) => {
      if (!ids.size) return [];

      const { ObjectId } = await import("mongodb");

      const objectIds = [...ids]
        .filter((id) => ObjectId.isValid(id))
        .map((id) => new ObjectId(id));

      const stringIds = [...ids];

      return db.collection(collectionName).find({
        $or: [
          { _id: { $in: objectIds } },
          { _id: { $in: stringIds } },
        ],
      }).toArray();
    };

    const [categories, subcategories, skills, tools] = await Promise.all([
      findReferenced("categories", categoryIds),
      findReferenced("subcategories", subCategoryIds),
      findReferenced("skills", skillIds),
      findReferenced("toolsLearn", toolIds),
    ]);

    const categoryMap = new Map(
      categories.map((item) => [item._id.toString(), serialize(item)])
    );

    const subcategoryMap = new Map(
      subcategories.map((item) => [item._id.toString(), serialize(item)])
    );

    const skillMap = new Map(
      skills.map((item) => [item._id.toString(), serialize(item)])
    );

    const toolMap = new Map(
      tools.map((item) => [item._id.toString(), serialize(item)])
    );

    const resolveValues = (value, map) =>
      toArray(value).map((entry) => {
        const id = getId(entry);
        return (id && map.get(id)) || entry;
      });

    const data = certifications.map((item) => {
      const categoryValues = resolveValues(
        item.category || item.categories,
        categoryMap
      );

      const subcategoryValues = resolveValues(
        item.subCategory || item.subcategory || item.subCategories,
        subcategoryMap
      );

      const skillValues = resolveValues(
        item.skills || item.skill,
        skillMap
      );

      const toolValues = resolveValues(
        item.tools || item.tool,
        toolMap
      );

      const category = categoryValues[0] || null;

      return {
        id: item._id.toString(),
        name: item.name || item.title || "Certification",
        slug: getSlug(item),
        href: `/certifications/${getSlug(item)}`,
        image:
          item.image ||
          item.thumbnail ||
          item.coverImage ||
          category?.image ||
          skillValues[0]?.image ||
          toolValues[0]?.image ||
          null,
        description:
          item.shortDescription ||
          item.description ||
          item.excerpt ||
          "",
        duration:
          item.duration ||
          item.hours ||
          item.totalHours ||
          item.estimatedDuration ||
          "",
        level: item.level || item.difficulty || "",
        price: item.price ?? item.originalPrice ?? 0,
        actualPrice:
          item.actualPrice ??
          item.discountPrice ??
          item.price ??
          item.originalPrice ??
          0,
        rating: item.rating ?? null,
        reviewCount: item.reviewCount ?? item.reviewsCount ?? 0,
        category: category
          ? { id: getId(category), name: getName(category) }
          : null,
        subcategories: subcategoryValues.map((value) => ({
          id: getId(value),
          name: getName(value),
        })),
        skills: skillValues.map((value) => ({
          id: getId(value),
          name: getName(value),
          image: value?.image || null,
        })),
        tools: toolValues.map((value) => ({
          id: getId(value),
          name: getName(value),
          image: value?.image || null,
        })),
      };
    });

    return NextResponse.json(
      { success: true, count: data.length, data },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("Certifications API error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to load certifications." },
      { status: 500 }
    );
  }
}
