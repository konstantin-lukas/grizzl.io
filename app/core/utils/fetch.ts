/**
 * https://github.com/better-auth/better-auth/issues/5358
 */
export function relativeFetch(url: string, opts?: Parameters<typeof useFetch>[1]) {
    return useFetch(url.startsWith("http") ? new URL(url).pathname : url, opts);
}
