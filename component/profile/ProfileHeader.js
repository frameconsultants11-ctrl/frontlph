"use client";

import {
  Check,
  Pencil,
  UserRound,
  X,
} from "lucide-react";

export default function ProfileHeader({
  profile,
  editMode,
  saving,
  onEdit,
  onSave,
  onCancel,
}) {
  return (
    <div className="rounded-[20px] border border-[#e7ece9] bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-[64px] w-[64px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e2f9d7]">
            {profile.image ? (
              <img
                src={profile.image}
                alt={profile.name || "Profile"}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserRound
                size={25}
                className="text-[#173f32]"
              />
            )}
          </div>

          <div>
            <h1 className="text-[18px] font-semibold text-[#17251f]">
              {profile.name || "Your Profile"}
            </h1>

            <p className="mt-1 text-[12px] text-[#7b8781]">
              {profile.email}
            </p>
          </div>
        </div>

        {!editMode ? (
          <button
            type="button"
            onClick={onEdit}
            className="flex h-[40px] items-center justify-center gap-2 rounded-[9px] border border-[#dfe6e2] px-4 text-[12px] font-medium text-[#173f32] transition hover:bg-[#f5f8f5]"
          >
            <Pencil size={14} />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="flex h-[40px] items-center gap-2 rounded-[9px] border border-[#dfe6e2] px-4 text-[12px] font-medium text-[#53605a]"
            >
              <X size={14} />
              Cancel
            </button>

            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="flex h-[40px] items-center gap-2 rounded-[9px] bg-[#173f32] px-4 text-[12px] font-medium text-white disabled:opacity-60"
            >
              <Check size={14} />

              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}