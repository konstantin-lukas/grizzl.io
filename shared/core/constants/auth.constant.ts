export const PROTECTED_PATHS = ["/timer", "/finance", "/todo", "/poll"] as const;

export const PUBLIC_API_PATHS = [/^\/api\/auth/, /^\/api\/_nuxt_icon/, /^\/api\/polls\/.{16}$/];
