"use client";

// Path: component/EnrolButton.jsx
// Signed out -> link to the auth page. Signed in -> submits the booking with a server action.

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { enrollInCourse } from "@/app/actions/booking";

const initialState = { status: "idle", message: "" };

const SIZE = {
  card: "w-full py-3",
  bar: "px-7 py-2.5",
};

function SubmitButton({ done, size, failed }) {
  const { pending } = useFormStatus();
  const base = `flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0039bd] ${SIZE[size]}`;

  if (done) {
    return (
      <button type="button" disabled className={`${base} cursor-default bg-[#ccfc3b] text-[#00206b]`}>
        <Check size={16} /> Booked
      </button>
    );
  }
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${base} bg-[#0039bd] text-white hover:bg-[#ccfc3b] hover:text-black disabled:opacity-70`}
    >
      {pending ? (
        <>
          <Loader2 size={16} className="animate-spin" /> Booking…
        </>
      ) : (
        <>
          {failed ? "Try again" : "Enrol now"} <ArrowRight size={16} />
        </>
      )}
    </button>
  );
}

export default function EnrolButton({ courseId, slug, loggedIn, booked = false, authHref, size = "card" }) {
  const [state, formAction] = useActionState(enrollInCourse, initialState);
  const done = booked || state.status === "success";

  if (!loggedIn) {
    return (
      <Link
        href={authHref}
        className={`flex items-center justify-center gap-2 rounded-full bg-[#0039bd] text-sm font-semibold text-white transition-colors hover:bg-[#ccfc3b] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0039bd] ${SIZE[size]}`}
      >
        Enrol now <ArrowRight size={16} />
      </Link>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="courseId" value={courseId} />
      <input type="hidden" name="slug" value={slug} />
      <SubmitButton done={done} size={size} failed={state.status === "error"} />
      {size === "card" && state.status !== "idle" && (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={`mt-2 text-center text-xs ${state.status === "error" ? "text-red-600" : "text-slate-500"}`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}