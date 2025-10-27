import { PROTECTED_PATHS } from "#shared/constants/auth";
import { authClient } from "~~/lib/auth-client";

export default defineNuxtRouteMiddleware(async to => {
    const { data: session } = await authClient.useSession(useFetch);
    if (!session.value && PROTECTED_PATHS.some(path => to.path.startsWith(path))) {
        return navigateTo("/signin");
    }
});
