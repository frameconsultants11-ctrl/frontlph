"use server";

import { cookies } from "next/headers";

export async function saveReferralCode(referralCode) {
  if (!referralCode) {
    return {
      success: false,
      message: "No referral code",
    };
  }

  const cookieStore = await cookies();

  // Don't overwrite an existing referral
  const existingReferral = cookieStore.get("referral_code");

  if (existingReferral?.value) {
    return {
      success: true,
      message: "Referral already exists",
    };
  }

  cookieStore.set("referral_code", referralCode, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return {
    success: true,
  };
}