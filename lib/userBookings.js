import clientPromise from "@/lib/mongodb";
import { LISTING_TYPES } from "@/lib/listingConfig";

const DB = "learnPerHour";
const iso = (d) => (d ? new Date(d).toISOString() : null);

/* every booking of the signed-in user, with item + trainer joined */
export async function getUserBookings(email) {
  if (!email) return null;

  const db = (await clientPromise).db(DB);
  const user = await db
    .collection("users")
    .findOne({ email: String(email).toLowerCase() }, { projection: { _id: 1 } });
  if (!user) return null;

  const bookings = await db
    .collection("bookings")
    .find({ userId: user._id })
    .sort({ createdAt: -1 })
    .limit(200)
    .toArray();

  /* items: one query per listing type */
  const idsByType = {};
  for (const b of bookings) {
    if (!LISTING_TYPES[b.listingType]) continue;
    (idsByType[b.listingType] ||= []).push(b.courseId);
  }

  const itemMap = new Map();
  await Promise.all(
    Object.entries(idsByType).map(async ([type, ids]) => {
      const docs = await db
        .collection(LISTING_TYPES[type].collection)
        .find({ _id: { $in: ids } })
        .project({ name: 1, slug: 1, image: 1, level: 1, isActive: 1 })
        .toArray();
      for (const d of docs) itemMap.set(`${type}:${d._id}`, d);
    })
  );

  /* trainers: name and photo only */
  const trainerIds = bookings.filter((b) => b.trainerId).map((b) => b.trainerId);
  const trainers = trainerIds.length
    ? await db.collection("trainers").find({ _id: { $in: trainerIds } }).project({ name: 1, image: 1 }).toArray()
    : [];
  const trainerMap = new Map(trainers.map((t) => [String(t._id), t]));

  return bookings.map((b) => {
    const cfg = LISTING_TYPES[b.listingType];
    const item = itemMap.get(`${b.listingType}:${b.courseId}`);
    const trainer = b.trainerId ? trainerMap.get(String(b.trainerId)) : null;
    const slug = item?.slug || b.courseSlug;

    return {
      id: String(b._id),
      status: b.status || "pending",
      bookingType: b.bookingType || "",
      listingType: b.listingType || "",
      typeLabel: cfg?.label || "Item",
      itemName: item?.name || b.courseName || "Learning item",
      itemImage: item?.image || "",
      itemLevel: item?.level || "",
      itemHref: cfg && item && item.isActive !== false && slug ? `${cfg.itemPath}/${slug}` : null,
      phone: b.phone || "",
      hours: Number(b.hours ?? 0),
      price: Number(b.price ?? 0),
      actualPrice: Number(b.actualPrice ?? b.price ?? 0),
      clarityCallAt: iso(b.clarityCallAt),
      meetingLink: b.meetingLink || "",
      trainer: trainer ? { name: trainer.name || "Your trainer", image: trainer.image || "" } : null,
      createdAt: iso(b.createdAt),
      updatedAt: iso(b.updatedAt),
    };
  });
}