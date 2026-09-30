import Footer from "@/component/Footer";
import Navbar from "@/component/NavBar";
import { auth } from "@/lib/auth";

export default async function Layout({ children }) {
  const session = await auth();

  return (
    <>
      <Navbar session={session} />

      {children}

      <Footer />
    </>
  );
}