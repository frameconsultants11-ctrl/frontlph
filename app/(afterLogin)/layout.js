import ClientLayout from "@/component/ClientLayout";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";


export default async function Layout({ children }) {
  const session = await auth();
if (!session?.user) {
    redirect("/auth");
  }

  return (
   <ClientLayout session={session}>
    {children}
   </ClientLayout>
  );
}