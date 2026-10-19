import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserBookings } from "@/lib/userBookings";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Please sign in." }, { status: 401 });
    }

    const bookings = await getUserBookings(session.user.email);
    if (!bookings) {
      return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, bookings }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("User bookings GET error:", error);
    return NextResponse.json({ success: false, message: "Failed to load bookings." }, { status: 500 });
  }
}