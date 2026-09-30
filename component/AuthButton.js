
"use client";

export default function AuthButton({
  children,
  variant = "primary",
  disabled = false,
  className = "",
  onClick,
  type = "button",
}) {
  const primary =
    variant === "primary";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        flex
        h-[45px]
        w-full
        items-center
        justify-center
        gap-3
        rounded-[8px]
        px-4
        text-[13px]
        font-medium
        transition
        ${
          primary
            ? "bg-[#173f32] text-white hover:bg-[#12352a]"
            : "border border-gray-200 bg-white text-[#173f32] hover:bg-gray-50"
        }
        ${
          disabled
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer"
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}
