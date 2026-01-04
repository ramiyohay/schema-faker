import { Context } from "../core/context";
import { generateString } from "../generators/string";
import { generateNumber } from "../generators/number";
import { generateBoolean } from "../generators/boolean";

export function parseZodSchema(schema: any, ctx: Context): any {
  switch (schema._def.typeName) {
    case "ZodString":
      return generateString(schema, ctx);
    case "ZodNumber":
      return generateNumber(schema, ctx);
    case "ZodBoolean":
      return generateBoolean(ctx);
    case "ZodObject":
      const shape = schema.shape;
      const obj: any = {};
      for (const key in shape) {
        obj[key] = parseZodSchema(shape[key], ctx);
      }
      return obj;
    default:
      return null;
  }
}
