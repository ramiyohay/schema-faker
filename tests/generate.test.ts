import { describe, it, expect } from "vitest";
import { z } from "zod";
import { generate } from "../src/generate";

describe("schema-faker generate()", () => {
  const UserSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    age: z.number().min(18).max(65),
    isActive: z.boolean(),
  });

  it("generates valid data according to schema", () => {
    const user = generate(UserSchema);

    // בדיקה מול Zod עצמו
    expect(() => UserSchema.parse(user)).not.toThrow();
  });

  it("respects number constraints", () => {
    const user = generate(UserSchema);

    expect(user.age).toBeGreaterThanOrEqual(18);
    expect(user.age).toBeLessThanOrEqual(65);
  });

  it("generates deterministic output with same seed", () => {
    const a = generate(UserSchema, { seed: 123 });
    const b = generate(UserSchema, { seed: 123 });

    expect(a).toEqual(b);
  });

  it("generates different output with different seeds", () => {
    const a = generate(UserSchema, { seed: 1 });
    const b = generate(UserSchema, { seed: 2 });

    expect(a).not.toEqual(b);
  });

  it("generates email-like strings", () => {
    const user = generate(UserSchema);

    expect(user.email).toContain("@");
  });
});
