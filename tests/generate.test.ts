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

  it("generates valid email format", () => {
    const user = generate(UserSchema);
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    expect(user.email).toMatch(EMAIL_REGEX);
  });

  it("generates array within min/max length", () => {
    const Schema = z.array(z.number()).min(3).max(5);
    const result = generate(Schema);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(3);
    expect(result.length).toBeLessThanOrEqual(5);
  });

  it("generates items matching item schema", () => {
    const Schema = z.array(z.string().email()).min(2).max(2);
    const result = generate(Schema);

    for (const email of result) {
      expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    }
  });

  it("array is deterministic with seed", () => {
    const Schema = z.array(z.number());
    const a = generate(Schema, { seed: 1 });
    const b = generate(Schema, { seed: 1 });

    expect(a).toEqual(b);
  });

  it("optional can return undefined or value with different seeds", () => {
  const Schema = z.string().optional();
  const results = new Set<any>();

  for (let seed = 1; seed <= 20; seed++) {
    results.add(generate(Schema, { seed }));
  }

  expect(results.has(undefined)).toBe(true);
  expect([...results].some(v => v !== undefined)).toBe(true);
});


  it("optional is deterministic with seed", () => {
    const Schema = z.number().optional();

    const a = generate(Schema, { seed: 10 });
    const b = generate(Schema, { seed: 10 });

    expect(a).toEqual(b);
  });

  it("optional works with nested objects", () => {
    const Schema = z.object({
      name: z.string(),
      nickname: z.string().optional(),
    });

    const result = generate(Schema);

    expect(result).toHaveProperty("name"); // nickname may or may not exist
  });

  it("enum returns one of the enum values", () => {
    const Schema = z.enum(["pending", "active", "disabled"]);
    const result = generate(Schema);

    expect(["pending", "active", "disabled"]).toContain(result);
  });

  it("enum is deterministic with seed", () => {
    const Schema = z.enum(["a", "b", "c"]);
    const a = generate(Schema, { seed: 5 });
    const b = generate(Schema, { seed: 5 });

    expect(a).toEqual(b);
  });

  it("enum works inside objects", () => {
    const Schema = z.object({
      status: z.enum(["pending", "active"]),
    });

    const result = generate(Schema);

    expect(["pending", "active"]).toContain(result.status);
  });
});
