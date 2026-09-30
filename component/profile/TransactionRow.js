"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";

export default function TransactionRow({ transaction }) {
  const isCredit = transaction.direction === "CREDIT";

  return (
    <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-[#edf0ee] px-4 py-4 last:border-b-0 sm:grid-cols-[minmax(220px,1fr)_140px_120px] sm:items-center">
      
      {/* Transaction */}
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            isCredit ? "bg-[#e2f9d7]" : "bg-[#fff0ef]"
          }`}
        >
          {isCredit ? (
            <ArrowDownLeft
              size={17}
              className="text-[#31824f]"
            />
          ) : (
            <ArrowUpRight
              size={17}
              className="text-[#d55353]"
            />
          )}
        </div>

        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-[#17251f]">
            {transaction.title || "Transaction"}
          </p>

          {transaction.description && (
            <p className="mt-0.5 truncate text-[11px] text-[#7a8781]">
              {transaction.description}
            </p>
          )}
        </div>
      </div>

      {/* Date */}
      <div className="hidden sm:block">
        <p className="text-[12px] font-medium text-[#39463f]">
          {transaction.date}
        </p>

        <p className="mt-0.5 text-[11px] text-[#8a948f]">
          {transaction.time}
        </p>
      </div>

      {/* Amount */}
      <div className="text-right">
        <p
          className={`text-[14px] font-semibold ${
            isCredit
              ? "text-[#31824f]"
              : "text-[#d55353]"
          }`}
        >
          {transaction.formattedAmount}
        </p>

        <p className="mt-0.5 text-[10px] uppercase tracking-[0.4px] text-[#9aa39e]">
          {transaction.type}
        </p>
      </div>

      {/* Mobile date */}
      <div className="col-span-2 ml-[52px] sm:hidden">
        <p className="text-[10px] text-[#8a948f]">
          {transaction.date} · {transaction.time}
        </p>
      </div>
    </div>
  );
}