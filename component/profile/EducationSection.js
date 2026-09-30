"use client";

import { Plus, Trash2 } from "lucide-react";
import SearchableSelect from "./SearchableSelect";
import { EmptyText, YearSelect } from "./Helper";

export default function EducationSection({
  education = [],
  editable,
  onChange,
}) {
  const addEducation = () => {
    onChange([
      ...education,
      {
        degreeId: "",
        degreeName: "",
        collegeId: "",
        collegeName: "",
        startYear: "",
        endYear: "",
      },
    ]);
  };

  const updateEducation = (
    index,
    key,
    value
  ) => {
    const updated = [...education];

    updated[index] = {
      ...updated[index],
      [key]: value,
    };

    onChange(updated);
  };

  const removeEducation = (index) => {
    onChange(
      education.filter(
        (_, educationIndex) =>
          educationIndex !== index
      )
    );
  };

  if (!editable && education.length === 0) {
    return (
      <EmptyText text="No education added yet." />
    );
  }

  return (
    <div className="space-y-4">
      {education.map((item, index) => (
        <div
          key={index}
          className="rounded-[14px] border border-[#e9eeeb] bg-[#fafbfa] p-4"
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[12px] font-semibold text-[#173f32]">
              Education {index + 1}
            </p>

            {editable && (
              <button
                type="button"
                onClick={() =>
                  removeEducation(index)
                }
                className="flex h-8 w-8 items-center justify-center rounded-[8px] text-red-500 hover:bg-red-50"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <SearchableSelect
              label="Degree / Course"
              value={item.degreeName}
              valueId={item.degreeId}
              editable={editable}
              endpoint="/api/options/degrees"
              placeholder="Search degree..."
              onChange={(option) => {
                updateEducation(
                  index,
                  "degreeId",
                  option?.id || ""
                );

                updateEducation(
                  index,
                  "degreeName",
                  option?.name || ""
                );
              }}
            />

            <SearchableSelect
              label="College / Institute"
              value={item.collegeName}
              valueId={item.collegeId}
              editable={editable}
              endpoint="/api/options/colleges"
              placeholder="Search college..."
              onChange={(option) => {
                updateEducation(
                  index,
                  "collegeId",
                  option?.id || ""
                );

                updateEducation(
                  index,
                  "collegeName",
                  option?.name || ""
                );
              }}
            />

            <YearSelect
              label="Start Year"
              value={item.startYear}
              editable={editable}
              onChange={(value) =>
                updateEducation(
                  index,
                  "startYear",
                  value
                )
              }
            />

            <YearSelect
              label="End Year"
              value={item.endYear}
              editable={editable}
              onChange={(value) =>
                updateEducation(
                  index,
                  "endYear",
                  value
                )
              }
            />
          </div>
        </div>
      ))}

      {editable && (
        <button
          type="button"
          onClick={addEducation}
          className="flex h-[38px] items-center gap-2 rounded-[9px] border border-dashed border-[#b8c7be] px-4 text-[11px] font-medium text-[#173f32] hover:bg-[#f5f8f5]"
        >
          <Plus size={14} />
          Add Education
        </button>
      )}
    </div>
  );
}