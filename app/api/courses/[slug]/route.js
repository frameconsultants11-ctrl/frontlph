import { NextResponse } from "next/server";
import { getTopCoursesData } from "@/lib/topCourses";

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const searchParams = Object.fromEntries(new URL(request.url).searchParams.entries());
    const data = await getTopCoursesData(slug, searchParams);

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
