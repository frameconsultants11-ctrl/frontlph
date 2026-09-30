"use client";

import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  GraduationCap,
  Pencil,
  Save,
  UserRound,
  X,
} from "lucide-react";

import ProfileHeader from "./ProfileHeader";
import ProfileSection from "./ProfileSection";
import EducationSection from "./EducationSection";
import WorkExperienceSection from "./WorkExperienceSection";
import TagSelect from "./TagSelect";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);

  const [form, setForm] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/profile", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load profile"
        );
      }

      setProfile(data.user);
      setForm(structuredClone(data.user));
    } catch (error) {
      console.error("PROFILE ERROR:", error);

      setError(
        error.message || "Unable to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateForm = (key, value) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleEdit = () => {
    setForm(structuredClone(profile));
    setEditMode(true);
  };

  const handleCancel = () => {
    setForm(structuredClone(profile));
    setEditMode(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          mobile: form.mobile,
          education: form.education || [],
          workExperience: form.workExperience || [],
          skills: form.skills || [],
          interestedInLearning:
            form.interestedInLearning || [],
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to update profile"
        );
      }

      setProfile(data.user);
      setForm(structuredClone(data.user));

      setEditMode(false);
    } catch (error) {
      console.error("PROFILE UPDATE ERROR:", error);

      setError(
        error.message || "Unable to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-[20px] border border-[#e7ece9] bg-white p-8">
        <div className="animate-pulse space-y-5">
          <div className="h-16 w-16 rounded-full bg-[#edf1ee]" />

          <div className="h-5 w-48 rounded bg-[#edf1ee]" />

          <div className="h-4 w-72 rounded bg-[#edf1ee]" />
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="rounded-[18px] border border-red-100 bg-red-50 p-5">
        <p className="text-[13px] text-red-600">
          {error}
        </p>

        <button
          onClick={fetchProfile}
          className="mt-3 rounded-[8px] bg-[#173f32] px-4 py-2 text-[12px] text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="mx-auto w-full space-y-4">
      {/* Top */}
      <ProfileHeader
        profile={form}
        editMode={editMode}
        saving={saving}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      {error && (
        <div className="rounded-[12px] border border-red-100 bg-red-50 px-4 py-3 text-[12px] text-red-600">
          {error}
        </div>
      )}

      {/* Personal */}
      <ProfileSection
        icon={<UserRound size={17} />}
        title="Personal Information"
        description="Your basic account information"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <ProfileField
            label="Full Name"
            value={form.name}
            editable={editMode}
            onChange={(value) =>
              updateForm("name", value)
            }
          />

          <ProfileField
            label="Email"
            value={form.email}
            editable={false}
          />

          <ProfileField
            label="Mobile"
            value={form.mobile}
            editable={editMode}
            onChange={(value) =>
              updateForm("mobile", value)
            }
          />

          <ProfileField
            label="Referral Code"
            value={form.referralCode}
            editable={false}
          />
        </div>
      </ProfileSection>

      {/* Education */}
      <ProfileSection
        icon={<GraduationCap size={17} />}
        title="Education"
        description="Your academic background"
      >
        <EducationSection
          education={form.education || []}
          editable={editMode}
          onChange={(value) =>
            updateForm("education", value)
          }
        />
      </ProfileSection>

      {/* Work */}
      <ProfileSection
        icon={<BriefcaseBusiness size={17} />}
        title="Work Experience"
        description="Your professional experience"
      >
        <WorkExperienceSection
          experiences={form.workExperience || []}
          editable={editMode}
          onChange={(value) =>
            updateForm("workExperience", value)
          }
        />
      </ProfileSection>

      {/* Skills */}
      <ProfileSection
        title="Skills"
        description="Technologies and skills you know"
      >
        <TagSelect
          value={form.skills || []}
          editable={editMode}
          onChange={(value) =>
            updateForm("skills", value)
          }
          endpoint="/api/options/skills"
          placeholder="Search skills..."
        />
      </ProfileSection>

      {/* Learning */}
      <ProfileSection
        title="Interested in Learning"
        description="Topics and technologies you want to learn"
      >
        <TagSelect
          value={form.interestedInLearning || []}
          editable={editMode}
          onChange={(value) =>
            updateForm(
              "interestedInLearning",
              value
            )
          }
          endpoint="/api/options/learning"
          placeholder="Search courses, technologies..."
        />
      </ProfileSection>
    </div>
  );
}

function ProfileField({
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
            onChange?.(event.target.value)
          }
          className="h-[42px] w-full rounded-[9px] border border-[#dfe6e2] bg-white px-3 text-[12px] text-[#17251f] outline-none transition focus:border-[#173f32] focus:ring-2 focus:ring-[#173f32]/5"
        />
      ) : (
        <div className="flex min-h-[42px] items-center rounded-[9px] bg-[#f7f9f7] px-3 text-[12px] text-[#53605a]">
          {value || "Not added"}
        </div>
      )}
    </div>
  );
} 

