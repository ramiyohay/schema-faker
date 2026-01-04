# schema-faker

Generate fake data from **Zod schemas** in a deterministic, type-safe, and extensible way.

`schema-faker` creates realistic-looking mock data **directly from your existing schemas**, without writing manual mocks.

---

## Why schema-faker?

Most fake data libraries generate random values field-by-field.  
`schema-faker` works **schema-first**.

### Benefits
- ✅ Uses schemas you already have (Zod)
- ✅ Deterministic output (seed support)
- ✅ Fully type-safe
- ✅ No dependency on Faker
- ✅ Perfect for tests, seeds, and mock APIs

### Type Support
✅ string
✅ number
✅ boolean
✅ object
✅ array
✅ optional
✅ enum

## Install
npm install schema-faker zod

## Usage
```ts
import { z } from "zod";
import { generate } from "schema-faker";

const User = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  age: z.number().min(18)
});

const user = generate(User);

// you can also create multi objects

const users = generate(User, {
  count: 5,
  seed: 42,
});

console.log(users);
```
