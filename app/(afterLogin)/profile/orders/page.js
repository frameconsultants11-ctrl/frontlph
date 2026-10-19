import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserBookings } from "@/lib/userBookings";
import MyBookings from "@/component/MyBookings";

export const dynamic = "force-dynamic";
export const metadata = { title: "My bookings | Learn Per Hour", robots: { index: false, follow: false } };

export default async function MyBookingsPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/auth");

  const bookings = await getUserBookings(session.user.email);
  if (!bookings) redirect("/auth");

  return (
    <main className="min-h-screen bg-[#fafafa] px-4 pb-16 pt-24 font-sans sm:px-6">
      <div className="mx-auto max-w-4xl">
        <MyBookings initialBookings={bookings} />
      </div>
    </main>
  );
}