"use client";

import { X } from "lucide-react";
import SearchableSelect from "./SearchableSelect";

export default function TagSelect({
  value = [],
  editable,
  onChange,
  endpoint,
  placeholder,
}) {
  const remove = (id) => {
    onChange(
      value.filter((item) => item.id !== id)
    );
  };

  const add = (option) => {
    if (
      value.some((item) => item.id === option.id)
    ) {
      return;
    }

    onChange([
      ...value,
      {
        id: option.id,
        name: option.name,
      },
    ]);
  };

  return (
    <div>
      {value.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {value.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-1.5 rounded-full bg-[#e2f9d7] px-3 py-1.5 text-[11px] font-medium text-[#173f32]"
            >
              {item.name}

              {editable && (
                <button
                  type="button"
                  onClick={() =>
                    remove(item.id)
                  }
                  className="rounded-full hover:bg-[#ccecbf]"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {editable && (
        <SearchableSelect
          label=""
          value=""
          editable
          endpoint={endpoint}
          placeholder={placeholder}
          onChange={add}
        />
      )}

      {!editable && value.length === 0 && (
        <p className="text-[12px] text-[#89938e]">
          Not added
        </p>
      )}
    </div>
  );
}