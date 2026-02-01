import { PROTECTED_PATHS } from "#shared/constants/auth";
import { authClient } from "~/constants/auth-client";

export default defineNuxtRouteMiddleware(async to => {
    const nuxtApp = useNuxtApp();
    if (import.meta.server || (import.meta.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered)) {
        return;
    }

    const headers = useRequestHeaders();
    const { data: session } = await authClient.getSession({
        fetchOptions: {
            headers,
        },
    });

    if (session && to.path === "/signin") {
        return navigateTo("/");
    }

    if (!session && PROTECTED_PATHS.some(path => to.path.startsWith(path))) {
        return navigateTo({ path: "/signin", query: { callbackURL: to.fullPath } });
    }
});
