import crypto from "crypto";

export async function createUniqueReferralCode(db) {
  const users = db.collection("users");

  while (true) {
    const code = crypto
      .randomBytes(6)
      .toString("hex")
      .substring(0, 8)
      .toUpperCase();

    const existing = await users.findOne({
      referralCode: code,
    });

    if (!existing) {
      return code;
    }
  }
}