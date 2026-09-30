import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

export async function DELETE(
  request,
  { params }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { sessionId } = await params;

    if (!sessionId) {
      return NextResponse.json(
        {
          message:
            "Session ID is required",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ==========================================
     * PREVENT TERMINATING CURRENT SESSION
     * ==========================================
     */

    if (
      sessionId ===
      session.user.sessionId
    ) {
      return NextResponse.json(
        {
          message:
            "You cannot terminate your current session.",
        },
        {
          status: 400,
        }
      );
    }

    const client =
      await clientPromise;

    const db =
      client.db("learnPerHour");

    const userId =
      new ObjectId(session.user.id);

    /*
     * ==========================================
     * FIND ACTIVE SESSION
     * ==========================================
     */

    const existingSession =
      await db
        .collection("sessions")
        .findOne({
          sessionId,

          userId,

          active: true,
        });

    if (!existingSession) {
      return NextResponse.json(
        {
          message:
            "Session not found or already terminated.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * ==========================================
     * TERMINATE SESSION
     * ==========================================
     */

    const result =
      await db
        .collection("sessions")
        .updateOne(
          {
            sessionId,

            userId,

            active: true,
          },
          {
            $set: {
              active: false,

              terminatedAt:
                new Date(),
            },
          }
        );

    if (
      result.modifiedCount !== 1
    ) {
      return NextResponse.json(
        {
          message:
            "Unable to terminate session.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * ==========================================
     * DECREASE ACTIVE SESSION COUNT
     * ==========================================
     */

    await db
      .collection("users")
      .updateOne(
        {
          _id: userId,

          activeSessionCount: {
            $gt: 0,
          },
        },
        {
          $inc: {
            activeSessionCount: -1,
          },
        }
      );

    return NextResponse.json(
      {
        success: true,

        message:
          "Session terminated successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "TERMINATE_SESSION_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to terminate session.",
      },
      {
        status: 500,
      }
    );
  }
}