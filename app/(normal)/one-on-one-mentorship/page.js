// app/trainers/page.jsx

import TrainersPage from "@/component/TrainersPage";
import { auth } from "@/lib/auth";
import { Suspense, use } from "react";


export default function Page() {
  const session = use(auth())
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f7f7f5] py-24" />
      }
    >
      <TrainersPage session={session} />
    </Suspense>
  );
}