// Immutable get/set by dotted path. Array segments are item `_key`s, e.g. "sections.k3.heading".

export function getIn(obj, path) {
  if (!path) return obj;
  return path.split(".").reduce((acc, seg) => {
    if (acc === undefined || acc === null) return undefined;
    if (Array.isArray(acc)) return acc.find((item) => item?._key === seg);
    return acc[seg];
  }, obj);
}

export function setIn(obj, path, value) {
  const [seg, ...rest] = path.split(".");
  const restPath = rest.join(".");
  if (Array.isArray(obj)) {
    return obj.map((item) => (item?._key === seg ? (restPath ? setIn(item, restPath, value) : value) : item));
  }
  const base = obj && typeof obj === "object" ? obj : {};
  const next = restPath ? setIn(base[seg], restPath, value) : value;
  const copy = { ...base };
  if (next === undefined) delete copy[seg];
  else copy[seg] = next;
  return copy;
}

/** Remove empty strings / nulls / empty objects so saved documents stay tidy. Keeps false and 0. */
export function clean(value) {
  if (Array.isArray(value)) return value.map(clean).filter((v) => v !== undefined);
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      const c = clean(v);
      if (c !== undefined) out[k] = c;
    }
    const meaningful = Object.keys(out).filter((k) => !k.startsWith("_"));
    return meaningful.length || out._ref || out.asset ? out : undefined;
  }
  if (value === "" || value === null) return undefined;
  return value;
}
