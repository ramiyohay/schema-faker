import { describe, it, expect } from "vitest";
import { z } from "zod";
import { generate } from "../src/generate";
import { de } from "zod/v4/locales";

describe("schema-faker generate()", () => {
  describe("basic object generation", () => {
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
  });

  describe("array support", () => {
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

    it("is deterministic with seed", () => {
      const Schema = z.array(z.number());
      const a = generate(Schema, { seed: 1 });
      const b = generate(Schema, { seed: 1 });

      expect(a).toEqual(b);
    });
  });

  describe("optional support", () => {
    it("can return undefined or value with different seeds", () => {
      const Schema = z.string().optional();
      const results = new Set<any>();

      for (let seed = 1; seed <= 20; seed++) {
        results.add(generate(Schema, { seed }));
      }

      expect(results.has(undefined)).toBe(true);
      expect([...results].some((v) => v !== undefined)).toBe(true);
    });

    it("is deterministic with seed", () => {
      const Schema = z.number().optional();
      const a = generate(Schema, { seed: 10 });
      const b = generate(Schema, { seed: 10 });

      expect(a).toEqual(b);
    });

    it("works inside objects", () => {
      const Schema = z.object({
        name: z.string(),
        nickname: z.string().optional(),
      });

      const result = generate(Schema);
      expect(result).toHaveProperty("name");
    });
  });

  describe("enum support", () => {
    it("returns one of the enum values", () => {
      const Schema = z.enum(["pending", "active", "disabled"]);
      const result = generate(Schema);

      expect(["pending", "active", "disabled"]).toContain(result);
    });

    it("is deterministic with seed", () => {
      const Schema = z.enum(["a", "b", "c"]);
      const a = generate(Schema, { seed: 5 });
      const b = generate(Schema, { seed: 5 });

      expect(a).toEqual(b);
    });

    it("works inside objects", () => {
      const Schema = z.object({
        status: z.enum(["pending", "active"]),
      });

      const result = generate(Schema);
      expect(["pending", "active"]).toContain(result.status);
    });
  });

  describe("literal support", () => {
    it("always returns the literal value", () => {
      const Schema = z.literal("something");
      const result = generate(Schema);

      expect(result).toBe("something");
    });
  });

  describe("union support", () => {
    it("returns one of the union options", () => {
      const Schema = z.union([z.string(), z.number(), z.literal(true)]);
      const result = generate(Schema);
      const isValid =
        typeof result === "string" ||
        typeof result === "number" ||
        result === true;

      expect(isValid).toBe(true);
    });
  });

  describe("nullable support", () => {
    it("is deterministic with seed", () => {
      const Schema = z.string().nullable();
      const a = generate(Schema, { seed: 7 });
      const b = generate(Schema, { seed: 7 });

      expect(a).toEqual(b);
    });

    it("can return null or value with different seeds", () => {
      const Schema = z.number().nullable();
      const results = new Set<any>();

      for (let seed = 1; seed <= 20; seed++) {
        results.add(generate(Schema, { seed }));
      }

      expect(results.has(null)).toBe(true);
      expect([...results].some((v) => v !== null)).toBe(true);
    });
  });

  describe("tuple support", () => {
    it("generates tuple with correct item types", () => {
      const Schema = z.tuple([z.string(), z.number(), z.boolean()]);
      const result = generate(Schema);
      
      expect(typeof result[0]).toBe("string");
      expect(typeof result[1]).toBe("number");
      expect(typeof result[2]).toBe("boolean");
    });
  });
});
