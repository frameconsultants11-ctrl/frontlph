import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import clientPromise from "@/lib/mongodb";

export async function GET(request, { params }) {
  try {
    const { trainerId } = await params;

    // -----------------------------------------
    // Validate trainer ID
    // -----------------------------------------

    if (!trainerId || !ObjectId.isValid(trainerId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid trainer ID",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------------
    // MongoDB
    // -----------------------------------------

    const client = await clientPromise;

    const db = client.db("learnPerHour");

    const trainersCollection = db.collection("trainers");
    const coursesCollection = db.collection("courses");

    // -----------------------------------------
    // Find Trainer
    // -----------------------------------------

    const trainer = await trainersCollection.findOne({
      _id: new ObjectId(trainerId),
    });

    if (!trainer) {
      return NextResponse.json(
        {
          success: false,
          message: "Trainer not found",
        },
        {
          status: 404,
        }
      );
    }

    // -----------------------------------------
    // Trainer Skills
    // -----------------------------------------

    const trainerSkills = Array.isArray(trainer.skills)
      ? trainer.skills.map((id) => id.toString())
      : [];

    // -----------------------------------------
    // Trainer Tools
    // -----------------------------------------

    const trainerTools = Array.isArray(trainer.toolsTeach)
      ? trainer.toolsTeach.map((id) => id.toString())
      : [];

    // -----------------------------------------
    // No skills/tools
    // -----------------------------------------

    if (trainerSkills.length === 0 && trainerTools.length === 0) {
      return NextResponse.json({
        success: true,
        trainer: {
          id: trainer._id,
          name: trainer.name,
        },
        count: 0,
        courses: [],
      });
    }

    // -----------------------------------------
    // Find Matching Courses
    //
    // Match if:
    // - At least one skill matches
    // OR
    // - At least one tool matches
    // -----------------------------------------

    const trainerSkillObjectIds = trainerSkills.map(
      (id) => new ObjectId(id)
    );

    const trainerToolObjectIds = trainerTools.map(
      (id) => new ObjectId(id)
    );

    const courses = await coursesCollection
      .find({
        isActive: true,

        $or: [
          {
            skills: {
              $in: trainerSkillObjectIds,
            },
          },
          {
            tools: {
              $in: trainerToolObjectIds,
            },
          },
        ],
      })
      .toArray();

    // -----------------------------------------
    // Calculate Match Score
    // -----------------------------------------

    const matchedCourses = courses
      .map((course) => {
        const courseSkills = Array.isArray(course.skills)
          ? course.skills.map((id) => id.toString())
          : [];

        const courseTools = Array.isArray(course.tools)
          ? course.tools.map((id) => id.toString())
          : [];

        // Matching skills
        const matchedSkills = courseSkills.filter((skillId) =>
          trainerSkills.includes(skillId)
        );

        // Matching tools
        const matchedTools = courseTools.filter((toolId) =>
          trainerTools.includes(toolId)
        );

        // ---------------------------------------
        // Score
        //
        // Skills = 2 points
        // Tools  = 1 point
        // ---------------------------------------

        const skillScore = matchedSkills.length * 2;
        const toolScore = matchedTools.length;

        const matchScore = skillScore + toolScore;

        const totalPossible =
          courseSkills.length * 2 + courseTools.length;

        const matchPercentage =
          totalPossible > 0
            ? Math.round((matchScore / totalPossible) * 100)
            : 0;

        return {
          ...course,

          matchedSkills,
          matchedTools,

          matchedSkillCount: matchedSkills.length,
          matchedToolCount: matchedTools.length,

          matchScore,
          matchPercentage,
        };
      })

      // ---------------------------------------
      // Highest match first
      // ---------------------------------------

      .sort((a, b) => {
        if (b.matchScore !== a.matchScore) {
          return b.matchScore - a.matchScore;
        }

        return b.matchPercentage - a.matchPercentage;
      });

    // -----------------------------------------
    // Remove sensitive/unnecessary fields
    // -----------------------------------------

    const formattedCourses = matchedCourses.map((course) => ({
      _id: course._id,
      title: course.title || course.name,
      description: course.description || "",
      image: course.image || null,

      category: course.category || null,

      skills: course.skills || [],
      tools: course.tools || [],

      hours: course.hours || 0,
      price: course.price || 0,
      discount: course.discount || null,
      actualPrice: course.actualPrice || course.price || 0,

      level: course.level || null,

      seoTitle: course.seoTitle || null,
      seoDescription: course.seoDescription || null,

      matchedSkills: course.matchedSkills,
      matchedTools: course.matchedTools,

      matchedSkillCount: course.matchedSkillCount,
      matchedToolCount: course.matchedToolCount,

      matchScore: course.matchScore,
      matchPercentage: course.matchPercentage,

      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    }));

    // -----------------------------------------
    // Response
    // -----------------------------------------

    return NextResponse.json({
      success: true,

      trainer: {
        id: trainer._id,
        name: trainer.name,
        image: trainer.image || null,
      },

      trainerSkills: trainerSkills,
      trainerTools: trainerTools,

      count: formattedCourses.length,

      courses: formattedCourses,
    });
  } catch (error) {
    console.error(
      "SIMILAR COURSES API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch similar courses",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      {
        status: 500,
      }
    );
  }
}