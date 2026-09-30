import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
   
    const session = await auth();
    console.log(session)
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

    // --------------------------------
    // 2. Read request body
    // --------------------------------

    const body = await request.json();

    const password = body?.password;

    if (!password) {
      return NextResponse.json(
        {
          message: "Password is required",
        },
        {
          status: 400,
        }
      );
    }

    // --------------------------------
    // 3. Server-side validation
    // --------------------------------

    if (password.length < 8) {
      return NextResponse.json(
        {
          message:
            "Password must be at least 8 characters",
        },
        {
          status: 400,
        }
      );
    }

    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        {
          message:
            "Add at least one uppercase letter",
        },
        {
          status: 400,
        }
      );
    }

    if (!/[a-z]/.test(password)) {
      return NextResponse.json(
        {
          message:
            "Add at least one lowercase letter",
        },
        {
          status: 400,
        }
      );
    }

    if (!/\d/.test(password)) {
      return NextResponse.json(
        {
          message:
            "Add at least one number",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !/[!@#$%^&*(),.?":{}|<>_\-\\[\]~`+=;/']/.test(
        password
      )
    ) {
      return NextResponse.json(
        {
          message:
            "Add at least one special character",
        },
        {
          status: 400,
        }
      );
    }

    if (
      /012|123|234|345|456|567|678|789/.test(
        password
      )
    ) {
      return NextResponse.json(
        {
          message:
            "Password cannot contain consecutive numbers",
        },
        {
          status: 400,
        }
      );
    }

    // --------------------------------
    // 4. Connect MongoDB
    // --------------------------------

    const client = await clientPromise;

    const db = client.db("learnPerHour");

    // --------------------------------
    // 5. Find logged-in user
    // --------------------------------

    const user = await db
      .collection("users")
      .findOne(
        {
          _id: new ObjectId(session.user.id)
        },
        {
          projection: {
            _id: 1,
          },
        }
      );

    if (!user) {
      return NextResponse.json(
        {
          message: "User account not found",
        },
        {
          status: 404,
        }
      );
    }

    // --------------------------------
    // 6. Hash new password
    // --------------------------------

    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    // --------------------------------
    // 7. Update password
    // --------------------------------

    await db.collection("users").updateOne(
      {
        _id: new ObjectId(session.user.id)
      },
      {
        $set: {
          password: hashedPassword,
          passwordUpdatedAt: new Date(),
        },
      }
    );

    // --------------------------------
    // 8. Response
    // --------------------------------

    return NextResponse.json(
      {
        success: true,
        message:
          "Your password has been updated successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "PASSWORD_RESET_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to update password. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}