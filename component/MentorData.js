import React from "react";
import {
  User,
  Briefcase,
  Award,
  Code2,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

import Testimonials from "./MentorTesti";
import CourseSlider from "./MentorOtherCourse";

const MENTOR_DATA = {
  about: `I am a passionate Software Engineer and Educator with over 8 years of experience in building scalable web applications and distributed systems. My journey started in frontend development, and I've since transitioned into full-stack and cloud architecture. I have a deep love for mentoring and have helped over 50+ students and professionals break into the tech industry, level up their skills, and land their dream jobs at top-tier companies.

When I'm not coding or mentoring, you can find me contributing to open-source projects, writing technical blogs on modern web development, or exploring the latest advancements in AI and machine learning. I believe in a practical, hands-on approach to learning, focusing not just on the 'how', but the 'why' behind technical decisions.`,

  experience: [
    {
      id: 1,
      role: "Senior Software Engineer",
      company: "TechNova Solutions",
      duration: "Jan 2021 - Present",
      description:
        "Leading a team of 5 engineers to build high-performance microservices. Architected a real-time data processing pipeline that reduced latency by 40%. Spearheaded the migration from legacy monolith to React/Node.js stack.",
    },
    {
      id: 2,
      role: "Software Engineer II",
      company: "InnovateApp Inc.",
      duration: "Mar 2018 - Dec 2020",
      description:
        "Developed and maintained highly interactive frontend applications using React and Redux. Collaborated closely with design teams to implement complex UI/UX features, increasing user engagement by 25%.",
    },
    {
      id: 3,
      role: "Frontend Developer",
      company: "Creative Web Agency",
      duration: "Jun 2016 - Feb 2018",
      description:
        "Built responsive, accessible websites for various clients. Optimized frontend performance and established internal coding standards for HTML/CSS and JavaScript.",
    },
  ],

  certifications: [
    {
      id: 1,
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      date: "Issued Aug 2023",
    },
    {
      id: 2,
      name: "Meta Front-End Developer Professional Certificate",
      issuer: "Meta / Coursera",
      date: "Issued Jan 2022",
    },
    {
      id: 3,
      name: "Google Cloud Professional Developer",
      issuer: "Google Cloud",
      date: "Issued Nov 2020",
    },
  ],

  skills: [
    "JavaScript (ES6+)",
    "TypeScript",
    "React.js",
    "Next.js",
    "Node.js",
    "Express",
    "Python",
    "System Design",
    "AWS",
    "Docker",
    "Kubernetes",
    "GraphQL",
    "Tailwind CSS",
    "PostgreSQL",
    "MongoDB",
  ],

  teaches: [
    "Full-Stack Web Development",
    "Frontend Architecture & Performance",
    "System Design & Scalability",
    "Technical Interview Preparation",
    "Career Transition Strategies",
    "Portfolio & Resume Reviews",
  ],
};

export default function MentorProfileDetails({trainer}) {
  return (
    <section className="min-h-screen w-full overflow-x-hidden pb-16 text-gray-800 font-sans px-5 sm:px-0 py-12 sm:py-0">
      <div className="max-w-[1400px] mx-auto">
        <div className="space-y-12">

          {/* =====================================================
              SKILLS & TOOLS
          ====================================================== */}
          <div className="bg-white">
            <div className="flex items-center space-x-3 mb-6 border-b border-gray-300/50 pb-2">
              <Code2 className="w-5 h-5" />

              <h3 className="text-xl font-bold text-gray-900">
                Skills
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
             {trainer.skills.map((skill, index) => (
  <span
    key={skill.id || index}
    className="
      inline-flex
      items-center
      gap-2
      px-3
      py-1.5
      rounded-lg
      sm:text-xs
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
        className="w-5 h-5 object-contain rounded"
      />
    )}

    {skill.name}
  </span>
))}
            </div>
          </div>
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
      sm:text-xs
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
        className="w-5 h-5 object-contain rounded"
      />
    )}

    {tool.name}
  </span>
              ))}
            </div>
          </div>

          <div className="bg-white">
            <div className="flex items-center space-x-3 mb-6 border-b border-gray-300/50 pb-2">
              <div className="p-2">
                <User className="w-6 h-6" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900">
                About the Trainer
              </h2>
            </div>

            <details className="group">
              {/* About Text */}
              <p
                className="
                  text-gray-600
                  leading-relaxed
                  line-clamp-3
                  group-open:line-clamp-none
                "
              >
                {trainer.about}
              </p>

              {/* Read More / Show Less */}
              <summary
                className="
                  mt-4
                  list-none
                  cursor-pointer
                  w-fit
                  flex
                  items-center
                  text-sm
                  font-semibold
                  text-green-600
                  hover:text-green-700
                  transition-colors
                "
              >
                {/* Read More */}
                <span className="flex items-center group-open:hidden">
                  Read More
                  <ChevronDown className="w-4 h-4 ml-1" />
                </span>

                {/* Show Less */}
                <span className="hidden items-center group-open:flex">
                  Show Less
                  <ChevronDown className="w-4 h-4 ml-1 rotate-180" />
                </span>
              </summary>
            </details>
          </div>

          {/* =====================================================
              REFER & EARN
          ====================================================== */}
          <div className="bg-white cursor-pointer overflow-hidden rounded-xl">
            <img
              src="/off.png"
              alt="Refer Someone and Earn 500 Credits"
              className="w-full h-full object-cover"
            />
          </div>

          {/* =====================================================
              EXPERIENCE
          ====================================================== */}
          <div className="bg-white">
            <div className="flex items-center space-x-3 mb-8 border-b border-gray-300/50 pb-2">
              <div className="p-2">
                <Briefcase className="w-6 h-6" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900">
                Experience
              </h2>
            </div>

            <div className="relative border-l-2 border-gray-100 ml-4 sm:ml-5 space-y-10 pb-4">
              {trainer.experience.map((exp) => (
                <div
                  key={exp.id}
                  className="relative pl-6 sm:pl-8"
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

                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {exp.designation}
                    </h3>

                    <span
                      className="
                        text-xs
                        font-medium
                        text-gray-500
                        bg-gray-100
                        border
                        border-gray-200
                        px-3
                        py-1
                        rounded-full
                        w-fit
                        shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-2px_4px_rgba(0,0,0,0.35)]
                      "
                    >
                      {exp.from} - {exp.isCurrent? "current" : exp.to}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-gray-600 mb-3">
                    {exp.company}
                  </h4>

                  <p className="text-gray-600 text-sm leading-relaxed">
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
            <div className="flex items-center space-x-3 mb-6 border-b border-gray-300/50 pb-2">
              <div className="p-2">
                <Award className="w-6 h-6" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900">
                Certifications
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {trainer.certifications.map((cert) => (
    <div
      key={cert.id}
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
      {/* Certification Image */}
      <div className="flex items-center gap-3">
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
              className="w-full h-full object-contain"
            />
          </div>
        )}

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

          {/* =====================================================
              TESTIMONIALS
          ====================================================== */}
          <Testimonials />
          <CourseSlider />

        </div>
      </div>
    </section>
  );
}