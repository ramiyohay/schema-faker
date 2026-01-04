import { Context } from "../core/context";

export function generateBoolean(ctx: Context): boolean {
  return ctx.random.bool();
}
