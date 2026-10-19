
"use client";

import { motion } from "framer-motion";

export default function RunningLine() {
  const text = "| Refer You Friend Now and Earn 100 Rewards Points and Your Friend Get 15 Min Free Call |";

  return (
    <div className="sticky top-18 z-50 w-full overflow-hidden border-y border-white/15 bg-[#ccfc3a]/90 py-3 backdrop-blur-xl font-sans">
      <motion.div
        className="flex w-max whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 48,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
          <span
            key={item}
            className="mr-8 text-sm font-semibold text-black/80"
          >
        
         {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
