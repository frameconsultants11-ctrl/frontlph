
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
const DB_NAME = "learnPerHour";

export async function GET() {
  try {

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    let userId;

    try {
      userId = new ObjectId(
        session.user.id
      );
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user ID",
        },
        {
          status: 400,
        }
      );
    }

    const client =
      await clientPromise;

    const db =
      client.db(DB_NAME);

    const wallets =
      db.collection("wallets");

    const walletTransactions =
      db.collection(
        "wallet_transactions"
      );


    const wallet =
      await wallets.findOne({
        userId,
      });


    const transactionDocs =
      await walletTransactions
        .find({
          userId,
        })
        .sort({
          createdAt: -1,
        })
        .toArray();


    let totalCredits = 0;
    let totalDebits = 0;

    for (
      const transaction
      of transactionDocs
    ) {
      const amount =
        Number(
          transaction.amount
        ) || 0;

      if (
        transaction.direction ===
        "CREDIT"
      ) {
        totalCredits += amount;
      }

      if (
        transaction.direction ===
        "DEBIT"
      ) {
        totalDebits += amount;
      }
    }

    // ==========================================
    // FORMAT TRANSACTIONS
    // ==========================================

    const transactions =
      transactionDocs.map(
        (transaction) => {
          const amount =
            Number(
              transaction.amount
            ) || 0;

          const direction =
            transaction.direction ===
            "DEBIT"
              ? "DEBIT"
              : "CREDIT";

          const isCredit =
            direction === "CREDIT";

          return {
            id: transaction._id.toString(),

            type:
              transaction.type ||
              "TRANSACTION",

            title:
              formatTransactionType(
                transaction.type
              ),

     
            description:
              transaction.description ||
              "",

            amount,

            direction,

            sign:
              isCredit
                ? "+"
                : "-",

            formattedAmount:
              `${isCredit ? "+" : "-"}${amount}`,

            referralId:
              transaction.referralId
                ? transaction.referralId.toString()
                : null,

            createdAt:
              transaction.createdAt || null,

            date:
              formatDate(
                transaction.createdAt
              ),

            time:
              formatTime(
                transaction.createdAt
              ),
          };
        }
      );


    return NextResponse.json({
      success: true,

      wallet: {
        balance:
          Number(
            wallet?.balance
          ) || 0,

        totalCredits,

        totalDebits,

        transactionCount:
          transactions.length,
      },

      transactions,
    });
  } catch (error) {
    console.error(
      "WALLET TRANSACTIONS API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch wallet transactions",
      },
      {
        status: 500,
      }
    );
  }
}



function formatTransactionType(type) {
  if (!type) {
    return "Transaction";
  }

  return String(type)
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase()
    );
}

function formatDate(date) {
  if (!date) {
    return "";
  }

  try {
    return new Intl.DateTimeFormat(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ).format(
      new Date(date)
    );
  } catch {
    return "";
  }
}

function formatTime(date) {
  if (!date) {
    return "";
  }

  try {
    return new Intl.DateTimeFormat(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }
    ).format(
      new Date(date)
    );
  } catch {
    return "";
  }
}
