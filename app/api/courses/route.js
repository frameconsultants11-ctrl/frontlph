import { NextResponse } from "next/server";
import { getTopCoursesData } from "@/lib/topCourses";

export async function GET(request, { params }) {
  try {
    // params may be empty/undefined when the route has no slug
    const { slug: rawSlug } = (await params) || {};
    const slug = (Array.isArray(rawSlug) ? rawSlug[0] : rawSlug) || "";

    const searchParams = Object.fromEntries(new URL(request.url).searchParams.entries());
    const data = await getTopCoursesData(slug, searchParams);

    // A 404 only makes sense when a slug was given but didn't match a category.
    // With no slug, the lib returns the full data set with isAll: true.
    if (!data.category) {
      return NextResponse.json(
        { success: false, message: "Course category not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Top courses API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load courses." },
      { status: 500 }
    );
  }
}