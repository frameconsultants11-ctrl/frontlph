export default function Input({
  label,
  error,
  className = "",
  ...props
}) {
  return (
    <div className={className}>

      {label && (
        <label className="mb-1.5 block text-[12px] font-medium text-[#303a35]">
          {label}
        </label>
      )}

      <input
        {...props}
        className={`h-[45px] w-full rounded-[8px] border bg-white px-3 text-[13px] outline-none transition placeholder:text-gray-400 ${
          error
            ? "border-red-400 focus:border-red-500"
            : "border-gray-200 focus:border-[#173f32]"
        }`}
      />

      {error && (
        <p className="mt-1 text-[11px] text-red-500">
          {error}
        </p>
      )}

    </div>
  );
}