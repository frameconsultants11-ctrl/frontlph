import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { DB, getOptions, getProfile, serializeUser, validateProfile } from "@/lib/profile";

const noStore = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Please sign in." }, { status: 401 });
    }
    const profile = await getProfile(session.user.email);
    if (!profile) return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
    return NextResponse.json({ success: true, ...profile }, { headers: noStore });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ success: false, message: "Failed to load profile." }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Please sign in." }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: "Invalid request." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB);
    const options = await getOptions(db);
    const result = validateProfile(body, new Set(options.map((o) => o.key)));
    if (result.error) {
      return NextResponse.json({ success: false, message: result.error }, { status: 400 });
    }

    // email, role, password, provider... are never taken from the request
    const updated = await db.collection("users").findOneAndUpdate(
      { email: session.user.email.toLowerCase() },
      { $set: { ...result.data, updatedAt: new Date() } },
      { returnDocument: "after" }
    );
    const doc = updated?.value ?? updated; // works with both driver versions
    if (!doc?._id) return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });

    return NextResponse.json({ success: true, user: serializeUser(doc) }, { headers: noStore });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ success: false, message: "Failed to save profile." }, { status: 500 });
  }
}