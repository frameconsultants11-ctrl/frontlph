"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Copy,
  Mail,
  MessageCircle,
  Send,
  Share2,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

/* =========================
   Social Icons
========================= */

function FacebookIcon({ size = 17 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M13.5 21v-8h2.75l.4-3h-3.15V8.08c0-.87.24-1.46 1.5-1.46h1.76V3.94c-.3-.04-1.32-.13-2.5-.13-2.48 0-4.18 1.52-4.18 4.31V10H7.25v3h2.83v8h3.42Z" />
    </svg>
  );
}

function InstagramIcon({ size = 17 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle
        cx="17.5"
        cy="6.5"
        r="0.8"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function WhatsAppIcon({ size = 17 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.85-1.27A9.5 9.5 0 1 0 12 2.5Zm0 17.2a7.7 7.7 0 0 1-3.92-1.07l-.28-.17-2.88.75.77-2.8-.18-.29A7.7 7.7 0 1 1 12 19.7Zm4.22-5.77c-.23-.12-1.35-.67-1.56-.74-.21-.08-.36-.12-.51.12-.15.23-.59.74-.72.89-.13.16-.27.17-.5.06-.23-.12-.96-.35-1.82-1.12-.67-.6-1.12-1.34-1.25-1.57-.13-.23-.01-.36.1-.48.1-.1.23-.27.34-.4.11-.14.15-.23.23-.38.08-.16.04-.29-.02-.41-.06-.12-.51-1.24-.7-1.7-.18-.44-.37-.38-.51-.39h-.43c-.15 0-.39.06-.59.29-.2.23-.77.75-.77 1.83s.79 2.12.9 2.27c.11.15 1.55 2.36 3.76 3.31.53.23.95.37 1.27.47.53.17 1.01.15 1.39.09.42-.06 1.35-.55 1.54-1.08.19-.53.19-.98.13-1.08-.06-.1-.21-.16-.44-.28Z" />
    </svg>
  );
}

function LinkedInIcon({ size = 17 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M5.2 3.5A2.2 2.2 0 1 0 5.2 7.9a2.2 2.2 0 0 0 0-4.4ZM3.3 9.2h3.8V21H3.3V9.2Zm6.2 0h3.6v1.61h.05c.5-.95 1.72-1.95 3.55-1.95 3.8 0 4.5 2.5 4.5 5.75V21h-3.75v-5.66c0-1.35-.02-3.09-1.88-3.09-1.88 0-2.17 1.47-2.17 2.99V21H9.5V9.2Z" />
    </svg>
  );
}

function XIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.38L6.49 22H3.37l7.24-8.28L3 2h6.4l4.42 5.84L18.9 2Zm-1.1 17.7h1.73L8.46 4.18H6.6L17.8 19.7Z" />
    </svg>
  );
}

/* =========================
   Component
========================= */

export default function ReferralShareCard({
  referralCode,
  domain,
}) {
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  const referralUrl = useMemo(() => {
    if (!referralCode) return "";

    const baseUrl =
      domain ||
      (typeof window !== "undefined"
        ? window.location.origin
        : "");

    return `${baseUrl.replace(/\/$/, "")}/r/${encodeURIComponent(
      referralCode
    )}`;
  }, [referralCode, domain]);

  const shareMessage = `Join me on Learn Per Hour and start learning. Use my referral link: ${referralUrl}`;

  /* =========================
     Copy
  ========================= */

  const copyLink = async () => {
    if (!referralUrl) return;

    try {
      await navigator.clipboard.writeText(referralUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  /* =========================
     Native Share
  ========================= */

  const handleNativeShare = async () => {
    if (!referralUrl || !navigator.share) return;

    try {
      setSharing(true);

      await navigator.share({
        title: "Join Learn Per Hour",
        text: shareMessage,
        url: referralUrl,
      });
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.error("Share failed:", error);
      }
    } finally {
      setSharing(false);
    }
  };

  /* =========================
     Social Sharing
  ========================= */

  const shareWhatsApp = () => {
    const text = encodeURIComponent(shareMessage);

    window.open(
      `https://wa.me/?text=${text}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareTelegram = () => {
    const url = encodeURIComponent(referralUrl);

    window.open(
      `https://t.me/share/url?url=${url}&text=${encodeURIComponent(
        "Join me on Learn Per Hour!"
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareFacebook = () => {
    const url = encodeURIComponent(referralUrl);

    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareLinkedIn = () => {
    const url = encodeURIComponent(referralUrl);

    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(
      "Join me on Learn Per Hour!"
    );

    const url = encodeURIComponent(referralUrl);

    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareInstagram = async () => {
    if (navigator.share) {
      await handleNativeShare();
      return;
    }

    await copyLink();
  };

  const shareEmail = () => {
    const subject = encodeURIComponent(
      "Join me on Learn Per Hour"
    );

    const body = encodeURIComponent(shareMessage);

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  if (!referralCode) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-[20px] border border-[#e7ece9] bg-white">
      {/* Header */}
      <div className="border-b border-[#edf0ee] px-5 py-5 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#e2f9d7]">
                <Share2
                  size={17}
                  className="text-[#173f32]"
                />
              </div>

              <h2 className="text-[15px] font-semibold text-[#17251f]">
                Invite & Earn
              </h2>
            </div>

            <p className="mt-2 text-[12px] leading-5 text-[#7b8781]">
              Share your referral link with friends and
              earn rewards when they join.
            </p>
          </div>

          {/* Referral code */}
          <div className="hidden shrink-0 rounded-[10px] bg-[#f5f7f5] px-3 py-2 text-right sm:block">
            <p className="text-[9px] font-medium uppercase tracking-[0.5px] text-[#89938e]">
              Referral Code
            </p>

            <p className="mt-0.5 text-[12px] font-semibold tracking-[0.5px] text-[#173f32]">
              {referralCode}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[180px_1fr] lg:items-center">
        {/* QR */}
        <div className="flex justify-center">
          <div className="rounded-[18px] border border-[#e9eeeb] bg-white p-3 shadow-[0_4px_20px_rgba(23,63,50,0.05)]">
            <QRCodeSVG
              value={referralUrl}
              size={150}
              bgColor="#ffffff"
              fgColor="#173f32"
              level="H"
              includeMargin={false}
            />
          </div>
        </div>

        {/* Details */}
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-[#65716b]">
            Your referral link
          </p>

          {/* URL */}
          <div className="mt-2 flex items-center gap-2 rounded-[10px] border border-[#e6ebe8] bg-[#fafbfa] p-2">
            <div className="min-w-0 flex-1 px-2">
              <p className="truncate text-[12px] text-[#53605a]">
                {referralUrl}
              </p>
            </div>

            <button
              type="button"
              onClick={copyLink}
              aria-label="Copy referral link"
              className="flex h-9 shrink-0 items-center gap-2 rounded-[8px] bg-[#173f32] px-3 text-[11px] font-medium text-white transition hover:bg-[#12352a]"
            >
              {copied ? (
                <>
                  <Check size={14} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy
                </>
              )}
            </button>
          </div>

          {/* Native Share */}
          {typeof navigator !== "undefined" &&
            navigator.share && (
              <button
                type="button"
                onClick={handleNativeShare}
                disabled={sharing}
                className="mt-3 flex h-[42px] w-full items-center justify-center gap-2 rounded-[9px] bg-[#b9d63b] px-4 text-[12px] font-semibold text-[#173f32] transition hover:brightness-95 disabled:opacity-60"
              >
                <Share2 size={16} />

                {sharing
                  ? "Opening..."
                  : "Share Referral Link"}
              </button>
            )}

          {/* Social */}
       
        </div>
      </div>
         <div className="mx-8 mb-4">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.6px] text-[#8a948f]">
              Share via
            </p>

            <div className="flex flex-wrap gap-2">
              <ShareButton
                icon={<WhatsAppIcon />}
                label="WhatsApp"
                onClick={shareWhatsApp}
                className="text-[#1da851] hover:bg-[#effaf3]"
              />

              <ShareButton
                icon={<InstagramIcon />}
                label="Instagram"
                onClick={shareInstagram}
                className="text-[#c13584] hover:bg-[#fdf0f7]"
              />

              <ShareButton
                icon={<FacebookIcon />}
                label="Facebook"
                onClick={shareFacebook}
                className="text-[#3569b8] hover:bg-[#eef3fb]"
              />

              <ShareButton
                icon={<LinkedInIcon />}
                label="LinkedIn"
                onClick={shareLinkedIn}
                className="text-[#0a66c2] hover:bg-[#eef6fd]"
              />

              <ShareButton
                icon={<Send size={16} />}
                label="Telegram"
                onClick={shareTelegram}
                className="text-[#168ac2] hover:bg-[#eef8fc]"
              />

              <ShareButton
                icon={<XIcon />}
                label="X"
                onClick={shareTwitter}
                className="text-[#17251f] hover:bg-[#f3f4f3]"
              />

              <ShareButton
                icon={<Mail size={16} />}
                label="Email"
                onClick={shareEmail}
                className="text-[#7a5a9c] hover:bg-[#f6f1fa]"
              />
            </div>
          </div>
    </div>
  );
}



function ShareButton({
  icon,
  label,
  onClick,
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Share via ${label}`}
      title={label}
      className={`flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border border-[#e8ece9] bg-white transition hover:-translate-y-[1px] ${className}`}
    >
      {icon}
    </button>
  );
}