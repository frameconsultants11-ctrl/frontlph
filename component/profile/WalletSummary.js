"use client";

import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";

const CARD_CONFIG = {
  balance: {
    label: "Available Balance",
    icon: Wallet,
  },
  credits: {
    label: "Total Credits",
    icon: ArrowDownLeft,
  },
  debits: {
    label: "Total Debits",
    icon: ArrowUpRight,
  },
};

export default function WalletSummary({
  balance = 0,
  totalCredits = 0,
  totalDebits = 0,
}) {
  const items = [
    {
      key: "balance",
      value: balance,
    },
    {
      key: "credits",
      value: totalCredits,
    },
    {
      key: "debits",
      value: totalDebits,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const config = CARD_CONFIG[item.key];
        const Icon = config.icon;

        return (
          <div
            key={item.key}
            className="rounded-[18px] border border-[#e8ece9] bg-white p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-medium text-[#718078]">
                  {config.label}
                </p>

                <p className="mt-2 text-[25px] font-semibold tracking-[-0.5px] text-[#173f32]">
                  {item.value}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#e2f9d7]">
                <Icon
                  size={19}
                  strokeWidth={2}
                  className="text-[#173f32]"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}