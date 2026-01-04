import { Context } from "../core/context";

function generateUUID(ctx: Context): string {
  const hex = () => ctx.random.int(0, 15).toString(16);

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = ctx.random.int(0, 15);
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function generateString(schema: any, ctx: Context): string {
  const checks = schema._def.checks ?? [];

  if (checks.some((c: any) => c.kind === "uuid")) {
    return generateUUID(ctx);
  }

  if (checks.some((c: any) => c.kind === "email")) {
    return `user${ctx.random.int(1, 9999)}@example.com`;
  }

  return ctx.random.string(10);
}
