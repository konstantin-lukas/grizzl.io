type Path<T> = T extends object
    ? {
          [K in keyof T & string]: T[K] extends object ? `${K}` | `${K}.${Path<T[K]>}` : `${K}`;
      }[keyof T & string]
    : never;

export function omit<T extends Record<string, unknown>>(obj: T, path: Path<T>): Omit<T, string> {
    const parts = path.split(".");

    if (parts.length === 1) {
        const { [parts[0]!]: _, ...rest } = obj;
        return rest;
    }

    const [key, ...rest] = parts;

    return {
        ...obj,
        [key!]: omit(obj[key!] as Record<string, unknown>, rest.join(".")),
    };
}
