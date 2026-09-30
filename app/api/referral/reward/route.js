import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

const REFERRER_REWARD = 100;
const REFERRED_USER_REWARD = 100;

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
        },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db("learnPerHour");

    const referrals = db.collection("referrals");
    const wallets = db.collection("wallets");
    const walletTransactions =
      db.collection("wallet_transactions");

    const referredUserObjectId = new ObjectId(
      session.user.id
    );

    /*
     * Find referral for logged-in user
     */
    const referral = await referrals.findOne({
      referredUserId: referredUserObjectId,
    });

    if (!referral) {
      return NextResponse.json({
        success: false,
        message: "No referral found",
      });
    }

    /*
     * Prevent duplicate reward
     */
    if (referral.status === "REWARDED") {
      return NextResponse.json({
        success: true,
        message: "Referral already rewarded",
      });
    }

    /*
     * Only reward pending referrals
     */
    if (referral.status !== "PENDING") {
      return NextResponse.json({
        success: false,
        message: "Invalid referral status",
      });
    }

    const now = new Date();

    /*
     * ==========================================
     * REFERRER +100
     * ==========================================
     */

    await wallets.updateOne(
      {
        userId: referral.referrerId,
      },
      {
        $inc: {
          balance: REFERRER_REWARD,
        },
        $set: {
          updatedAt: now,
        },
      }
    );

    /*
     * ==========================================
     * REFERRED USER +100
     * ==========================================
     */

    await wallets.updateOne(
      {
        userId: referredUserObjectId,
      },
      {
        $inc: {
          balance: REFERRED_USER_REWARD,
        },
        $set: {
          updatedAt: now,
        },
      }
    );

    /*
     * ==========================================
     * TRANSACTION - REFERRER
     * ==========================================
     */

    await walletTransactions.insertOne({
      userId: referral.referrerId,

      type: "REFERRAL_REWARD",

      amount: REFERRER_REWARD,

      direction: "CREDIT",

      referralId: referral._id,

      description:
        "Referral reward - 100 points",

      createdAt: now,
    });

    /*
     * ==========================================
     * TRANSACTION - REFERRED USER
     * ==========================================
     */

    await walletTransactions.insertOne({
      userId: referredUserObjectId,

      type: "REFERRAL_REWARD",

      amount: REFERRED_USER_REWARD,

      direction: "CREDIT",

      referralId: referral._id,

      description:
        "Referral signup reward - 100 points",

      createdAt: now,
    });

    /*
     * ==========================================
     * MARK REFERRAL REWARDED
     * ==========================================
     */

    const updateResult =
      await referrals.updateOne(
        {
          _id: referral._id,
          status: "PENDING",
        },
        {
          $set: {
            status: "REWARDED",
            rewardedAt: now,
            updatedAt: now,
          },
        }
      );

    /*
     * Make sure referral was actually updated
     */
    if (updateResult.modifiedCount !== 1) {
      return NextResponse.json({
        success: false,
        message:
          "Referral was already processed",
      });
    }

    return NextResponse.json({
      success: true,

      message:
        "Referral rewards added successfully",

      rewards: {
        referrer: REFERRER_REWARD,
        referredUser:
          REFERRED_USER_REWARD,
      },
    });

  } catch (error) {
    console.error(
      "Referral reward error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to reward referral",
        error: error.message,
      },
      { status: 500 }
    );
  }
}