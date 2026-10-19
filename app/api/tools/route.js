
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const categoryId = searchParams.get("category");
    const limitParam = Number(searchParams.get("limit") || 0);

    if (!categoryId || !ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid category ID is required",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("learnPerHour");

    const query = {
      category: new ObjectId(categoryId),
      isActive: true,
    };

    let cursor = db
      .collection("courses")
      .find(query)
      .sort({ createdAt: -1 });

    if (Number.isInteger(limitParam) && limitParam > 0) {
      cursor = cursor.limit(Math.min(limitParam, 50));
    }

    const tools = await cursor.toArray();

    return NextResponse.json({
      success: true,
      data: tools.map((tool) => ({
        _id: tool._id.toString(),
        name: tool.name,
        category: tool.category.toString(),
        image: tool.image || "",
        slug:tool.slug || "",
        level: tool.level || "All levels",
        pricingType: tool.pricingType || "hourly",
        price: tool.price ?? null,
        actualPrice: tool.actualPrice ?? null,
        discount: tool.discount || null,
        seoTitle: tool.seoTitle || "",
        seoDescription: tool.seoDescription || "",
        details: tool.details || null,
      })),
    });
  } catch (error) {
    console.error("Tools API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load tools",
      },
      { status: 500 }
    );
  }
}
