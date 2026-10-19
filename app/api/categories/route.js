
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";


export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("learnPerHour");

    const categories = await db
      .collection("categories")
      .find({ isActive: true })
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: categories.map((category) => ({
        _id: category._id.toString(),
        name: category.name,
        image: category.image || "",
      })),
    });
  } catch (error) {
    console.error("Categories API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load categories",
      },
      { status: 500 }
    );
  }
}
