import { Suspense } from "react";
import LoginPage from "./LoginPageContent";

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <main className="flex h-screen items-center justify-center bg-white">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#173f32]" />
        </main>
      }
    >
      <LoginPage />
    </Suspense>
  );
}