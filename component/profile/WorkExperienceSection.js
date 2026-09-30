"use client";

import { Plus, Trash2 } from "lucide-react";
import { EmptyText, ProfileInput, YearSelect } from "./Helper";

export default function WorkExperienceSection({
  experiences = [],
  editable,
  onChange,
}) {
  const addExperience = () => {
    onChange([
      ...experiences,
      {
        jobTitle: "",
        company: "",
        startYear: "",
        endYear: "",
        currentlyWorking: false,
      },
    ]);
  };

  const update = (index, key, value) => {
    const updated = [...experiences];

    updated[index] = {
      ...updated[index],
      [key]: value,
    };

    onChange(updated);
  };

  const remove = (index) => {
    onChange(
      experiences.filter(
        (_, experienceIndex) =>
          experienceIndex !== index
      )
    );
  };

  if (!editable && experiences.length === 0) {
    return (
      <EmptyText text="No work experience added yet." />
    );
  }

  return (
    <div className="space-y-4">
      {experiences.map((experience, index) => (
        <div
          key={index}
          className="rounded-[14px] border border-[#e9eeeb] bg-[#fafbfa] p-4"
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[12px] font-semibold text-[#173f32]">
              Experience {index + 1}
            </p>

            {editable && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="flex h-8 w-8 items-center justify-center rounded-[8px] text-red-500 hover:bg-red-50"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <ProfileInput
              label="Job Title"
              value={experience.jobTitle}
              editable={editable}
              onChange={(value) =>
                update(
                  index,
                  "jobTitle",
                  value
                )
              }
            />

            <ProfileInput
              label="Company"
              value={experience.company}
              editable={editable}
              onChange={(value) =>
                update(
                  index,
                  "company",
                  value
                )
              }
            />

            <YearSelect
              label="Start Year"
              value={experience.startYear}
              editable={editable}
              onChange={(value) =>
                update(
                  index,
                  "startYear",
                  value
                )
              }
            />

            {!experience.currentlyWorking && (
              <YearSelect
                label="End Year"
                value={experience.endYear}
                editable={editable}
                onChange={(value) =>
                  update(
                    index,
                    "endYear",
                    value
                  )
                }
              />
            )}
          </div>

          {editable && (
            <label className="mt-4 flex cursor-pointer items-center gap-2 text-[11px] text-[#53605a]">
              <input
                type="checkbox"
                checked={
                  experience.currentlyWorking ||
                  false
                }
                onChange={(event) =>
                  update(
                    index,
                    "currentlyWorking",
                    event.target.checked
                  )
                }
                className="h-4 w-4 accent-[#173f32]"
              />

              I currently work here
            </label>
          )}
        </div>
      ))}

      {editable && (
        <button
          type="button"
          onClick={addExperience}
          className="flex h-[38px] items-center gap-2 rounded-[9px] border border-dashed border-[#b8c7be] px-4 text-[11px] font-medium text-[#173f32] hover:bg-[#f5f8f5]"
        >
          <Plus size={14} />
          Add Work Experience
        </button>
      )}
    </div>
  );
}