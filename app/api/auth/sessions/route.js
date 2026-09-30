import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

export async function GET() {
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

    const client = await clientPromise;
    const db = client.db("learnPerHour");

    const userId = new ObjectId(
      session.user.id
    );

    const sessions = await db
      .collection("sessions")
      .find({
        userId,
        active: true,
      })
      .sort({
        lastActiveAt: -1,
      })
      .toArray();

    return NextResponse.json(
      {
        success: true,

        sessions: sessions.map((item) => ({
          id: item.sessionId,

          device:
            getDeviceName(item.userAgent),

          type:
            getDeviceType(item.userAgent),

          location:
            item.location || "Unknown location",

          ip:
            maskIp(item.ipAddress),

          loginTime:
            item.createdAt,

          lastActiveAt:
            item.lastActiveAt,

          current:
            item.sessionId ===
            session.user.sessionId,
        })),
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "GET_SESSIONS_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to load active sessions",
      },
      {
        status: 500,
      }
    );
  }
}

/* ==========================================
   DEVICE NAME
========================================== */

function getDeviceName(userAgent = "") {
  if (/iPhone/i.test(userAgent)) {
    return "Safari on iPhone";
  }

  if (/Android/i.test(userAgent)) {
    if (/Chrome/i.test(userAgent)) {
      return "Chrome on Android";
    }

    return "Android device";
  }

  if (/Windows/i.test(userAgent)) {
    if (/Chrome/i.test(userAgent)) {
      return "Chrome on Windows";
    }

    if (/Firefox/i.test(userAgent)) {
      return "Firefox on Windows";
    }

    if (/Edge/i.test(userAgent)) {
      return "Edge on Windows";
    }

    return "Windows device";
  }

  if (/Macintosh/i.test(userAgent)) {
    if (/Chrome/i.test(userAgent)) {
      return "Chrome on Mac";
    }

    if (/Safari/i.test(userAgent)) {
      return "Safari on Mac";
    }

    return "Mac device";
  }

  return "Unknown device";
}

/* ==========================================
   DEVICE TYPE
========================================== */

function getDeviceType(userAgent = "") {
  if (
    /Mobile|Android|iPhone|iPad/i.test(
      userAgent
    )
  ) {
    return "mobile";
  }

  return "desktop";
}

/* ==========================================
   MASK IP
========================================== */

function maskIp(ip) {
  if (!ip || ip === "Unknown") {
    return "Unknown";
  }

  const parts = ip.split(".");

  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.***.***`;
  }

  return ip;
}