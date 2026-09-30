import LogoutButton from "@/component/LogoutButton";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
if(!session){
  redirect('/auth')
}
  
  return (
    <main className="min-h-screen py-10 px-3 font-sans">
      <h1 className="text-3xl font-bold">
        Welcome {session.user.name}
      </h1>

      <div className="mt-6 space-y-2">
        <p>
          User ID: {session.user.id}
        </p>

        <p>
          Email: {session.user.email}
        </p>

        <p>
          Referral Code: {session.user.referralCode}
        </p>
        <LogoutButton/>
      </div>
    </main>
  );
}