import { Context } from "../core/context";

export function generateEnum(schema: any, ctx: Context) {
  const values = schema._def.values;
  const index = ctx.random.int(0, values.length - 1);
  
  return values[index];
}
