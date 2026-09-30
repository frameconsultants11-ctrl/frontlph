export default function PasswordRequirement({
  valid,
  label,
}) {
  return (
    <div className="flex items-center gap-1.5">

      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] ${
          valid
            ? "bg-green-100 text-green-600"
            : "bg-gray-100 text-gray-400"
        }`}
      >
        {valid ? "✓" : "•"}
      </span>

      <span
        className={`text-[10px] ${
          valid
            ? "text-green-600"
            : "text-gray-400"
        }`}
      >
        {label}
      </span>

    </div>
  );
}