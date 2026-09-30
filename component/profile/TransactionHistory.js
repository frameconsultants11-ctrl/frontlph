"use client";

import { History, Loader2 } from "lucide-react";
import TransactionRow from "./TransactionRow";

export default function TransactionHistory({
  transactions = [],
  loading = false,
}) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-[#e8ece9] bg-white">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#edf0ee] px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#f1f7ef]">
            <History
              size={17}
              className="text-[#173f32]"
            />
          </div>

          <div>
            <h2 className="text-[14px] font-semibold text-[#17251f]">
              Transaction History
            </h2>

            <p className="mt-0.5 text-[11px] text-[#8a948f]">
              Your wallet activity
            </p>
          </div>
        </div>

        <span className="rounded-full bg-[#f4f6f4] px-2.5 py-1 text-[10px] font-medium text-[#68736d]">
          {transactions.length}{" "}
          {transactions.length === 1
            ? "Transaction"
            : "Transactions"}
        </span>
      </div>

      {/* Table heading */}
      {transactions.length > 0 && !loading && (
        <div className="hidden grid-cols-[minmax(220px,1fr)_140px_120px] border-b border-[#edf0ee] bg-[#fafbfa] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.5px] text-[#8a948f] sm:grid">
          <span>Transaction</span>
          <span>Date</span>
          <span className="text-right">Amount</span>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex min-h-[180px] items-center justify-center">
          <Loader2
            size={22}
            className="animate-spin text-[#173f32]"
          />
        </div>
      )}

      {/* Empty */}
      {!loading && transactions.length === 0 && (
        <div className="flex min-h-[220px] flex-col items-center justify-center px-5 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f1f7ef]">
            <History
              size={20}
              className="text-[#718078]"
            />
          </div>

          <p className="mt-3 text-[13px] font-semibold text-[#17251f]">
            No transactions yet
          </p>

          <p className="mt-1 max-w-[280px] text-[11px] leading-5 text-[#8a948f]">
            Your wallet transactions will appear here.
          </p>
        </div>
      )}

      {/* Transactions */}
      {!loading &&
        transactions.length > 0 &&
        transactions.map((transaction) => (
          <TransactionRow
            key={transaction.id}
            transaction={transaction}
          />
        ))}
    </div>
  );
}