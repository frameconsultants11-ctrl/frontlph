import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import clientPromise from "@/lib/mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const idsParam = searchParams.get("ids");

    if (!idsParam) {
      return NextResponse.json(
        {
          success: false,
          message: "Trainer IDs are required",
        },
        { status: 400 }
      );
    }

    const ids = idsParam
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    if (!ids.length) {
      return NextResponse.json(
        {
          success: false,
          message: "No trainer IDs provided",
        },
        { status: 400 }
      );
    }

    if (ids.length > 3) {
      return NextResponse.json(
        {
          success: false,
          message: "Maximum 3 trainers can be compared",
        },
        { status: 400 }
      );
    }

    const invalidId = ids.find(
      (id) => !ObjectId.isValid(id)
    );

    if (invalidId) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid trainer ID: ${invalidId}`,
        },
        { status: 400 }
      );
    }

    const validIds = ids.map(
      (id) => new ObjectId(id)
    );

    const client = await clientPromise;

    const db = client.db("learnPerHour");

    /*
     * =====================================================
     * GET TRAINERS
     * =====================================================
     */

    const trainers = await db
      .collection("trainers")
      .find({
        _id: {
          $in: validIds,
        },
        isActive: true,
      })
      .toArray();

    /*
     * =====================================================
     * GET ALL RELATED IDS
     * =====================================================
     */

    const skillIds = [];
    const toolIds = [];
    const certificationIds = [];

    for (const trainer of trainers) {
      if (Array.isArray(trainer.skills)) {
        skillIds.push(...trainer.skills);
      }

      if (Array.isArray(trainer.toolsTeach)) {
        toolIds.push(...trainer.toolsTeach);
      }

      if (Array.isArray(trainer.certifications)) {
        certificationIds.push(
          ...trainer.certifications
        );
      }
    }

    /*
     * Remove duplicate IDs
     */
    const uniqueSkillIds = [
      ...new Map(
        skillIds.map((id) => [
          id.toString(),
          id,
        ])
      ).values(),
    ];

    const uniqueToolIds = [
      ...new Map(
        toolIds.map((id) => [
          id.toString(),
          id,
        ])
      ).values(),
    ];

    const uniqueCertificationIds = [
      ...new Map(
        certificationIds.map((id) => [
          id.toString(),
          id,
        ])
      ).values(),
    ];

    /*
     * =====================================================
     * FETCH SKILLS
     * =====================================================
     */

    const skills = uniqueSkillIds.length
      ? await db
          .collection("skills")
          .find({
            _id: {
              $in: uniqueSkillIds,
            },
            isActive: true,
          })
          .toArray()
      : [];

    /*
     * =====================================================
     * FETCH TOOLS
     * =====================================================
     */

    const tools = uniqueToolIds.length
      ? await db
          .collection("tools")
          .find({
            _id: {
              $in: uniqueToolIds,
            },
            isActive: true,
          })
          .toArray()
      : [];

    /*
     * =====================================================
     * FETCH CERTIFICATIONS
     * =====================================================
     */

    const certifications =
      uniqueCertificationIds.length
        ? await db
            .collection("certifications")
            .find({
              _id: {
                $in: uniqueCertificationIds,
              },
              isActive: true,
            })
            .toArray()
        : [];

    /*
     * =====================================================
     * CREATE LOOKUP MAPS
     * =====================================================
     */

    const skillMap = new Map(
      skills.map((skill) => [
        skill._id.toString(),
        skill,
      ])
    );

    const toolMap = new Map(
      tools.map((tool) => [
        tool._id.toString(),
        tool,
      ])
    );

    const certificationMap = new Map(
      certifications.map((certification) => [
        certification._id.toString(),
        certification,
      ])
    );

    /*
     * =====================================================
     * FORMAT TRAINERS
     * =====================================================
     */

    const formattedTrainers = trainers.map(
      (trainer) => ({
        ...trainer,

        /*
         * Skills
         */
        skills: Array.isArray(trainer.skills)
          ? trainer.skills
              .map((id) =>
                skillMap.get(id.toString())
              )
              .filter(Boolean)
          : [],

        /*
         * Tools
         */
        toolsTeach: Array.isArray(
          trainer.toolsTeach
        )
          ? trainer.toolsTeach
              .map((id) =>
                toolMap.get(id.toString())
              )
              .filter(Boolean)
          : [],

        /*
         * Certifications
         */
        certifications: Array.isArray(
          trainer.certifications
        )
          ? trainer.certifications
              .map((id) =>
                certificationMap.get(
                  id.toString()
                )
              )
              .filter(Boolean)
          : [],
      })
    );

    /*
     * =====================================================
     * PRESERVE LOCALSTORAGE ORDER
     * =====================================================
     */

    const trainerMap = new Map(
      formattedTrainers.map((trainer) => [
        trainer._id.toString(),
        trainer,
      ])
    );

    const orderedTrainers = ids
      .map((id) => trainerMap.get(id))
      .filter(Boolean);

    return NextResponse.json({
      success: true,
      count: orderedTrainers.length,
      trainers: orderedTrainers,
    });
  } catch (error) {
    console.error(
      "Compare trainers error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to compare trainers",
      },
      { status: 500 }
    );
  }
}