import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request, { params }) {
  try {
    const { referralCode } = await params;

    if (!referralCode) {
      return NextResponse.redirect(
        new URL("/", request.url)
      );
    }

    const code = referralCode.toUpperCase();

    const client = await clientPromise;
    const db = client.db("learnPerHour");

    const user = await db.collection("users").findOne({
      referralCode: code,
    });

    // Invalid referral code
    if (!user) {
      return NextResponse.redirect(
        new URL("/", request.url)
      );
    }

    /*
     * Store referral code for 30 days
     */
    const response = NextResponse.redirect(
      new URL("/login", request.url)
    );

    response.cookies.set(
      "referral_code",
      code,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      }
    );

    return response;

  } catch (error) {
    console.error(
      "Referral route error:",
      error
    );

    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }
}