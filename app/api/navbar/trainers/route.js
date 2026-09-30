import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const DB_NAME = "learnPerHour";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const trainers = await db.collection("trainers").find(
      {
        isActive: true,
        isAvailable: true,
      },
      {
        projection: {
          _id: 1,
          name: 1,
          image: 1,
          hourlyRate: 1,
        },
      }
    )
    .limit(3)
    .toArray();

    return NextResponse.json({
      success: true,
      trainers: trainers.map((trainer) => ({
        id: trainer._id.toString(),
        image: trainer.image || "",
        name: trainer.name || "",
        price: trainer.hourlyRate || 0,
      })),
    });
  } catch (error) {
    console.error("GET TRAINERS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch trainers",
      },
      {
        status: 500,
      }
    );
  }
}