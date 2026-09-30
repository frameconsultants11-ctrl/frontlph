export function YearSelect({
  label,
  value,
  editable,
  onChange,
}) {
  const currentYear = new Date().getFullYear();

  const years = Array.from(
    { length: 70 },
    (_, index) => currentYear - index
  );

  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.4px] text-[#89938e]">
        {label}
      </label>

      {editable ? (
        <select
          value={value || ""}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="h-[42px] w-full rounded-[9px] border border-[#dfe6e2] bg-white px-3 text-[12px] text-[#17251f] outline-none"
        >
          <option value="">Select year</option>

          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      ) : (
        <div className="flex min-h-[42px] items-center rounded-[9px] bg-white px-3 text-[12px] text-[#53605a]">
          {value || "Not added"}
        </div>
      )}
    </div>
  );
}

export function ProfileInput({
  label,
  value,
  editable,
  onChange,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.4px] text-[#89938e]">
        {label}
      </label>

      {editable ? (
        <input
          value={value || ""}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="h-[42px] w-full rounded-[9px] border border-[#dfe6e2] bg-white px-3 text-[12px] outline-none focus:border-[#173f32]"
        />
      ) : (
        <div className="flex min-h-[42px] items-center rounded-[9px] bg-white px-3 text-[12px] text-[#53605a]">
          {value || "Not added"}
        </div>
      )}
    </div>
  );
}

export function EmptyText({ text }) {
  return (
    <p className="rounded-[12px] bg-[#f7f9f7] px-4 py-4 text-[12px] text-[#89938e]">
      {text}
    </p>
  );
}