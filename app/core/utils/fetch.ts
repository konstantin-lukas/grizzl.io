/**
 * https://github.com/better-auth/better-auth/issues/5358
 */
export function relativeFetch(url: string, opts?: Parameters<typeof useFetch>[1]) {
    const resolvedUrl = (() => {
        if (url.startsWith("http")) {
            const u = new URL(url);
            return u.pathname + u.search;
        }
        return url;
    })();

    return useFetch(resolvedUrl, opts);
}
