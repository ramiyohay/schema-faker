import { Context } from "../core/context";
import { parseZodSchema } from "../zod/parseZod";

export function generateRecord(schema: any, ctx: Context) {
  const result: Record<string, any> = {};

  const keySchema = schema._def.keyType;
  const valueSchema = schema._def.valueType;

  const count = ctx.random.int(1, 5); // Generate between 1 and 5 entries

  for (let i = 0; i < count; i++) {
    const key = parseZodSchema(keySchema, ctx);
    const value = parseZodSchema(valueSchema, ctx);

    result[String(key)] = value;
  }

  return result;
}