function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || value === undefined) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function sanitizeForConvex<T>(value: T): T {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  if (value instanceof Map) {
    const obj: Record<string, unknown> = {};
    for (const [key, val] of value) {
      obj[String(key)] = sanitizeForConvex(val);
    }
    return obj as T;
  }

  if (value instanceof Set) {
    return Array.from(value).map(sanitizeForConvex) as T;
  }

  if (value instanceof Date) {
    return value.getTime() as T;
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeForConvex) as T;
  }

  if (isPlainObject(value)) {
    const obj: Record<string, unknown> = {};
    for (const key of Object.keys(value)) {
      obj[key] = sanitizeForConvex(value[key]);
    }
    return obj as T;
  }

  return null as T;
}
