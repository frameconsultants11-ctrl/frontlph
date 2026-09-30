"use client";

import TransactionHistory from "@/component/profile/TransactionHistory";
import WalletSummary from "@/component/profile/WalletSummary";
import { useEffect, useState } from "react";


export default function WalletPage() {
  const [wallet, setWallet] = useState({
    balance: 0,
    totalCredits: 0,
    totalDebits: 0,
  });

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWallet = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/wallet",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to fetch wallet"
        );
      }

      setWallet(
        data.wallet || {
          balance: 0,
          totalCredits: 0,
          totalDebits: 0,
        }
      );

      setTransactions(data.transactions || []);
    } catch (error) {
      console.error("Wallet fetch error:", error);

      setError(
        error.message || "Unable to load wallet"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  if (error) {
    return (
      <div className="rounded-[18px] border border-red-100 bg-red-50 p-5">
        <p className="text-[13px] font-medium text-red-600">
          {error}
        </p>

        <button
          type="button"
          onClick={fetchWallet}
          className="mt-3 rounded-[8px] bg-[#173f32] px-4 py-2 text-[12px] font-medium text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <WalletSummary
        balance={wallet.balance}
        totalCredits={wallet.totalCredits}
        totalDebits={wallet.totalDebits}
      />

      <TransactionHistory
        transactions={transactions}
        loading={loading}
      />
    </div>
  );
}