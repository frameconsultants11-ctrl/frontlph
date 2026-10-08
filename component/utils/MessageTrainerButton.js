"use client";

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Send,
  X,
} from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const MESSAGE_TEMPLATES = [
  "Hi, I would like to know more about your mentorship.",
  "Hi, I am interested in booking a session with you.",
  "Hi, I would like to discuss my learning goals with you.",
  "Hi, can you tell me more about your mentoring approach.",
];

export default function MessageTrainerButton({
  trainer,
  session,
}) {
  const router = useRouter();

  const sliderRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const trainerId = trainer.id;

  /* =====================================================
     MOUNT
  ===================================================== */

  useEffect(() => {
    setMounted(true);
  }, []);

  /* =====================================================
     BODY SCROLL
  ===================================================== */

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* =====================================================
     ESCAPE KEY
  ===================================================== */

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !sending) {
        handleClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, sending]);

  /* =====================================================
     OPEN MODAL
  ===================================================== */

  const handleOpen = () => {
    if (!session) {
      const callbackUrl =
        window.location.pathname +
        window.location.search;

      router.push(
        `/auth?callbackUrl=${encodeURIComponent(
          callbackUrl
        )}`
      );

      return;
    }

    setMessage("");
    setError("");
    setSent(false);
    setOpen(true);
  };

  /* =====================================================
     CLOSE MODAL
  ===================================================== */

  const handleClose = () => {
    if (sending) return;

    setOpen(false);
    setMessage("");
    setError("");
    setSent(false);
  };

  /* =====================================================
     SELECT TEMPLATE
  ===================================================== */

  const selectTemplate = (template) => {
    setMessage(template);
    setError("");
  };

  /* =====================================================
     SLIDER
  ===================================================== */

  const slideLeft = () => {
    sliderRef.current?.scrollBy({
      left: -280,
      behavior: "smooth",
    });
  };

  const slideRight = () => {
    sliderRef.current?.scrollBy({
      left: 280,
      behavior: "smooth",
    });
  };

  /* =====================================================
     SEND MESSAGE
  ===================================================== */

  const handleSend = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      setError("Please enter a message.");
      return;
    }

    if (!trainerId) {
      setError("Trainer information is missing.");
      return;
    }

    if (!session) {
      router.push("/auth");
      return;
    }

    try {
      setSending(true);
      setError("");

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          trainerId:trainer.id,
          message: trimmedMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to send message."
        );
      }

      setSent(true);

      setTimeout(() => {
        setOpen(false);
        setMessage("");
        setSent(false);
      }, 1500);
    } catch (error) {
      console.error(
        "Send trainer message error:",
        error
      );

      setError(
        error.message ||
          "Failed to send message. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  /* =====================================================
     MODAL
  ===================================================== */

  const modal =
    open && mounted
      ? createPortal(
          <div
            className="fixed inset-0 z-[999999] flex items-center justify-center p-4 font-sans"
            role="dialog"
            aria-modal="true"
            aria-labelledby="message-trainer-title"
          >
            {/* BACKDROP */}

            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={handleClose}
            />

            {/* MODAL */}

            <div
              className="relative z-[1000000] w-full max-w-lg max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              {/* =================================================
                  HEADER
              ================================================== */}

              <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-gray-100 bg-white">
                <div className="min-w-0">
                  <h2
                    id="message-trainer-title"
                    className="text-lg font-semibold text-gray-900"
                  >
                    Send a Message
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Message{" "}
                    <span className="font-medium text-gray-800">
                      {trainer?.name || "Trainer"}
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  disabled={sending}
                  className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* =================================================
                  SCROLLABLE CONTENT
              ================================================== */}

              <div className="max-h-[calc(90vh-73px)] overflow-y-auto">
                <div className="p-5">

                  {/* =================================================
                      TRAINER INFO
                  ================================================== */}

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 mb-5">
                    {trainer?.image ? (
                      <img
                        src={trainer.image}
                        alt={
                          trainer?.name ||
                          "Trainer"
                        }
                        className="w-11 h-11 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                        <MessageSquare className="w-5 h-5 text-gray-500" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {trainer?.name ||
                          "Trainer"}
                      </p>

                      <p className="text-xs text-gray-400 truncate">
                        Trainer ID: {trainer.id}
                      </p>
                    </div>
                  </div>

                  {/* =================================================
                      SUCCESS
                  ================================================== */}

                  {sent ? (
                    <div className="py-10 text-center">
                      <div className="w-14 h-14 mx-auto rounded-full bg-green-50 flex items-center justify-center">
                        <CheckCircle2 className="w-7 h-7 text-green-600" />
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mt-4">
                        Message Sent
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Your message has been
                        sent successfully.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* =================================================
                          QUICK MESSAGE SLIDER
                      ================================================== */}

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold text-gray-800">
                            Quick message
                          </p>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={slideLeft}
                              disabled={sending}
                              className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition disabled:opacity-40"
                              aria-label="Previous messages"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={slideRight}
                              disabled={sending}
                              className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition disabled:opacity-40"
                              aria-label="Next messages"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div
                          ref={sliderRef}
                          className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth pb-1"
                        >
                          {MESSAGE_TEMPLATES.map(
                            (template) => (
                              <button
                                key={template}
                                type="button"
                                onClick={() =>
                                  selectTemplate(
                                    template
                                  )
                                }
                                disabled={sending}
                                className={`shrink-0 w-[336px] text-left text-xs leading-5 px-3 py-1.5 rounded-lg border transition ${
                                  message ===
                                  template
                                    ? "border-gray-900 bg-gray-900 text-white"
                                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                }`}
                              >
                                {template}
                              </button>
                            )
                          )}
                        </div>
                      </div>

                      {/* =================================================
                          MESSAGE INPUT
                      ================================================== */}

                      <div className="mt-5">
                        <label
                          htmlFor="trainer-message"
                          className="block text-sm font-semibold text-gray-800 mb-2"
                        >
                          Your message
                        </label>

                        <textarea
                          id="trainer-message"
                          value={message}
                          onChange={(event) =>
                            setMessage(
                              event.target.value
                            )
                          }
                          placeholder="Write your message..."
                          rows={4}
                          maxLength={1000}
                          disabled={sending}
                          className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50"
                        />

                        <div className="flex justify-end mt-1">
                          <span className="text-xs text-gray-400">
                            {message.length}/1000
                          </span>
                        </div>
                      </div>

                      {/* =================================================
                          ERROR
                      ================================================== */}

                      {error && (
                        <div className="mt-3 rounded-xl bg-red-50 border border-red-100 px-3 py-2.5 text-sm text-red-600">
                          {error}
                        </div>
                      )}

                      {/* =================================================
                          SEND
                      ================================================== */}

                      <button
                        type="button"
                        onClick={handleSend}
                        disabled={
                          sending ||
                          !message.trim()
                        }
                        className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-green-700 text-white py-3.5 text-sm font-semibold hover:bg-green-800 cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {sending ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />

                            Send Message
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  /* =====================================================
     BUTTON + PORTAL
  ===================================================== */

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="flex items-center justify-center py-3 border-[1.5px] border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-colors"
        aria-label={`Message ${
          trainer?.name || "trainer"
        }`}
      >
        <MessageSquare className="w-5 h-5 text-gray-700" />
      </button>

      {modal}
    </>
  );
}