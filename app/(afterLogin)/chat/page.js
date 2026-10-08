import { auth } from "@/lib/auth";
import ChatPage from "@/component/ChatPage";

export default async function MessagesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  return (
    <ChatPage
      user={{
        id: session.user.id,
        name: session.user.name || "User",
        email: session.user.email || "",
        image: session.user.image || "",
      }}
    />
  );
}