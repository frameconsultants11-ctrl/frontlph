import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import clientPromise from "@/lib/mongodb";

const DB_NAME = "learnPerHour";

const ALLOWED_LIMITS = [10, 20, 50, 100];

const EDUCATION_OPTIONS = [
  {
    value: "high_school",
    label: "High School",
  },
  {
    value: "diploma",
    label: "Diploma",
  },
  {
    value: "bachelors",
    label: "Bachelor's",
  },
  {
    value: "masters",
    label: "Master's",
  },
  {
    value: "phd",
    label: "PhD",
  },
];

const EXPERIENCE_OPTIONS = [
  {
    value: "0-2",
    label: "0 - 2 years",
  },
  {
    value: "3-5",
    label: "3 - 5 years",
  },
  {
    value: "5-10",
    label: "5 - 10 years",
  },
  {
    value: "10+",
    label: "10+ years",
  },
];

/**
 * Escape regex characters so user search
 * cannot accidentally create an invalid regex.
 */
function escapeRegex(value = "") {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}

/**
 * Get repeated query params.
 *
 * Supports:
 *
 * ?skill=id1&skill=id2
 *
 * and:
 *
 * ?skill=id1,id2
 */
function getArrayParam(searchParams, key) {
  const values = searchParams.getAll(key);

  return values
    .flatMap((value) =>
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    )
    .filter(
      (value, index, array) =>
        array.indexOf(value) === index
    );
}

/**
 * Convert valid strings to ObjectIds.
 */
function toObjectIds(values = []) {
  return values
    .filter((value) => ObjectId.isValid(value))
    .map((value) => new ObjectId(value));
}

/**
 * Convert MongoDB ObjectIds into strings
 * before returning JSON.
 */
function serializeObjectIds(value) {
  if (value === null || value === undefined) {
    return value;
  }

  if (value instanceof ObjectId) {
    return value.toString();
  }

  if (Array.isArray(value)) {
    return value.map(serializeObjectIds);
  }

  if (
    typeof value === "object" &&
    value.constructor === Object
  ) {
    const output = {};

    for (const [key, item] of Object.entries(
      value
    )) {
      output[key] =
        serializeObjectIds(item);
    }

    return output;
  }

  return value;
}

/**
 * Experience filter condition.
 */
function getExperienceCondition(value) {
  switch (value) {
    case "0-2":
      return {
        experienceYears: {
          $gte: 0,
          $lte: 2,
        },
      };

    case "3-5":
      return {
        experienceYears: {
          $gte: 3,
          $lte: 5,
        },
      };

    case "5-10":
      return {
        experienceYears: {
          $gt: 5,
          $lte: 10,
        },
      };

    case "10+":
      return {
        experienceYears: {
          $gt: 10,
        },
      };

    default:
      return null;
  }
}

export async function GET(request) {
  try {
    const { searchParams } =
      new URL(request.url);

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    const requestedPage = Number.parseInt(
      searchParams.get("page") || "1",
      10
    );

    const page = Math.max(
      Number.isNaN(requestedPage)
        ? 1
        : requestedPage,
      1
    );

    const requestedLimit = Number.parseInt(
      searchParams.get("limit") || "20",
      10
    );

    const limit = ALLOWED_LIMITS.includes(
      requestedLimit
    )
      ? requestedLimit
      : 20;

    const skip = (page - 1) * limit;

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    const search =
      searchParams.get("search")?.trim() || "";

    /*
    |--------------------------------------------------------------------------
    | Filters
    |--------------------------------------------------------------------------
    */

    const skillIds = toObjectIds(
      getArrayParam(searchParams, "skill")
    );

    const toolIds = toObjectIds(
      getArrayParam(searchParams, "tool")
    );

    const certificationIds = toObjectIds(
      getArrayParam(
        searchParams,
        "certification"
      )
    );

    const educationLevels =
      getArrayParam(
        searchParams,
        "education"
      );

    const experienceRanges =
      getArrayParam(
        searchParams,
        "experience"
      );

    /*
    |--------------------------------------------------------------------------
    | Availability
    |--------------------------------------------------------------------------
    */

    const available =
      searchParams.get("available");

    /*
    |--------------------------------------------------------------------------
    | Hourly rate
    |--------------------------------------------------------------------------
    */

    const minRateParam =
      searchParams.get("minRate");

    const maxRateParam =
      searchParams.get("maxRate");

    const minRate =
      minRateParam !== null &&
      minRateParam !== ""
        ? Number(minRateParam)
        : null;

    const maxRate =
      maxRateParam !== null &&
      maxRateParam !== ""
        ? Number(maxRateParam)
        : null;

    /*
    |--------------------------------------------------------------------------
    | Sorting
    |--------------------------------------------------------------------------
    */

    const sort =
      searchParams.get("sort") || "newest";

    /*
    |--------------------------------------------------------------------------
    | DB
    |--------------------------------------------------------------------------
    */

    const client = await clientPromise;

    const db = client.db(DB_NAME);

    const trainersCollection =
      db.collection("trainers");

    /*
    |--------------------------------------------------------------------------
    | Base Match
    |--------------------------------------------------------------------------
    |
    | Only active trainers are shown.
    |
    */

    const match = {
      isActive: true,
    };

    /*
    |--------------------------------------------------------------------------
    | Skill filter
    |--------------------------------------------------------------------------
    */

    if (skillIds.length > 0) {
      match.skills = {
        $in: skillIds,
      };
    }

    /*
    |--------------------------------------------------------------------------
    | Tool filter
    |--------------------------------------------------------------------------
    */

    if (toolIds.length > 0) {
      match.toolsTeach = {
        $in: toolIds,
      };
    }

    /*
    |--------------------------------------------------------------------------
    | Certification filter
    |--------------------------------------------------------------------------
    */

    if (certificationIds.length > 0) {
      match.certifications = {
        $in: certificationIds,
      };
    }

    /*
    |--------------------------------------------------------------------------
    | Education filter
    |--------------------------------------------------------------------------
    */

    if (educationLevels.length > 0) {
      match["education.level"] = {
        $in: educationLevels,
      };
    }

    /*
    |--------------------------------------------------------------------------
    | Availability filter
    |--------------------------------------------------------------------------
    */

    if (available === "true") {
      match.isAvailable = true;
    }

    if (available === "false") {
      match.isAvailable = false;
    }

    /*
    |--------------------------------------------------------------------------
    | Hourly rate filter
    |--------------------------------------------------------------------------
    */

    if (
      minRate !== null &&
      !Number.isNaN(minRate)
    ) {
      match.hourlyRate = {
        ...(match.hourlyRate || {}),
        $gte: minRate,
      };
    }

    if (
      maxRate !== null &&
      !Number.isNaN(maxRate)
    ) {
      match.hourlyRate = {
        ...(match.hourlyRate || {}),
        $lte: maxRate,
      };
    }

    /*
    |--------------------------------------------------------------------------
    | Current year
    |--------------------------------------------------------------------------
    */

    const currentYear =
      new Date().getFullYear();

    /*
    |--------------------------------------------------------------------------
    | Aggregation
    |--------------------------------------------------------------------------
    */

    const pipeline = [
      /*
      |--------------------------------------------------------------------------
      | Base filtering
      |--------------------------------------------------------------------------
      */

      {
        $match: match,
      },

      /*
      |--------------------------------------------------------------------------
      | Populate Skills
      |--------------------------------------------------------------------------
      */

      {
        $lookup: {
          from: "skills",
          localField: "skills",
          foreignField: "_id",
          as: "skillDocs",
        },
      },

      /*
      |--------------------------------------------------------------------------
      | Populate Tools
      |--------------------------------------------------------------------------
      */

      {
        $lookup: {
          from: "tools",
          localField: "toolsTeach",
          foreignField: "_id",
          as: "toolDocs",
        },
      },

      /*
      |--------------------------------------------------------------------------
      | Populate Certifications
      |--------------------------------------------------------------------------
      */

      {
        $lookup: {
          from: "certifications",
          localField: "certifications",
          foreignField: "_id",
          as: "certificationDocs",
        },
      },

      /*
      |--------------------------------------------------------------------------
      | Calculate experience
      |--------------------------------------------------------------------------
      |
      | Example:
      |
      | from: "2021"
      |
      | current year: 2026
      |
      | experienceYears: 5
      |
      */

      {
        $set: {
          experienceStartYear: {
            $reduce: {
              input: {
                $ifNull: [
                  "$experience",
                  [],
                ],
              },

              initialValue: currentYear,

              in: {
                $min: [
                  "$$value",

                  {
                    $convert: {
                      input:
                        "$$this.from",

                      to: "int",

                      onError:
                        currentYear,

                      onNull:
                        currentYear,
                    },
                  },
                ],
              },
            },
          },
        },
      },

      {
        $set: {
          experienceYears: {
            $max: [
              0,

              {
                $subtract: [
                  currentYear,
                  "$experienceStartYear",
                ],
              },
            ],
          },
        },
      },
    ];

    /*
    |--------------------------------------------------------------------------
    | Experience filter
    |--------------------------------------------------------------------------
    */

    const experienceConditions =
      experienceRanges
        .map(getExperienceCondition)
        .filter(Boolean);

    if (experienceConditions.length > 0) {
      pipeline.push({
        $match: {
          $or: experienceConditions,
        },
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    |
    | Search works across:
    |
    | - trainer name
    | - email
    | - phone
    | - about
    | - designation
    | - company
    | - skill
    | - tool
    | - certification
    | - education
    |
    */

    if (search) {
      const searchRegex = {
        $regex: escapeRegex(search),
        $options: "i",
      };

      pipeline.push({
        $match: {
          $or: [
            {
              name: searchRegex,
            },

            {
              email: searchRegex,
            },

            {
              phone: searchRegex,
            },

            {
              about: searchRegex,
            },

            {
              "experience.designation":
                searchRegex,
            },

            {
              "experience.company":
                searchRegex,
            },

            {
              "skillDocs.name":
                searchRegex,
            },

            {
              "toolDocs.name":
                searchRegex,
            },

            {
              "certificationDocs.name":
                searchRegex,
            },

            {
              "education.institution":
                searchRegex,
            },
          ],
        },
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Sorting
    |--------------------------------------------------------------------------
    */

    let sortStage;

    switch (sort) {
      case "name_asc":
        sortStage = {
          name: 1,
        };
        break;

      case "name_desc":
        sortStage = {
          name: -1,
        };
        break;

      case "rate_low":
        sortStage = {
          hourlyRate: 1,
        };
        break;

      case "rate_high":
        sortStage = {
          hourlyRate: -1,
        };
        break;

      case "experience":
        sortStage = {
          experienceYears: -1,
        };
        break;

      case "oldest":
        sortStage = {
          createdAt: 1,
        };
        break;

      case "newest":
      default:
        sortStage = {
          createdAt: -1,
        };
        break;
    }

    pipeline.push({
      $sort: sortStage,
    });

    /*
    |--------------------------------------------------------------------------
    | Pagination + Count
    |--------------------------------------------------------------------------
    */

    pipeline.push({
      $facet: {
        data: [
          {
            $skip: skip,
          },

          {
            $limit: limit,
          },

          /*
          |--------------------------------------------------------------------------
          | Remove sensitive fields
          |--------------------------------------------------------------------------
          */

          {
            $project: {
              password: 0,

              /*
              | We don't need the raw IDs
              | after lookup.
              */

              skills: 0,
              toolsTeach: 0,
              certifications: 0,

              /*
              | Internal calculation.
              */

              experienceStartYear: 0,
            },
          },
        ],

        total: [
          {
            $count: "count",
          },
        ],
      },
    });

    const [aggregationResult] =
      await trainersCollection
        .aggregate(pipeline)
        .toArray();

    /*
    |--------------------------------------------------------------------------
    | Results
    |--------------------------------------------------------------------------
    */

    const trainers =
      aggregationResult?.data || [];

    const total =
      aggregationResult?.total?.[0]?.count ||
      0;

    const totalPages =
      total > 0
        ? Math.ceil(total / limit)
        : 0;

    /*
    |--------------------------------------------------------------------------
    | Filter options
    |--------------------------------------------------------------------------
    |
    | These are loaded from their own collections.
    |
    */

    const [
      skillOptions,
      toolOptions,
      certificationOptions,
    ] = await Promise.all([
      db
        .collection("skills")
        .find({
          isActive: true,
        })
        .project({
          name: 1,
          image: 1,
        })
        .sort({
          name: 1,
        })
        .toArray(),

      db
        .collection("tools")
        .find({
          isActive: true,
        })
        .project({
          name: 1,
          image: 1,
        })
        .sort({
          name: 1,
        })
        .toArray(),

      db
        .collection("certifications")
        .find({
          isActive: true,
        })
        .project({
          name: 1,
          image: 1,
        })
        .sort({
          name: 1,
        })
        .toArray(),
    ]);

    /*
    |--------------------------------------------------------------------------
    | Serialize
    |--------------------------------------------------------------------------
    */

    const responseTrainers =
      serializeObjectIds(trainers);

    const responseFilters = {
      skills:
        serializeObjectIds(skillOptions),

      tools:
        serializeObjectIds(toolOptions),

      certifications:
        serializeObjectIds(
          certificationOptions
        ),

      education: EDUCATION_OPTIONS,

      experience: EXPERIENCE_OPTIONS,
    };

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    return NextResponse.json({
      success: true,

      data: responseTrainers,

      pagination: {
        page,
        limit,

        total,

        totalPages,

        hasNextPage:
          page < totalPages,

        hasPreviousPage:
          page > 1,
      },

      filters: responseFilters,

      appliedFilters: {
        search,

        skills: skillIds.map((id) =>
          id.toString()
        ),

        tools: toolIds.map((id) =>
          id.toString()
        ),

        certifications:
          certificationIds.map((id) =>
            id.toString()
          ),

        education:
          educationLevels,

        experience:
          experienceRanges,

        available:
          available || null,

        minRate:
          minRate !== null &&
          !Number.isNaN(minRate)
            ? minRate
            : null,

        maxRate:
          maxRate !== null &&
          !Number.isNaN(maxRate)
            ? maxRate
            : null,

        sort,
      },
    });
  } catch (error) {
    console.error(
      "GET TRAINERS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch trainers",
      },
      {
        status: 500,
      }
    );
  }
}