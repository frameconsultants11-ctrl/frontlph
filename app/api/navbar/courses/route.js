import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const DB_NAME = "learnPerHour";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const courses = await db
      .collection("courses")
      .find(
        {
          isActive: true,
        },
        {
          projection: {
            _id: 1,
            name: 1,
            image: 1,
            hours: 1,
            price: 1,
            discount: 1,
            actualPrice: 1,
            level: 1,
          },
        }
      )
      .limit(3)
      .toArray();

    return NextResponse.json({
      success: true,
      courses: courses.map((course) => ({
        id: course._id.toString(),
        image: course.image || "",
        name: course.name || "",
        hours: course.hours || 0,
        price: course.price || 0,
        actualPrice: course.actualPrice || course.price || 0,
        discount: course.discount?.value || 0,
        discountType: course.discount?.type || "",
        level: course.level || "",
      })),
    });
  } catch (error) {
    console.error("GET COURSES ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch courses",
      },
      {
        status: 500,
      }
    );
  }
}