import { NextResponse } from "next/server";

export function proxy(request) {
  const response = NextResponse.next();

  const referralCode = request.nextUrl.searchParams.get("ref");
  if (!referralCode) {
    return response;
  }

  // Don't overwrite an existing referral
  const existingReferral = request.cookies.get("referral_code");

  if (existingReferral?.value) {
    return response;
  }

  response.cookies.set("referral_code", referralCode, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}

export const config = {
  matcher: [
    "/one-on-one-mentorship/:path*",
    "/trainer/:path*",
  ],
};