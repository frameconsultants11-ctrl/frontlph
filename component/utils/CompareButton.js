"use client";

import { ArrowLeftRight, Check } from "lucide-react";
import { useEffect, useState } from "react";

import {
  addCompareId,
  getCompareIds,
  removeCompareId,
} from "@/lib/compare";

export default function CompareButton({ trainerId, isListing=false }) {
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const update = () => {
      const ids = getCompareIds();

      setAdded(ids.includes(String(trainerId)));
    };

    update();

    window.addEventListener("compare-updated", update);

    return () => {
      window.removeEventListener("compare-updated", update);
    };
  }, [trainerId]);

  const handleClick = () => {
    const id = String(trainerId);

    if (added) {
      removeCompareId(id);
      setAdded(false);
    } else {
      const result = addCompareId(id);

      if (result.limitReached) {
        alert("You can compare maximum 3 trainers.");
        return;
      }

      setAdded(true);
    }

    window.dispatchEvent(new Event("compare-updated"));
  };

  return (
    <button
  type="button"
  onClick={handleClick}
  title={added ? "Remove from compare" : "Add to compare"}
  className={`
    flex
    items-center
    justify-center
    border-[1.5px]
    transition-colors
    cursor-pointer

    ${isListing ? "w-10 h-10 rounded-full" : "py-3 px-4 rounded-full"}

    ${
      added
        ? "border-green-500 bg-green-50 hover:bg-green-100"
        : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
    }
  `}
>
  {added ? (
    <Check className="w-5 h-5 text-green-600" />
  ) : (
    <ArrowLeftRight className="w-5 h-5 text-gray-600" />
  )}
</button>
  );
}