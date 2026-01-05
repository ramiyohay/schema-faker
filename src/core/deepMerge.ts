// Deeply merges two objects
export function deepMerge(target: any, source: any): any {
  if (source === null || typeof source !== "object" || Array.isArray(source)) {
    return source;
  }

  if (target === null || typeof target !== "object" || Array.isArray(target)) {
    return source;
  }

  const result: any = { ...target };

  for (const key of Object.keys(source)) {
    result[key] = deepMerge(target[key], source[key]);
  }

  return result;
}
