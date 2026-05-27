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

/**
 * Extract only the allowed appState fields that Convex validator accepts
 * Convex schema only allows: scrollX, scrollY, zoom
 */
export function filterAppStateForConvex(
  appState: unknown
): { scrollX: number; scrollY: number; zoom: { value: number } } {
  if (!isPlainObject(appState)) {
    return { scrollX: 0, scrollY: 0, zoom: { value: 1 } };
  }

  const scrollX = typeof appState.scrollX === "number" ? appState.scrollX : 0;
  const scrollY = typeof appState.scrollY === "number" ? appState.scrollY : 0;
  
  let zoom = { value: 1 };
  if (isPlainObject(appState.zoom) && typeof appState.zoom.value === "number") {
    zoom = { value: appState.zoom.value };
  }

  return { scrollX, scrollY, zoom };
}
