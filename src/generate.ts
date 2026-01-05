import { Random } from "./core/random";
import { Context } from "./core/context";
import { parseZodSchema } from "./zod/parseZod";
import { GenerateOptions } from "./types";
import { deepMerge } from "./core/deepMerge";

export function generate(schema: any, options: GenerateOptions = {}) {
  const ctx: Context = {
    random: new Random(options.seed),
    strict: options.strict || false,
  };

  // Function to generate a single value
  const makeOne = () => {
    const value = parseZodSchema(schema, ctx);
    return options.overrides ? deepMerge(value, options.overrides) : value;
  };

  // Handle count option
  if (options.count && options.count > 1) {
    return Array.from({ length: options.count }, makeOne);
  }

  return makeOne();
}
