import { ObjectId, Decimal128, Long, Int32, Double } from "mongodb";

export function serializeForClient(value) {
  if (value == null) return value;

  // MongoDB ObjectId
  if (value instanceof ObjectId) {
    return value.toString();
  }

  // MongoDB numeric BSON types
  if (
    value instanceof Decimal128 ||
    value instanceof Long ||
    value instanceof Int32 ||
    value instanceof Double
  ) {
    return Number(value.toString());
  }

  // Dates must be converted to strings
  if (value instanceof Date) {
    return value.toISOString();
  }

  // Arrays
  if (Array.isArray(value)) {
    return value.map(serializeForClient);
  }

  // Plain objects only
  if (typeof value === "object") {
    const result = {};

    for (const [key, item] of Object.entries(value)) {
      result[key] = serializeForClient(item);
    }

    return result;
  }

  return value;
}