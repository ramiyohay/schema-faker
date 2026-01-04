import { Context } from "../core/context";

export function generateNumber(schema: any, ctx: Context): number {
  const checks = schema._def.checks ?? [];

  let min = 0;
  let max = 100;

  for (const check of checks) {
    if (check.kind === "min") min = check.value;
    if (check.kind === "max") max = check.value;
  }

  return ctx.random.int(min, max);
}
