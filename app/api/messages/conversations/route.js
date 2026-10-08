import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

const DB_NAME = "learnPerHour";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const userId = session.user.id;

    const client = await clientPromise;

    const db = client.db(DB_NAME);

    const senderId = ObjectId.isValid(userId)
      ? new ObjectId(userId)
      : userId;

    const messages = await db
      .collection("messages")
      .find({
        senderId,
      })
      .sort({
        createdAt: -1,
      })
      .toArray();

    if (!messages.length) {
      return NextResponse.json({
        success: true,
        conversations: [],
      });
    }

    const trainerIds = [
      ...new Map(
        messages.map((message) => [
          message.trainerId?.toString(),
          message.trainerId,
        ])
      ).values(),
    ].filter(Boolean);

    const trainers = await db
      .collection("trainers")
      .find({
        _id: {
          $in: trainerIds,
        },
      })
      .project({
        name: 1,
        image: 1,
        email: 1,
        about: 1,
        hourlyRate: 1,
        isActive: 1,
      })
      .toArray();

    const trainerMap = new Map(
      trainers.map((trainer) => [
        trainer._id.toString(),
        trainer,
      ])
    );

    const conversationMap =
      new Map();

    for (const message of messages) {
      const trainerId =
        message.trainerId?.toString();

      if (!trainerId) continue;

      if (
        conversationMap.has(trainerId)
      ) {
        continue;
      }

      const trainer =
        trainerMap.get(trainerId);

      if (!trainer) continue;

      conversationMap.set(trainerId, {
        id: trainerId,
        name: trainer.name || "Trainer",
        image: trainer.image || "",
        email: trainer.email || "",
        about: trainer.about || "",
        hourlyRate:
          trainer.hourlyRate || 0,
        lastMessage:
          message.message || "",
        updatedAt:
          message.createdAt || null,
        unreadCount: 0,
      });
    }

    return NextResponse.json({
      success: true,
      conversations: [
        ...conversationMap.values(),
      ],
    });
  } catch (error) {
    console.error(
      "Get conversations error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load conversations.",
      },
      {
        status: 500,
      }
    );
  }
}