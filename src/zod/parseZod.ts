import { Context } from "../core/context";
import { generateString } from "../generators/string";
import { generateNumber } from "../generators/number";
import { generateBoolean } from "../generators/boolean";
import { generateArray } from "../generators/array";
import { generateEnum } from "../generators/enum";

export function parseZodSchema(schema: any, ctx: Context): any {
  switch (schema._def.typeName) {
    case "ZodString": // String type
      return generateString(schema, ctx);
    case "ZodNumber": // Number type
      return generateNumber(schema, ctx);
    case "ZodBoolean": // Boolean type
      return generateBoolean(ctx);
    case "ZodArray": // Array type
      return generateArray(schema, ctx);
    case "ZodOptional": {  // Optional type
      return ctx.random.bool()
        ? undefined
        : parseZodSchema(schema._def.innerType, ctx);
    }
    case "ZodEnum": // Enum type
      return generateEnum(schema, ctx);
    case "ZodObject": // Object type
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
