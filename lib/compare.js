export const COMPARE_STORAGE_KEY = "compare_trainers";

export function getCompareIds() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(COMPARE_STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const ids = JSON.parse(stored);

    if (!Array.isArray(ids)) {
      return [];
    }

    return ids;
  } catch {
    return [];
  }
}

export function addCompareId(id) {
  const ids = getCompareIds();

  if (ids.includes(id)) {
    return {
      success: true,
      ids,
      alreadyAdded: true,
    };
  }

  if (ids.length >= 3) {
    return {
      success: false,
      ids,
      limitReached: true,
    };
  }

  const newIds = [...ids, id];

  localStorage.setItem(
    COMPARE_STORAGE_KEY,
    JSON.stringify(newIds)
  );

  return {
    success: true,
    ids: newIds,
  };
}

export function removeCompareId(id) {
  const ids = getCompareIds();

  const newIds = ids.filter(
    (item) => item !== id
  );

  localStorage.setItem(
    COMPARE_STORAGE_KEY,
    JSON.stringify(newIds)
  );

  return newIds;
}

export function clearCompare() {
  localStorage.removeItem(
    COMPARE_STORAGE_KEY
  );
}