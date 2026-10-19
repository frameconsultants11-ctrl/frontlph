import { NextResponse } from "next/server";
import { getListingConfig } from "@/lib/listingConfig";
import { getListingData } from "@/lib/learnListing";

export async function GET(request, { params }) {
  try {
    const { type, slug: rawSlug } = (await params) || {};
    if (!getListingConfig(type)) {
      return NextResponse.json({ success: false, message: "Unknown listing type." }, { status: 404 });
    }
    const slug = (Array.isArray(rawSlug) ? rawSlug[0] : rawSlug) || "";
    const searchParams = Object.fromEntries(new URL(request.url).searchParams.entries());
    const data = await getListingData(type, slug, searchParams);

    if (!data.category) {
      return NextResponse.json({ success: false, message: "Category not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, data }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Listing API error:", error);
    return NextResponse.json({ success: false, message: "Failed to load data." }, { status: 500 });
  }
}