import { getDb } from "./db";

export async function createDbIndexes() {
  const db = await getDb();

  await db.collection("users").createIndex(
    { email: 1 },
    {
      unique: true,
      sparse: true,
    }
  );

  await db.collection("users").createIndex(
    { mobile: 1 },
    {
      unique: true,
      sparse: true,
    }
  );

  await db.collection("users").createIndex(
    { googleId: 1 },
    {
      unique: true,
      sparse: true,
    }
  );

  await db.collection("users").createIndex(
    { referralCode: 1 },
    {
      unique: true,
    }
  );

  await db.collection("referrals").createIndex(
    { referredUserId: 1 },
    {
      unique: true,
    }
  );

  await db.collection("referrals").createIndex({
    referrerId: 1,
  });

  await db.collection("wallets").createIndex(
    { userId: 1 },
    {
      unique: true,
    }
  );

  await db.collection("wallet_transactions").createIndex({
    userId: 1,
    createdAt: -1,
  });

  await db.collection("entitlements").createIndex({
    userId: 1,
    type: 1,
  });

  console.log("MongoDB indexes created");
}