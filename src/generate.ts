import { Random } from "./core/random";
import { Context } from "./core/context";
import { parseZodSchema } from "./zod/parseZod";
import { GenerateOptions } from "./types";

export function generate(schema: any, options: GenerateOptions = {}) {
  const ctx: Context = {
    random: new Random(options.seed),
  };

  return parseZodSchema(schema, ctx);
}
