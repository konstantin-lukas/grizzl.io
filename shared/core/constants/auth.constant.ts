export const PROTECTED_PATHS = ["/timer", "/finance", "/todo", "/poll"] as const;

export const PUBLIC_API_PATHS = [
    { pattern: /^\/api\/auth/, method: null },
    { pattern: /^\/api\/_nuxt_icon/, method: null },
    { pattern: /^\/api\/polls\/.{16}$/, method: "GET" },
    { pattern: /^\/api\/polls\/.{16}\/votes$/, method: "POST" },
] as const;
