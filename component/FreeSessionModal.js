
"use client";

import { useActionState, useEffect, useState } from "react";
import {
  MonitorCheck,
  X,
  LoaderCircle,
  CheckCircle2,
  CalendarClock,
} from "lucide-react";
import { bookFreeSession } from "@/app/actions/booking";

const initialState = {
  status: "idle",
  message: "",
  bookingTime: "",
};

export default function FreeSessionModal({ course }) {
  const [open, setOpen] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const [state, action, pending] = useActionState(
    bookFreeSession,
    initialState
  );

  const needsPhone = state.status === "needs_phone";
  const succeeded = state.status === "success";

  // Close modal with Escape key.
  useEffect(() => {
    if (!open) return;

    const handleEscape = (event) => {
      if (event.key === "Escape" && !pending && !succeeded) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, pending, succeeded]);

  // Show countdown and refresh page after successful booking.
  useEffect(() => {
    if (!succeeded || !open) return;

    setCountdown(3);

    const interval = setInterval(() => {
      setCountdown((previous) => Math.max(previous - 1, 0));
    }, 1000);

    const timeout = setTimeout(() => {
      window.location.reload();
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [succeeded, open]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setCountdown(3);
          setOpen(true);
        }}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#0039bd] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#ccfc3b] hover:text-black"
      >
        Book A Free Session
        <MonitorCheck size={15} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (
              event.target === event.currentTarget &&
              !pending &&
              !succeeded
            ) {
              setOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="free-session-title"
            className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
          >
            {!pending && !succeeded && (
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close popup"
                className="absolute right-4 top-4 rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            )}

            {succeeded ? (
              <div className="py-4 text-center">
                <CheckCircle2
                  className="mx-auto mb-4 text-green-600"
                  size={46}
                />

                <h2 className="text-xl font-bold text-[#060B1F]">
                  Booking Confirmed!
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {state.message ||
                    "Your free session request has been submitted successfully."}
                </p>

                {state.bookingTime && (
                  <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4 text-left">
                    <div className="flex items-start gap-3">
                      <CalendarClock
                        size={21}
                        className="mt-0.5 shrink-0 text-[#0039bd]"
                      />

                      <div>
                        <p className="text-sm font-semibold text-[#060B1F]">
                          Session Date & Time
                        </p>

                        <p className="mt-1 text-sm leading-5 text-slate-600">
                          {state.bookingTime}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div
                  role="status"
                  aria-live="polite"
                  className="mt-6 rounded-xl bg-slate-50 px-4 py-3"
                >
                  <p className="text-sm font-medium text-slate-700">
                    This page will refresh in{" "}
                    <span className="font-bold text-[#0039bd]">
                      {countdown}
                    </span>{" "}
                    {countdown === 1 ? "second" : "seconds"}...
                  </p>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-[#0039bd] transition-all duration-1000 ease-linear"
                      style={{
                        width: `${((3 - countdown) / 3) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-[#0039bd]">
                  <MonitorCheck size={24} />
                </div>

                <h2
                  id="free-session-title"
                  className="text-xl font-bold text-[#060B1F]"
                >
                  Book Your Free Session
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Request a free session for{" "}
                  <span className="font-semibold text-slate-900">
                    {course.name}
                  </span>
                  . Our team will contact you to discuss the next steps.
                </p>

                <form action={action} className="mt-5 space-y-4">
                  <input
                    type="hidden"
                    name="courseId"
                    value={course.id}
                  />

                  <input
                    type="hidden"
                    name="type"
                    value={course.type || "courses"}
                  />

                  {needsPhone && (
                    <div>
                      <label
                        htmlFor="booking-phone"
                        className="mb-2 block text-sm font-medium text-slate-700"
                      >
                        Mobile number
                      </label>

                      <input
                        id="booking-phone"
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="Enter your 10-digit mobile number"
                        required
                        pattern="(?:\+91)?[6-9][0-9]{9}"
                        title="Enter a valid 10-digit Indian mobile number, optionally with +91."
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#0039bd] focus:ring-2 focus:ring-blue-100"
                      />

                      <p className="mt-1.5 text-xs text-slate-500">
                        We'll save this number to your account.
                      </p>
                    </div>
                  )}

                  {state.message && (
                    <p
                      role="alert"
                      className={`rounded-lg p-3 text-sm ${
                        state.status === "error"
                          ? "bg-red-50 text-red-700"
                          : "bg-blue-50 text-blue-800"
                      }`}
                    >
                      {state.message}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={pending}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0039bd] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#ccfc3b] hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {pending ? (
                      <>
                        <LoaderCircle
                          className="animate-spin"
                          size={16}
                        />
                        Processing...
                      </>
                    ) : needsPhone ? (
                      "Save Number & Confirm"
                    ) : (
                      "Confirm Free Session"
                    )}
                  </button>

                  {!needsPhone && (
                    <p className="text-center text-xs text-slate-500">
                      No payment required.
                    </p>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
