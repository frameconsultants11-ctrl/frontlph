import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

import { cookies, headers } from "next/headers";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { ObjectId } from "mongodb";

import clientPromise from "./mongodb";
import { createUniqueReferralCode } from "./referral";

const DB_NAME = "learnPerHour";

const MAX_SESSIONS = 2;

const REFERRAL_REWARD = 100;

/*
 * ==========================================
 * NEXTAUTH
 * ==========================================
 */

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  /*
   * ==========================================
   * PROVIDERS
   * ==========================================
   */

  providers: [
    /*
     * ----------------------------------------
     * GOOGLE
     * ----------------------------------------
     */

    Google({
      clientId:
        process.env.GOOGLE_CLIENT_ID,

      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET,
    }),

    /*
     * ----------------------------------------
     * MOBILE + PASSWORD
     * ----------------------------------------
     */

    Credentials({
      name: "Mobile Login",

      credentials: {
        mobile: {
          label: "Mobile",
          type: "text",
          placeholder: "Mobile number",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        try {
          const mobile =
            credentials?.mobile
              ?.toString()
              ?.trim();

          const password =
            credentials?.password
              ?.toString();

          /*
           * --------------------------------------
           * BASIC VALIDATION
           * --------------------------------------
           */

          if (!mobile) {
            return null;
          }

          if (!password) {
            return null;
          }

          /*
           * --------------------------------------
           * FIND USER
           * --------------------------------------
           */

          const client =
            await clientPromise;

          const db =
            client.db(DB_NAME);

          const users =
            db.collection("users");

          /*
           * IMPORTANT:
           *
           * This assumes your users collection
           * stores mobile as:
           *
           * mobile: "9876543210"
           *
           * If you store countryCode separately,
           * adjust this query.
           */

          const user =
            await users.findOne({
              mobile,
            });

          if (!user) {
            return null;
          }

          /*
           * --------------------------------------
           * PASSWORD CHECK
           * --------------------------------------
           */

          if (!user.password) {
            /*
             * Google-only account
             */
            return null;
          }

          const passwordValid =
            await bcrypt.compare(
              password,
              user.password
            );

          if (!passwordValid) {
            return null;
          }

          /*
           * --------------------------------------
           * RETURN AUTH USER
           * --------------------------------------
           */

          return {
            id:
              user._id.toString(),

            name:
              user.name || "",

            email:
              user.email || "",

            image:
              user.image || "",

            role:
              user.role || "user",

            referralCode:
              user.referralCode ||
              null,

            mobile:
              user.mobile || mobile,

            provider:
              "credentials",
          };
        } catch (error) {
          console.error(
            "CREDENTIALS AUTHORIZE ERROR:",
            error
          );

          return null;
        }
      },
    }),
  ],

  /*
   * ==========================================
   * SESSION
   * ==========================================
   *
   * JWT is intentionally very long lived.
   *
   * MongoDB controls actual session validity.
   */

  session: {
    strategy: "jwt",

    /*
     * Approximately 10 years.
     */

    maxAge:
      60 *
      60 *
      24 *
      365 *
      10,

    /*
     * Refresh token periodically.
     */

    updateAge:
      60 * 60 * 24,
  },

  /*
   * ==========================================
   * PAGES
   * ==========================================
   */

  pages: {
    signIn: "/login",
  },

  /*
   * ==========================================
   * SECRET
   * ==========================================
   */

  secret:
    process.env.AUTH_SECRET,

  /*
   * ==========================================
   * CALLBACKS
   * ==========================================
   */

  callbacks: {
    /*
     * ========================================
     * SIGN IN
     * ========================================
     *
     * This callback:
     *
     * 1. Creates Google users
     * 2. Updates existing users
     * 3. Checks session limit
     * 4. Creates MongoDB session
     */

    async signIn({
      user,
      account,
      profile,
    }) {
      try {
        /*
         * --------------------------------------
         * ONLY SUPPORT GOOGLE + CREDENTIALS
         * --------------------------------------
         */

        if (
          account?.provider !==
            "google" &&
          account?.provider !==
            "credentials"
        ) {
          return false;
        }

        const client =
          await clientPromise;

        const db =
          client.db(DB_NAME);

        const users =
          db.collection("users");

        const wallets =
          db.collection("wallets");

        const entitlements =
          db.collection(
            "entitlements"
          );

        const referrals =
          db.collection(
            "referrals"
          );

        const walletTransactions =
          db.collection(
            "wallet_transactions"
          );

        const sessions =
          db.collection("sessions");

        /*
         * ======================================
         * FIND USER
         * ======================================
         */

        let dbUser = null;

        /*
         * --------------------------------------
         * GOOGLE USER
         * --------------------------------------
         */

        if (
          account?.provider ===
          "google"
        ) {
          dbUser =
            await users.findOne({
              email:
                profile?.email,
            });

          /*
           * ====================================
           * CREATE GOOGLE USER
           * ====================================
           */

          if (!dbUser) {
            const now =
              new Date();

            /*
             * Generate referral code
             */

            const referralCode =
              await createUniqueReferralCode(
                db
              );

            /*
             * Create user
             */

            const result =
              await users.insertOne({
                name:
                  profile?.name ||
                  "",

                email:
                  profile?.email ||
                  "",

                image:
                  profile?.picture ||
                  "",

                provider:
                  "google",

                role: "user",

                referralCode,

                activeSessionCount: 0,

                createdAt: now,

                updatedAt: now,

                lastLogin: now,
              });

            dbUser = {
              _id:
                result.insertedId,

              name:
                profile?.name ||
                "",

              email:
                profile?.email ||
                "",

              image:
                profile?.picture ||
                "",

              provider:
                "google",

              role: "user",

              referralCode,

              activeSessionCount: 0,
            };

            /*
             * ==================================
             * CREATE WALLET
             * ==================================
             */

            await wallets.insertOne({
              userId:
                result.insertedId,

              balance: 0,

              createdAt: now,

              updatedAt: now,
            });

            /*
             * ==================================
             * FIRST FREE CALL
             * ==================================
             */

            await entitlements.insertOne({
              userId:
                result.insertedId,

              type:
                "FIRST_FREE_CALL",

              durationMinutes: 15,

              status:
                "AVAILABLE",

              createdAt: now,

              updatedAt: now,
            });

            /*
             * ==================================
             * REFERRAL
             * ==================================
             */

            try {
              const cookieStore =
                await cookies();

              const referralCookie =
                cookieStore.get(
                  "referral_code"
                );

              const referredByCode =
                referralCookie?.value
                  ?.toUpperCase();

              if (
                referredByCode
              ) {
                const referrer =
                  await users.findOne({
                    referralCode:
                      referredByCode,
                  });

                /*
                 * Make sure referrer exists
                 */

                if (
                  referrer &&
                  referrer._id.toString() !==
                    result.insertedId.toString()
                ) {
                  /*
                   * Prevent duplicate
                   */

                  const existingReferral =
                    await referrals.findOne({
                      referredUserId:
                        result.insertedId,
                    });

                  if (
                    !existingReferral
                  ) {
                    const referralResult =
                      await referrals.insertOne(
                        {
                          referrerId:
                            referrer._id,

                          referredUserId:
                            result.insertedId,

                          referralCode:
                            referredByCode,

                          status:
                            "REWARDED",

                          referrerReward:
                            REFERRAL_REWARD,

                          referredUserReward:
                            REFERRAL_REWARD,

                          createdAt:
                            now,

                          rewardedAt:
                            now,

                          updatedAt:
                            now,
                        }
                      );

                    /*
                     * Referrer reward
                     */

                    await wallets.updateOne(
                      {
                        userId:
                          referrer._id,
                      },
                      {
                        $inc: {
                          balance:
                            REFERRAL_REWARD,
                        },

                        $set: {
                          updatedAt:
                            now,
                        },
                      }
                    );

                    /*
                     * New user reward
                     */

                    await wallets.updateOne(
                      {
                        userId:
                          result.insertedId,
                      },
                      {
                        $inc: {
                          balance:
                            REFERRAL_REWARD,
                        },

                        $set: {
                          updatedAt:
                            now,
                        },
                      }
                    );

                    /*
                     * Referrer transaction
                     */

                    await walletTransactions.insertOne(
                      {
                        userId:
                          referrer._id,

                        type:
                          "REFERRAL_REWARD",

                        amount:
                          REFERRAL_REWARD,

                        direction:
                          "CREDIT",

                        referralId:
                          referralResult.insertedId,

                        description:
                          "Referral reward - 100 points",

                        createdAt:
                          now,
                      }
                    );

                    /*
                     * New user transaction
                     */

                    await walletTransactions.insertOne(
                      {
                        userId:
                          result.insertedId,

                        type:
                          "REFERRAL_REWARD",

                        amount:
                          REFERRAL_REWARD,

                        direction:
                          "CREDIT",

                        referralId:
                          referralResult.insertedId,

                        description:
                          "Referral signup reward - 100 points",

                        createdAt:
                          now,
                      }
                    );

                    /*
                     * Delete referral cookie
                     */

                    cookieStore.delete(
                      "referral_code"
                    );
                  }
                }
              }
            } catch (
              referralError
            ) {
              /*
               * Referral failure should
               * never break login.
               */

              console.error(
                "Referral reward error:",
                referralError
              );
            }
          }
        }

        /*
         * --------------------------------------
         * CREDENTIALS USER
         * --------------------------------------
         *
         * authorize() already found and
         * verified the user.
         */

        if (
          account?.provider ===
          "credentials"
        ) {
          try {
            dbUser =
              await users.findOne({
                _id:
                  new ObjectId(
                    user.id
                  ),
              });
          } catch {
            return false;
          }

          if (!dbUser) {
            return false;
          }
        }

        /*
         * ======================================
         * EXISTING USER
         * ======================================
         */

        if (dbUser) {
          const now =
            new Date();

          const updateData = {
            lastLogin: now,

            updatedAt: now,
          };

          /*
           * Update Google profile
           */

          if (
            account?.provider ===
            "google"
          ) {
            updateData.name =
              profile?.name ||
              dbUser.name ||
              "";

            updateData.image =
              profile?.picture ||
              dbUser.image ||
              "";

            /*
             * Don't overwrite
             * credentials provider
             * if user already has one.
             */
          }

          await users.updateOne(
            {
              _id:
                dbUser._id,
            },
            {
              $set:
                updateData,
            }
          );
        }

        /*
         * ======================================
         * SESSION LIMIT
         * ======================================
         *
         * Maximum:
         *
         *       2 ACTIVE SESSIONS
         *
         * Atomic MongoDB update prevents
         * simultaneous 3rd logins from both
         * getting through.
         */

        const sessionId =
          crypto.randomUUID();

        const reserveSession =
          await users.updateOne(
            {
              _id:
                dbUser._id,

              $or: [
                {
                  activeSessionCount: {
                    $exists: false,
                  },
                },

                {
                  activeSessionCount: {
                    $lt:
                      MAX_SESSIONS,
                  },
                },
              ],
            },
            {
              $inc: {
                activeSessionCount: 1,
              },
            }
          );

        /*
         * ======================================
         * THIRD DEVICE
         * ======================================
         */

        if (
          reserveSession.modifiedCount !==
          1
        ) {
          console.log(
            "MAX ACTIVE SESSIONS:",
            dbUser._id.toString()
          );

          return "/login?error=MAX_SESSIONS";
        }

        /*
         * ======================================
         * DEVICE INFORMATION
         * ======================================
         */

        const headerStore =
          await headers();

        const userAgent =
          headerStore.get(
            "user-agent"
          ) ||
          "Unknown device";

        const forwardedFor =
          headerStore.get(
            "x-forwarded-for"
          );

        const realIp =
          headerStore.get(
            "x-real-ip"
          );

        const ipAddress =
          forwardedFor
            ?.split(",")[0]
            ?.trim() ||
          realIp ||
          "Unknown";

        /*
         * ======================================
         * CREATE SESSION
         * ======================================
         */

        try {
          await sessions.insertOne({
            sessionId,

            userId:
              dbUser._id,

            userAgent,

            ipAddress,

            createdAt:
              new Date(),

            lastActiveAt:
              new Date(),

            active: true,
          });
        } catch (error) {
          /*
           * Roll back session count
           */

          await users.updateOne(
            {
              _id:
                dbUser._id,
            },
            {
              $inc: {
                activeSessionCount:
                  -1,
              },
            }
          );

          throw error;
        }

        /*
         * ======================================
         * PASS SESSION INFORMATION TO USER
         * ======================================
         */

        user.id =
          dbUser._id.toString();

        user.sessionId =
          sessionId;

        user.name =
          dbUser.name ||
          user.name ||
          "";

        user.email =
          dbUser.email ||
          user.email ||
          "";

        user.image =
          dbUser.image ||
          user.image ||
          "";

        user.role =
          dbUser.role ||
          "user";

        user.referralCode =
          dbUser.referralCode ||
          null;

        user.mobile =
          dbUser.mobile ||
          user.mobile ||
          null;

        return true;
      } catch (error) {
        console.error(
          "SIGN IN ERROR:",
          error
        );

        return "/login?error=AUTH_ERROR";
      }
    },

    /*
     * ========================================
     * JWT
     * ========================================
     */

    async jwt({
      token,
      user,
      account,
    }) {
      /*
       * ======================================
       * INITIAL LOGIN
       * ======================================
       */

      if (
        user &&
        account
      ) {
        token.id =
          user.id;

        token.sessionId =
          user.sessionId;

        token.name =
          user.name;

        token.email =
          user.email;

        token.image =
          user.image;

        token.role =
          user.role ||
          "user";

        token.referralCode =
          user.referralCode ||
          null;

        token.mobile =
          user.mobile ||
          null;

        return token;
      }

      /*
       * ======================================
       * EXISTING SESSION
       * ======================================
       *
       * Every auth() call checks MongoDB.
       */

      if (
        token?.id &&
        token?.sessionId
      ) {
        const client =
          await clientPromise;

        const db =
          client.db(DB_NAME);

        let userId;

        try {
          userId =
            new ObjectId(
              token.id
            );
        } catch {
          return null;
        }

        /*
         * Find active session
         */

        const sessionRecord =
          await db
            .collection(
              "sessions"
            )
            .findOne({
              sessionId:
                token.sessionId,

              userId,

              active: true,
            });

        /*
         * Session terminated
         */

        if (!sessionRecord) {
          return null;
        }

        /*
         * Update activity
         */

        await db
          .collection(
            "sessions"
          )
          .updateOne(
            {
              sessionId:
                token.sessionId,

              userId,

              active: true,
            },
            {
              $set: {
                lastActiveAt:
                  new Date(),
              },
            }
          );
      }

      return token;
    },

    /*
     * ========================================
     * SESSION
     * ========================================
     */

    async session({
      session,
      token,
    }) {
      if (!token?.id) {
        return null;
      }

      session.user.id =
        token.id;

      session.user.sessionId =
        token.sessionId;

      session.user.name =
        token.name;

      session.user.email =
        token.email;

      session.user.image =
        token.image;

      session.user.role =
        token.role;

      session.user.referralCode =
        token.referralCode;

      session.user.mobile =
        token.mobile;

      return session;
    },
  },

  /*
   * ==========================================
   * EVENTS
   * ==========================================
   */

  events: {
    /*
     * ========================================
     * LOGOUT
     * ========================================
     *
     * Auth.js removes the JWT cookie.
     *
     * We ALSO mark the MongoDB session
     * as inactive.
     */

    async signOut({
      token,
    }) {
      try {
        if (
          !token?.id ||
          !token?.sessionId
        ) {
          return;
        }

        const client =
          await clientPromise;

        const db =
          client.db(DB_NAME);

        let userId;

        try {
          userId =
            new ObjectId(
              token.id
            );
        } catch {
          return;
        }

        /*
         * Mark current session inactive
         */

        const result =
          await db
            .collection(
              "sessions"
            )
            .updateOne(
              {
                sessionId:
                  token.sessionId,

                userId,

                active: true,
              },
              {
                $set: {
                  active: false,

                  logoutAt:
                    new Date(),

                  terminatedAt:
                    new Date(),
                },
              }
            );

        /*
         * Only decrement when we
         * actually deactivated a
         * session.
         */

        if (
          result.modifiedCount ===
          1
        ) {
          await db
            .collection("users")
            .updateOne(
              {
                _id: userId,

                activeSessionCount: {
                  $gt: 0,
                },
              },
              {
                $inc: {
                  activeSessionCount:
                    -1,
                },
              }
            );
        }

        console.log(
          "SESSION LOGGED OUT:",
          token.sessionId
        );
      } catch (error) {
        console.error(
          "AUTH SIGNOUT ERROR:",
          error
        );
      }
    },
  },
});