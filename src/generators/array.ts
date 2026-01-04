import { Context } from "../core/context";
import { parseZodSchema } from "../zod/parseZod";

export function generateArray(schema: any, ctx: Context): any[] {
  const min = schema._def.minLength?.value ?? 1;
  const max = schema._def.maxLength?.value ?? min + 4;

  const length = ctx.random.int(min, max);
  const itemSchema = schema._def.type;

  const result = [];

  for (let i = 0; i < length; i++) {
    result.push(parseZodSchema(itemSchema, ctx));
  }

  return result;
}
