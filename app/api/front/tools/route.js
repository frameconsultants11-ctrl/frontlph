
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const revalidate = 300;

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('learnPerHour');

    const tools = await db
      .collection("tools")
      .find({ isActive: true })
      .sort({ name: 1 })
      .limit(24)
      .project({
        name: 1,
        image: 1,
        slug: 1,
        description: 1,
      })
      .toArray();

    const data = tools.map((tool) => {
      const slug =
        tool.slug ||
        tool.name
          ?.trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") ||
        tool._id.toString();

      return {
        id: tool._id.toString(),
        name: tool.name || "Tool",
        image: tool.image || "",
        description: tool.description || "",
        slug,
        href: `/tools/${slug}`,
      };
    });

    return NextResponse.json(
      { success: true, count: data.length, data },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("Tools API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load tools.",
      },
      { status: 500 }
    );
  }
}
