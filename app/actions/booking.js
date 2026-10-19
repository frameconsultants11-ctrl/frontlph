
"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import clientPromise from "@/lib/mongodb";
import { toId } from "@/lib/bookings";
import { getListingConfig } from "@/lib/listingConfig";
import { auth } from "@/lib/auth";

export async function bookFreeSession(
  _prevState,
  formData
) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth");
  }

  // Read the listing type from the form.
  const type = String(
    formData.get("type") || "courses"
  )
    .trim()
    .toLowerCase();

  const cfg = getListingConfig(type);

  if (!cfg) {
    return {
      status: "error",
      message: "Invalid listing type.",
    };
  }

  const itemId = toId(formData.get("courseId"));
  const phoneInput = String(
    formData.get("phone") || ""
  ).trim();

  if (!itemId) {
    return {
      status: "error",
      message: `Invalid ${cfg.label.toLowerCase()}.`,
    };
  }

  try {
    const db = (await clientPromise).db("learnPerHour");

    const users = db.collection("users");
    const bookings = db.collection("bookings");

    const userObjectId = toId(session.user.id);

    const userQuery = userObjectId
      ? { _id: userObjectId }
      : { _id: session.user.id };

    // Always use the authenticated user's database record.
    const user = await users.findOne(userQuery);

    if (!user) {
      return {
        status: "error",
        message:
          "Your account could not be found. Please sign in again.",
      };
    }

    // Support either mobile or phone in the users collection.
    const existingPhone = String(
      user.mobile || user.phone || ""
    ).trim();

    if (!existingPhone && !phoneInput) {
      return {
        status: "needs_phone",
        message:
          "Please enter your phone number to book your free session.",
      };
    }

    const phone = existingPhone || phoneInput;
    const normalizedPhone = phone.replace(/[\s()-]/g, "");

    const validIndianPhone =
      /^(?:\+91)?[6-9]\d{9}$/.test(normalizedPhone);

    if (!existingPhone && !validIndianPhone) {
      return {
        status: "error",
        message:
          "Enter a valid 10-digit Indian mobile number.",
      };
    }

    // Dynamically select the collection from listingConfig.js.
    const item = await db.collection(cfg.collection).findOne(
      {
        _id: itemId,
        isActive: true,
      },
      {
        projection: {
          name: 1,
          slug: 1,
          hours: 1,
          price: 1,
          actualPrice: 1,
        },
      }
    );

    if (!item) {
      return {
        status: "error",
        message: `This ${cfg.label.toLowerCase()} is unavailable.`,
      };
    }

    // Save the phone only when neither field already contains one.
    if (!existingPhone) {
      await users.updateOne(
        {
          _id: user._id,
          $and: [
            {
              $or: [
                { mobile: { $exists: false } },
                { mobile: "" },
                { mobile: null },
              ],
            },
            {
              $or: [
                { phone: { $exists: false } },
                { phone: "" },
                { phone: null },
              ],
            },
          ],
        },
        {
          $set: {
            phone: normalizedPhone,
            updatedAt: new Date(),
          },
        }
      );

      const updatedUser = await users.findOne(
        { _id: user._id },
        {
          projection: {
            mobile: 1,
            phone: 1,
          },
        }
      );

      if (!(updatedUser?.mobile || updatedUser?.phone)) {
        return {
          status: "error",
          message:
            "Could not save your phone number. Please try again.",
        };
      }
    }

    const now = new Date();

    // Keep free-session requests distinct by item and listing type.
    const bookingType = "free_session";

    const existingBooking = await bookings.findOne({
      userId: user._id,
      courseId: itemId,
      listingType: cfg.key,
      bookingType,
      status: { $ne: "cancelled" },
    });

    if (existingBooking) {
      return {
        status: "success",
        message:
          `You've already requested a free session for this ${cfg.label.toLowerCase()}.`,
      };
    }

    await bookings.insertOne({
      userId: user._id,

      // Retain courseId to avoid breaking existing booking consumers.
      courseId: itemId,
      courseSlug: item.slug,
      courseName: item.name,

      // Identify which listing collection this booking belongs to.
      listingType: cfg.key,
      bookingType,

      phone: existingPhone || normalizedPhone,

      hours: Number(item.hours ?? 0),
      price: Number(item.price ?? 0),
      actualPrice: Number(
        item.actualPrice ?? item.price ?? 0
      ),

      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    // Revalidate the detail page for the selected listing.
    revalidatePath(`${cfg.itemPath}/${item.slug}`);

    return {
      status: "success",
      message: "Your free session request has been received!",
    };
  } catch (error) {
    console.error("bookFreeSession error:", error);

    return {
      status: "error",
      message: "Could not book your session. Please try again.",
    };
  }
}
