import { PROTECTED_PATHS } from "#shared/constants/auth";
import { authClient } from "~~/lib/auth-client";

export default defineNuxtRouteMiddleware(async to => {
    const { data: session } = await authClient.useSession(useFetch);
    const nuxtApp = useNuxtApp();
    if (import.meta.server || (import.meta.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered)) {
        return;
    }
    if (!session.value && PROTECTED_PATHS.some(path => to.path.startsWith(path))) {
        return navigateTo("/signin");
    }
});
