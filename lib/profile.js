import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export const DB = "learnPerHour";
const TYPES = [
  { type: "skill", collection: "skills" },
  { type: "tool", collection: "tools" },
  { type: "category", collection: "categories" },
  { type: "subCategory", collection: "subCategories" },
];

const iso = (d) => (d ? new Date(d).toISOString() : null);

/* every active skill / tool / category / subcategory as one searchable list */
export async function getOptions(db) {
  const [skills, tools, categories, subs] = await Promise.all(
    TYPES.map((t) =>
      db.collection(t.collection).find({ isActive: true }).project({ name: 1, categoryId: 1 }).sort({ name: 1 }).toArray()
    )
  );
  const catName = new Map(categories.map((c) => [String(c._id), c.name]));
  const make = (type, list, hint) =>
    list.map((d) => ({
      key: `${type}:${d._id}`,
      type,
      id: String(d._id),
      label: d.name || "",
      hint: hint ? hint(d) : "",
    }));
  return [
    ...make("category", categories),
    ...make("subCategory", subs, (d) => catName.get(String(d.categoryId)) || ""),
    ...make("skill", skills),
    ...make("tool", tools),
  ];
}

/* user for the browser: no password, role or createdAt */
export async function getProfile(email) {
  if (!email) return null;
  const client = await clientPromise;
  const db = client.db(DB);
  const u = await db.collection("users").findOne({ email: String(email).toLowerCase() });
  if (!u) return null;
  return {
    user: serializeUser(u),
    options: await getOptions(db),
  };
}

export const serializeUser = (u) => ({
  id: String(u._id),
  name: u.name || "",
  email: u.email || "",
  image: u.image || "",
  mobile: u.mobile || "",
  provider: u.provider || "",
  referralCode: u.referralCode || "",
  lastLogin: iso(u.lastLogin),
  activeSessionCount: Number(u.activeSessionCount ?? 0),
  profileCompleted: Boolean(u.profileCompleted),
  education: (u.education || []).map((e) => ({
    degree: e.degree || "",
    school: e.school || "",
    year: e.year ? String(e.year) : "",
  })),
  experience: (u.experience || []).map((e) => ({
    company: e.company || "",
    title: e.title || "",
    startYear: e.startYear ? String(e.startYear) : "",
    endYear: e.endYear ? String(e.endYear) : "",
    current: Boolean(e.current),
  })),
  interests: (u.interests || []).map((i) => `${i.type}:${i.id}`),
});

/* ---------------- validation ---------------- */
const str = (v, max) => String(v ?? "").trim().slice(0, max);
const MAX_YEAR = new Date().getFullYear() + 10;

const year = (v, label) => {
  const s = String(v ?? "").trim();
  if (!s) return { value: null };
  const n = Number(s);
  if (!/^\d{4}$/.test(s) || n < 1950 || n > MAX_YEAR) return { error: `${label} must be a year between 1950 and ${MAX_YEAR}.` };
  return { value: n };
};

export function validateProfile(body, validKeys) {
  const name = str(body.name, 80);
  if (!name) return { error: "Name is required." };

  let image = str(body.image, 500);
  if (image && !/^https:\/\/\S+$/i.test(image)) return { error: "Profile photo must be an https link." };

  let mobile = str(body.mobile, 20).replace(/[\s-]/g, "");
  if (mobile) {
    const m = mobile.match(/^(?:\+91|91|0)?([6-9]\d{9})$/);
    if (!m) return { error: "Enter a valid 10-digit Indian mobile number." };
    mobile = `+91${m[1]}`;
  }

  /* education */
  const education = [];
  const eduRows = Array.isArray(body.education) ? body.education.slice(0, 20) : [];
  for (const [i, row] of eduRows.entries()) {
    const degree = str(row?.degree, 120);
    const school = str(row?.school, 160);
    if (!degree && !school && !str(row?.year, 4)) continue; // empty row, skip
    if (!degree || !school) return { error: `Education ${i + 1}: degree and school are required.` };
    const y = year(row?.year, `Education ${i + 1} year`);
    if (y.error) return { error: y.error };
    education.push({ degree, school, year: y.value });
  }

  /* experience */
  const experience = [];
  const expRows = Array.isArray(body.experience) ? body.experience.slice(0, 20) : [];
  for (const [i, row] of expRows.entries()) {
    const company = str(row?.company, 160);
    const title = str(row?.title, 120);
    if (!company && !title && !str(row?.startYear, 4) && !str(row?.endYear, 4)) continue;
    if (!company) return { error: `Experience ${i + 1}: company is required.` };
    const s = year(row?.startYear, `Experience ${i + 1} start year`);
    if (s.error) return { error: s.error };
    if (!s.value) return { error: `Experience ${i + 1}: start year is required.` };
    const current = Boolean(row?.current);
    let endYear = null;
    if (!current) {
      const e = year(row?.endYear, `Experience ${i + 1} end year`);
      if (e.error) return { error: e.error };
      if (!e.value) return { error: `Experience ${i + 1}: add an end year or tick "Currently working".` };
      if (e.value < s.value) return { error: `Experience ${i + 1}: end year can't be before start year.` };
      endYear = e.value;
    }
    experience.push({ company, title, startYear: s.value, endYear, current });
  }

  /* interests: "type:id" keys, must exist and be active */
  const keys = [...new Set(Array.isArray(body.interests) ? body.interests : [])]
    .filter((k) => typeof k === "string" && validKeys.has(k))
    .slice(0, 60);
  const interests = keys.map((k) => {
    const [type, id] = k.split(":");
    return { type, id: new ObjectId(id) };
  });

  return {
    data: {
      name,
      image,
      mobile,
      education,
      experience,
      interests,
      profileCompleted: Boolean(name && mobile && interests.length),
    },
  };
}