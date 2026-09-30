"use client";

import { useState } from "react";
import Sidebar from "@/component/profile/Sidebar";

export default function ClientLayout({ session, children }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="min-h-screen font-sans">
      <Sidebar
        expanded={sidebarExpanded}
        setExpanded={setSidebarExpanded}
        session={session}
      />

      <main
        className={`
          min-h-screen
          p-5
          pt-6
          pb-28
          transition-all
          duration-300
         
          ${
            sidebarExpanded
              ? "lg:ml-[280px]"
              : "lg:ml-[100px]"
          }
        `}
      >
        {children}
      </main>
    </div>
  );
}