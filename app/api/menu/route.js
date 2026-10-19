import { NextResponse } from "next/server";
import { getMenuData } from "@/lib/menuData";

export async function GET() {
  try {
    const data = await getMenuData();
    return NextResponse.json(
      { success: true, data },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
    );
  } catch (error) {
    console.error("Menu API error:", error);
    return NextResponse.json({ success: false, message: "Failed to load menu." }, { status: 500 });
  }
}