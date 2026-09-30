import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { randomUUID } from "crypto";

export const authOptions = {
  debug: true,

  trustHost: true,

  session: {
    strategy: "jwt",
    maxAge: 60 * 30,
  },

  jwt: {
    maxAge: 60 * 30,
  },

  providers: [
    // =====================================================
    // MOBILE LOGIN
    // =====================================================
    CredentialsProvider({
      name: "Mobile Login",

      credentials: {
        mobile: {
          label: "Mobile",
          type: "text",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials, req) {
        if (!credentials?.mobile || !credentials?.password) {
          return null;
        }

        const client = await clientPromise;
        const db = client.db("tickloapp");

        const user = await db.collection("users").findOne({
          mobile: credentials.mobile,
        });

        if (!user) {
          return null;
        }

        if (user.isBlocked) {
          return null;
        }

        if (!user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          return null;
        }

        await db.collection("users").updateOne(
          {
            _id: user._id,
          },
          {
            $set: {
              lastLogin: new Date(),
            },
          }
        );

        const ip =
          req?.headers?.["x-forwarded-for"] ||
          req?.headers?.["x-real-ip"] ||
          "unknown";

        const userAgent =
          req?.headers?.["user-agent"] ||
          "unknown";

        return {
          id: user._id.toString(),
          name: user.name || "",
          email: user.email || null,
          role: user.role || "user",

          ipAddress: ip,
          userAgent,
        };
      },
    }),

    // =====================================================
    // GOOGLE LOGIN
    // =====================================================
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    // =====================================================
    // JWT
    // =====================================================
    async jwt({
      token,
      user,
      account,
      profile,
    }) {
      const client = await clientPromise;
      const db = client.db("tickloapp");

      // ===================================================
      // GOOGLE LOGIN
      // ===================================================
      if (account?.provider === "google") {
        let existingUser =
          await db.collection("users").findOne({
            email: profile?.email,
          });

        // -----------------------------------------------
        // CREATE GOOGLE USER
        // -----------------------------------------------
        if (!existingUser) {
          const newUser =
            await db.collection("users").insertOne({
              name: profile?.name || "",
              email: profile?.email || "",
              image: profile?.picture || "",

              role: "user",

              provider: "google",

              createdAt: new Date(),
              lastLogin: new Date(),
            });

          existingUser = {
            _id: newUser.insertedId,

            name: profile?.name || "",
            email: profile?.email || "",

            role: "user",
          };
        } else {
          // ---------------------------------------------
          // UPDATE EXISTING GOOGLE USER LOGIN
          // ---------------------------------------------
          await db.collection("users").updateOne(
            {
              _id: existingUser._id,
            },
            {
              $set: {
                lastLogin: new Date(),
                provider: "google",
              },
            }
          );
        }

        token.id = existingUser._id.toString();
        token.name = existingUser.name;
        token.email = existingUser.email;
        token.role = existingUser.role || "user";

        token.sessionId = randomUUID();
      }

      // ===================================================
      // MOBILE LOGIN
      // ===================================================
      if (account?.provider === "credentials") {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role || "user";

        token.sessionId = randomUUID();
      }

      // ===================================================
      // DEVICE SESSION CONTROL
      // ===================================================
      if (token?.id && token?.sessionId) {
        let userObjectId;

        try {
          userObjectId = new ObjectId(token.id);
        } catch {
          return token;
        }

        const activeSessions =
          await db
            .collection("userSessions")
            .find({
              userId: userObjectId,
              isActive: true,
            })
            .sort({
              createdAt: 1,
            })
            .toArray();

        // Maximum 2 active devices
        if (activeSessions.length >= 2) {
          const oldestSession =
            activeSessions[0];

          await db
            .collection("userSessions")
            .updateOne(
              {
                _id: oldestSession._id,
              },
              {
                $set: {
                  isActive: false,
                },
              }
            );
        }

        await db
          .collection("userSessions")
          .insertOne({
            userId: userObjectId,

            sessionId: token.sessionId,

            createdAt: new Date(),

            lastActivity: new Date(),

            expiresAt: new Date(
              Date.now() + 30 * 60 * 1000
            ),

            isActive: true,
          });
      }

      return token;
    },

    // =====================================================
    // SESSION
    // =====================================================
    async session({ session, token }) {
      if (!token?.id) {
        return null;
      }

      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        role: token.role,
      };

      return session;
    },

    // =====================================================
    // REDIRECT
    // =====================================================
    async redirect({ baseUrl }) {
      return baseUrl;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

// =========================================================
// NEXTAUTH HANDLER
// =========================================================

const handler = NextAuth(authOptions);

export {
  handler as GET,
  handler as POST,
};