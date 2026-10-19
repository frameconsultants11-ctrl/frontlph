"use client";

import { usePathname, useSearchParams } from "next/navigation";

export default function CurrentPathname() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.toString();

  return `${pathname}${query ? `?${query}` : ""}`;
}