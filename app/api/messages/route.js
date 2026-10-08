import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

const DB_NAME = "learnPerHour";

/* =========================================================
   GET MESSAGES
========================================================= */

export async function GET(request) {
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

    const { searchParams } =
      new URL(request.url);

    const trainerId =
      searchParams.get("trainerId");

    if (!trainerId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Trainer ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!ObjectId.isValid(trainerId)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid trainer ID.",
        },
        {
          status: 400,
        }
      );
    }

    const client =
      await clientPromise;

    const db = client.db(DB_NAME);

    const userId = ObjectId.isValid(
      session.user.id
    )
      ? new ObjectId(session.user.id)
      : session.user.id;

    const trainerObjectId =
      new ObjectId(trainerId);

    const messages = await db
      .collection("messages")
      .find({
        senderId: userId,
        trainerId: trainerObjectId,
      })
      .sort({
        createdAt: 1,
      })
      .toArray();

    return NextResponse.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error(
      "Get messages error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load messages.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   POST MESSAGE
========================================================= */

export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please login to send a message.",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await request.json();

    const trainerId =
      body?.trainerId;

    const message =
      typeof body?.message ===
      "string"
        ? body.message.trim()
        : "";

    if (!trainerId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Trainer ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!ObjectId.isValid(trainerId)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid trainer ID.",
        },
        {
          status: 400,
        }
      );
    }

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Message is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Message cannot exceed 1000 characters.",
        },
        {
          status: 400,
        }
      );
    }

    const client =
      await clientPromise;

    const db = client.db(DB_NAME);

    const trainerObjectId =
      new ObjectId(trainerId);

    const trainer =
      await db
        .collection("trainers")
        .findOne({
          _id: trainerObjectId,
          isActive: true,
        });

    if (!trainer) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Trainer not found.",
        },
        {
          status: 404,
        }
      );
    }

    const userId =
      ObjectId.isValid(
        session.user.id
      )
        ? new ObjectId(
            session.user.id
          )
        : session.user.id;

    const now = new Date();

    const document = {
      senderId: userId,

      senderType: "user",

      senderName:
        session.user.name || "",

      senderEmail:
        session.user.email || "",

      senderMobile:
        session.user.mobile || "",

      trainerId:
        trainerObjectId,

      trainerName:
        trainer.name || "",

      trainerEmail:
        trainer.email || "",

      message,

      status: "sent",

      readByTrainer: false,

      createdAt: now,

      updatedAt: now,
    };

    const result =
      await db
        .collection("messages")
        .insertOne(document);

    return NextResponse.json(
      {
        success: true,
        message:
          "Message sent successfully.",
        data: {
          id: result.insertedId.toString(),
          trainerId,
          trainerName:
            trainer.name || "",
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Send message error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to send message.",
      },
      {
        status: 500,
      }
    );
  }
}