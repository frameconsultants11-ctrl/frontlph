// Path: lib/bookings.js

import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export const toId = (value) => (value && ObjectId.isValid(String(value)) ? new ObjectId(String(value)) : null);

// true when this user already has a live (not cancelled) booking for the course
export async function hasActiveBooking(userId, courseId) {
  const course = toId(courseId);
  if (!userId || !course) return false;
  const db = (await clientPromise).db("learnPerHour");
  const found = await db
    .collection("bookings")
    .findOne({ userId: toId(userId) || String(userId), courseId: course, status: { $ne: "cancelled" } }, { projection: { _id: 1 } });
  return Boolean(found);
}