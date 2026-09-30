import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const DB_NAME = "learnPerHour";

export async function getTrainerById(id) {
  try {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const trainers = await db
      .collection("trainers")
      .aggregate([
        // =========================
        // FIND TRAINER
        // =========================
        {
          $match: {
            _id: new ObjectId(id),
            isActive: true,
            isAvailable: true,
          },
        },

        // =========================
        // SKILLS
        // =========================
        {
          $lookup: {
            from: "skills",
            let: {
              skillIds: "$skills",
            },
            pipeline: [
              {
                $match: {
                  isActive: true,
                  $expr: {
                    $in: ["$_id", "$$skillIds"],
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                  name: 1,
                  image: 1,
                },
              },
            ],
            as: "skillsData",
          },
        },

        // =========================
        // TOOLS
        // =========================
        {
          $lookup: {
            from: "tools",
            let: {
              toolIds: "$toolsTeach",
            },
            pipeline: [
              {
                $match: {
                  isActive: true,
                  $expr: {
                    $in: ["$_id", "$$toolIds"],
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                  name: 1,
                  image: 1,
                },
              },
            ],
            as: "toolsData",
          },
        },

        // =========================
        // CERTIFICATIONS
        // =========================
        {
          $lookup: {
            from: "certifications",
            let: {
              certificationIds: "$certifications",
            },
            pipeline: [
              {
                $match: {
                  isActive: true,
                  $expr: {
                    $in: ["$_id", "$$certificationIds"],
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                  name: 1,
                  image: 1,
                },
              },
            ],
            as: "certificationsData",
          },
        },

        // =========================
        // PROJECT
        // =========================
        {
          $project: {
            _id: 1,

            name: 1,
            image: 1,
            hourlyRate: 1,
            designation: 1,
            bio: 1,
            about: 1,

            // Keep exactly as MongoDB
            experience: 1,

            // Keep original IDs for debugging
            toolsTeach: 1,
            skills: 1,
            certifications: 1,

            skillsData: 1,
            toolsData: 1,
            certificationsData: 1,
          },
        },
      ])
      .toArray();

    if (!trainers.length) {
      return null;
    }

    const trainer = trainers[0];

    return {
      id: trainer._id.toString(),

      name: trainer.name || "",

      image: trainer.image || "",

      price: trainer.hourlyRate || 0,

      designation: trainer.designation || "",

      bio: trainer.bio || "",

      about: trainer.about || "",

      // EXACTLY AS STORED
      experience: trainer.experience || [],

      // Populated skills
      skills: (trainer.skillsData || []).map((skill) => ({
        id: skill._id.toString(),
        name: skill.name || "",
        image: skill.image || "",
      })),

      // Populated tools
      tools: (trainer.toolsData || []).map((tool) => ({
        id: tool._id.toString(),
        name: tool.name || "",
        image: tool.image || "",
      })),

      // Populated certifications
      certifications: (trainer.certificationsData || []).map(
        (certification) => ({
          id: certification._id.toString(),
          name: certification.name || "",
          image: certification.image || "",
        })
      ),
    };
  } catch (error) {
    console.error("GET TRAINER ERROR:", error);
    return null;
  }
}