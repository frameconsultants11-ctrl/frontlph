export default function ProfileSection({
  icon,
  title,
  description,
  children,
}) {
  return (
    <section className="rounded-[20px] border border-[#e7ece9] bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        {icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#e2f9d7] text-[#173f32]">
            {icon}
          </div>
        )}

        <div>
          <h2 className="text-[14px] font-semibold text-[#17251f]">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-[11px] text-[#89938e]">
              {description}
            </p>
          )}
        </div>
      </div>

      {children}
    </section>
  );
}