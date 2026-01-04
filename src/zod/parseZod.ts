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
    case "ZodOptional": {
      // 50% undefined, 50% value
      return ctx.random.bool()
        ? undefined
        : parseZodSchema(schema._def.innerType, ctx);
    }
    case "ZodNullable": {
      // 50% null, 50% value
      return ctx.random.bool()
        ? null // important: return null here
        : parseZodSchema(schema._def.innerType, ctx);
    }
    case "ZodEnum": // Enum type, return one of the enum values
      return generateEnum(schema, ctx);
    case "ZodObject": // Object type
      const shape = schema.shape;
      const obj: any = {};

      for (const key in shape) {
        obj[key] = parseZodSchema(shape[key], ctx);
      }

      return obj;
    case "ZodLiteral": // Literal type, always return the literal value
      return schema._def.value;
    case "ZodUnion": {
      // Union type, randomly pick one of the options
      const options = schema._def.options;
      const index = ctx.random.int(0, options.length - 1);

      return parseZodSchema(options[index], ctx);
    }
    case "ZodTuple": {
      const items = schema._def.items;
      
      return items.map((itemSchema: any) => parseZodSchema(itemSchema, ctx));
    }

    default:
      return null;
  }
}
