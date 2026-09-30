import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default 
function PasswordInput({
  label,
  value,
  onChange,
  error,
  placeholder,
}) {
  const [showPassword, setShowPassword] =
    useState(false);

  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium text-[#303a35]">
        {label}
      </label>

      <div className="relative">
        <input
          type={
            showPassword
              ? "text"
              : "password"
          }
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            h-[45px]
            w-full
            rounded-[8px]
            border
            bg-white
            px-3
            pr-11
            text-[13px]
            outline-none
            transition
            placeholder:text-gray-400
            ${
              error
                ? "border-red-400 focus:border-red-500"
                : "border-gray-200 focus:border-[#173f32]"
            }
          `}
        />

        <button
          type="button"
          onClick={() =>
            setShowPassword(
              (previous) => !previous
            )
          }
          className="
            absolute
            right-2
            top-1/2
            flex
            h-8
            w-8
            -translate-y-1/2
            items-center
            justify-center
            rounded-md
            text-gray-400
            transition
            hover:bg-gray-100
            hover:text-gray-700
          "
          aria-label={
            showPassword
              ? "Hide password"
              : "Show password"
          }
        >
          {showPassword ? (
            <EyeOff size={16} />
          ) : (
            <Eye size={16} />
          )}
        </button>
      </div>

      {error && (
        <p className="mt-1 text-[11px] text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}