import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getProfile } from "@/lib/profile";
import ProfileForm from "@/component/profile/ProfileForm";


export const dynamic = "force-dynamic";
export const metadata = { title: "My profile | Learn Per Hour", robots: { index: false, follow: false } };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/auth");

  const profile = await getProfile(session.user.email);
  if (!profile) redirect("/auth");

  return (
    <main className="min-h-screen bg-[#fafafa] px-4 pb-16 pt-24 font-sans sm:px-6">
      <div className="mx-auto max-w-4xl">
        <ProfileForm initialUser={profile.user} options={profile.options} />
      </div>
    </main>
  );
}