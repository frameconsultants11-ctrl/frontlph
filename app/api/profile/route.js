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
        { status: 401 }
      );
    }

    let userId;

    try {
      userId = new ObjectId(session.user.id);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user ID",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const user = await db.collection("users").findOne(
      { _id: userId },
      {
        projection: {
          password: 0,
          passwordUpdatedAt: 0,
          activeSessionCount: 0,
        },
      }
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),

        name: user.name || "",
        email: user.email || "",
        image: user.image || "",
        mobile: user.mobile || "",

        provider: user.provider || "",
        role: user.role || "user",

        referralCode: user.referralCode || "",

        education: Array.isArray(user.education)
          ? user.education
          : [],

        workExperience: Array.isArray(
          user.workExperience
        )
          ? user.workExperience
          : [],

        skills: Array.isArray(user.skills)
          ? user.skills
          : [],

        interestedInLearning: Array.isArray(
          user.interestedInLearning
        )
          ? user.interestedInLearning
          : [],

        createdAt: user.createdAt || null,
        updatedAt: user.updatedAt || null,
        lastLogin: user.lastLogin || null,
      },
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch profile",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    let userId;

    try {
      userId = new ObjectId(session.user.id);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const {
      name,
      mobile,
      education,
      workExperience,
      skills,
      interestedInLearning,
    } = body;

    /*
     * Basic validation
     */

    if (
      name !== undefined &&
      typeof name !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid name",
        },
        { status: 400 }
      );
    }

    if (
      mobile !== undefined &&
      typeof mobile !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid mobile number",
        },
        { status: 400 }
      );
    }

    if (
      education !== undefined &&
      !Array.isArray(education)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Education must be an array",
        },
        { status: 400 }
      );
    }

    if (
      workExperience !== undefined &&
      !Array.isArray(workExperience)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Work experience must be an array",
        },
        { status: 400 }
      );
    }

    if (
      skills !== undefined &&
      !Array.isArray(skills)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Skills must be an array",
        },
        { status: 400 }
      );
    }

    if (
      interestedInLearning !== undefined &&
      !Array.isArray(interestedInLearning)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Interested in learning must be an array",
        },
        { status: 400 }
      );
    }

    /*
     * Build update
     */

    const update = {
      updatedAt: new Date(),
    };

    if (name !== undefined) {
      update.name = name.trim();
    }

    if (mobile !== undefined) {
      update.mobile = mobile.trim();
    }

    if (education !== undefined) {
      update.education = education.map(
        (item) => ({
          degreeId: item.degreeId || "",
          degreeName: item.degreeName || "",

          collegeId: item.collegeId || "",
          collegeName: item.collegeName || "",

          startYear: item.startYear
            ? Number(item.startYear)
            : null,

          endYear: item.endYear
            ? Number(item.endYear)
            : null,
        })
      );
    }

    if (workExperience !== undefined) {
      update.workExperience =
        workExperience.map((item) => ({
          jobTitle: item.jobTitle?.trim() || "",
          company: item.company?.trim() || "",

          startYear: item.startYear
            ? Number(item.startYear)
            : null,

          endYear:
            item.endYear !== undefined &&
            item.endYear !== null &&
            item.endYear !== ""
              ? Number(item.endYear)
              : null,

          currentlyWorking:
            Boolean(item.currentlyWorking),
        }));
    }

    if (skills !== undefined) {
      update.skills = normalizeOptions(skills);
    }

    if (interestedInLearning !== undefined) {
      update.interestedInLearning =
        normalizeOptions(interestedInLearning);
    }

    /*
     * Update
     */

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const result = await db
      .collection("users")
      .updateOne(
        { _id: userId },
        {
          $set: update,
        }
      );

    if (result.matchedCount !== 1) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    /*
     * Return updated profile
     */

    const updatedUser = await db
      .collection("users")
      .findOne(
        { _id: userId },
        {
          projection: {
            password: 0,
            passwordUpdatedAt: 0,
            activeSessionCount: 0,
          },
        }
      );

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",

      user: {
        id: updatedUser._id.toString(),

        name: updatedUser.name || "",
        email: updatedUser.email || "",
        image: updatedUser.image || "",
        mobile: updatedUser.mobile || "",

        provider: updatedUser.provider || "",
        role: updatedUser.role || "user",

        referralCode:
          updatedUser.referralCode || "",

        education: updatedUser.education || [],

        workExperience:
          updatedUser.workExperience || [],

        skills: updatedUser.skills || [],

        interestedInLearning:
          updatedUser.interestedInLearning || [],

        createdAt: updatedUser.createdAt || null,
        updatedAt: updatedUser.updatedAt || null,
        lastLogin: updatedUser.lastLogin || null,
      },
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update profile",
      },
      { status: 500 }
    );
  }
}

/**
 * Keep only the fields we want to store
 * for searchable options.
 */
function normalizeOptions(items) {
  return items
    .filter(
      (item) =>
        item &&
        typeof item === "object" &&
        item.id &&
        item.name
    )
    .map((item) => ({
      id: String(item.id),
      name: String(item.name).trim(),
    }))
    .filter(
      (item, index, array) =>
        array.findIndex(
          (x) => x.id === item.id
        ) === index
    );
}