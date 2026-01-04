import { Context } from "../core/context";

const DEFAULT_MIN_DATE = new Date("1970-01-01").getTime();

// Helper to convert Date or number to timestamp
function toTimestamp(value: unknown): number {
  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === "number") {
    return value;
  }

  throw new Error("Invalid date constraint value");
}

export function generateDate(schema: any, ctx: Context): Date {
  const checks = schema._def.checks ?? [];
  let min = DEFAULT_MIN_DATE;
  let max = Date.now();

  for (const check of checks) {
    if (check.kind === "min") {
      min = toTimestamp(check.value);
    }

    if (check.kind === "max") {
      max = toTimestamp(check.value);
    }
  }

  // date range validation
  if (min > max) {
    throw new Error("Invalid date range: min > max");
  }

  const timestamp = ctx.random.int(min, max);

  return new Date(timestamp);
}
