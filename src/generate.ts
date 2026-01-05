import { Random } from "./core/random";
import { Context } from "./core/context";
import { parseZodSchema } from "./zod/parseZod";
import { GenerateOptions } from "./types";
import { deepMerge } from "./core/deepMerge";

export function generate(schema: any, options: GenerateOptions = {}) {
  const ctx: Context = {
    random: new Random(options.seed),
  };

  // create data based on schema
  const generated = parseZodSchema(schema, ctx);

  // apply overrides if provided
  if (options.overrides) {
    return deepMerge(generated, options.overrides);
  }

  return generated;
}
