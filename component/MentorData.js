import React from "react";

import {
  User,
  Briefcase,
  Award,
  Code2,
  BookOpen,
  ChevronDown,
} from "lucide-react";

import Testimonials from "./MentorTesti";
import CourseSlider from "./MentorOtherCourse";

export default function MentorProfileDetails({ trainer }) {
  return (
    <section
      className="
        min-h-screen
        w-full
        overflow-x-hidden
        pb-16
        text-gray-800
        font-sans
        px-5
        sm:px-0
        py-12
        sm:py-0
      "
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="space-y-12">

          {/* =====================================================
              SKILLS
          ====================================================== */}

          <div className="bg-white">
            <div className="flex items-center space-x-3 mb-6 border-b border-gray-300/50 pb-2">
              <Code2 className="w-5 h-5" />

              <h3 className="text-xl font-bold text-gray-900">
                Skills
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {trainer.skills?.map((skill, index) => (
                <span
                  key={skill.id || index}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    px-3
                    py-1.5
                    rounded-lg
                    text-xs
                    font-medium
                    bg-gray-50
                    text-gray-800
                    border
                    border-gray-200
                    hover:bg-gray-100
                    transition-colors
                    cursor-default
                  "
                >
                  {skill.image && (
                    <img
                      src={skill.image}
                      alt={skill.name}
                      className="
                        w-5
                        h-5
                        object-contain
                        rounded
                      "
                    />
                  )}

                  {skill.name}
                </span>
              ))}
            </div>
          </div>

          {/* =====================================================
              TOOLS I TEACH
          ====================================================== */}

          <div className="bg-white">
            <div className="flex items-center space-x-3 mb-6 border-b border-gray-300/50 pb-2">
              <BookOpen className="w-5 h-5" />

              <h3 className="text-xl font-bold text-gray-900">
                Tools I Teach
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {trainer.tools?.map((tool, index) => (
                <span
                  key={tool.id || index}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    px-3
                    py-1.5
                    rounded-lg
                    text-xs
                    font-medium
                    bg-gray-50
                    text-gray-800
                    border
                    border-gray-200
                    hover:bg-gray-100
                    transition-colors
                    cursor-default
                  "
                >
                  {tool.image && (
                    <img
                      src={tool.image}
                      alt={tool.name}
                      className="
                        w-5
                        h-5
                        object-contain
                        rounded
                      "
                    />
                  )}

                  {tool.name}
                </span>
              ))}
            </div>
          </div>

          {/* =====================================================
              ABOUT THE TRAINER
          ====================================================== */}

          <div className="bg-white">
            <div
              className="
                flex
                items-center
                space-x-3
                mb-6
                border-b
                border-gray-300/50
                pb-2
              "
            >
              <div className="p-2">
                <User className="w-6 h-6" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900">
                About the Trainer
              </h2>
            </div>

            {trainer.about && (
              <div className="mentor-about">

                {/* =================================================
                    HIDDEN CHECKBOX

                    CSS uses this checkbox to control
                    Read More / Show Less.
                ================================================== */}

                <input
                  type="checkbox"
                  id="mentor-about-toggle"
                  className="mentor-about-toggle"
                />

                {/* =================================================
                    ABOUT CONTENT

                    Initially only 3 lines are visible.
                    When checkbox is checked, full content appears.
                ================================================== */}

                <div
                  className="
                    mentor-about-content
                    text-gray-600
                    leading-relaxed
                    text-sm
                    sm:text-base
                  "
                >
                  {trainer.about}
                </div>

                {/* =================================================
                    READ MORE / SHOW LESS
                ================================================== */}

                <label
                  htmlFor="mentor-about-toggle"
                  className="
                    mentor-about-button
                    mt-4
                    w-fit
                    flex
                    items-center
                    text-sm
                    font-semibold
                    text-green-600
                    hover:text-green-700
                    transition-colors
                    cursor-pointer
                    select-none
                  "
                >
                  {/* Read More */}
                  <span className="mentor-read-more flex items-center">
                    Read More

                    <ChevronDown className="w-4 h-4 ml-1" />
                  </span>

                  {/* Show Less */}
                  <span className="mentor-show-less flex items-center">
                    Show Less

                    <ChevronDown className="w-4 h-4 ml-1 rotate-180" />
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* =====================================================
              REFER & EARN
          ====================================================== */}

          <div
            className="
              bg-white
              cursor-pointer
              overflow-hidden
              rounded-xl
            "
          >
            <img
              src="/off.png"
              alt="Refer Someone and Earn 500 Credits"
              className="
                w-full
                h-full
                object-cover
              "
            />
          </div>

          {/* =====================================================
              EXPERIENCE
          ====================================================== */}

          <div className="bg-white">
            <div
              className="
                flex
                items-center
                space-x-3
                mb-8
                border-b
                border-gray-300/50
                pb-2
              "
            >
              <div className="p-2">
                <Briefcase className="w-6 h-6" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900">
                Experience
              </h2>
            </div>

            <div
              className="
                relative
                border-l-2
                border-gray-100
                ml-4
                sm:ml-5
                space-y-10
                pb-4
              "
            >
              {trainer.experience?.map((exp, index) => (
                <div
                  key={exp.id || index}
                  className="
                    relative
                    pl-6
                    sm:pl-8
                  "
                >
                  {/* Timeline Dot */}
                  <span
                    className="
                      absolute
                      -left-[11px]
                      top-1.5
                      w-5
                      h-5
                      bg-white
                      border-4
                      border-gray-500
                      rounded-full
                    "
                  />

                  {/* Designation + Date */}
                  <div
                    className="
                      flex
                      flex-col
                      sm:flex-row
                      sm:items-baseline
                      sm:justify-between
                      gap-2
                    "
                  >
                    <h3 className="text-lg font-bold text-gray-900">
                      {exp.designation}
                    </h3>

                    <span
                      className="
                        text-xs
                        font-medium
                        text-gray-500
                        bg-gray-100
                        mb-2
                        sm:mb-0
                        border
                        border-gray-200
                        px-3
                        py-1
                        rounded-full
                        w-fit
                        shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-2px_4px_rgba(0,0,0,0.35)]
                      "
                    >
                      {exp.from} -{" "}
                      {exp.isCurrent ? "current" : exp.to}
                    </span>
                  </div>

                  {/* Company */}
                  <h4
                    className="
                      text-sm
                      font-semibold
                      text-gray-600
                      mb-3
                    "
                  >
                    {exp.company}
                  </h4>

                  {/* Description */}
                  <p
                    className="
                      text-gray-600
                      text-sm
                      leading-relaxed
                    "
                  >
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* =====================================================
              CERTIFICATIONS
          ====================================================== */}

          <div className="bg-white">
            <div
              className="
                flex
                items-center
                space-x-3
                mb-6
                border-b
                border-gray-300/50
                pb-2
              "
            >
              <div className="p-2">
                <Award className="w-6 h-6" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900">
                Certifications
              </h2>
            </div>

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                gap-4
              "
            >
              {trainer.certifications?.map((cert, index) => (
                <div
                  key={cert.id || index}
                  className="
                    group
                    p-4
                    border
                    border-gray-100
                    bg-gray-50/50
                    rounded-xl
                    hover:border-green-300
                    hover:bg-green-50/30
                    transition-all
                    duration-200
                  "
                >
                  <div className="flex items-center gap-3">

                    {/* Certification Image */}
                    {cert.image && (
                      <div
                        className="
                          w-12
                          h-12
                          rounded-lg
                          bg-white
                          border
                          border-gray-100
                          flex
                          items-center
                          justify-center
                          p-2
                          shrink-0
                        "
                      >
                        <img
                          src={cert.image}
                          alt={cert.name}
                          className="
                            w-full
                            h-full
                            object-contain
                          "
                        />
                      </div>
                    )}

                    {/* Certification Name */}
                    <h3
                      className="
                        font-semibold
                        text-gray-900
                        group-hover:text-green-700
                        transition-colors
                        line-clamp-2
                      "
                    >
                      {cert.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Testimonials />


          <CourseSlider id={trainer.id} />

        </div>
      </div>
    </section>
  );
}