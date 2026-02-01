import { sendRedirect } from "#imports";
import { PROTECTED_PATHS, PUBLIC_API_PATHS } from "#shared/constants/auth";
import { DatabaseIdSchema } from "#shared/validators/id";
import { auth } from "~~/server/auth";

declare module "h3" {
    interface H3EventContext {
        user: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>["user"];
    }
}

export default defineEventHandler(async event => {
    const { context } = event;
    const session = await auth.api.getSession({
        headers: event.headers,
    });

    if (session?.user.id && DatabaseIdSchema.safeParse(session.user.id).success) {
        context.user = session.user;
        if (event.path === "/signin") return sendRedirect(event, "/");
        return;
    }

    if (event.path.startsWith("/api") && !PUBLIC_API_PATHS.some(path => event.path.startsWith(path))) {
        throwError("You need to sign in to perform this action.", "UNAUTHORIZED");
    }

    if (PROTECTED_PATHS.some(path => event.path.startsWith(path))) {
        const { data, error } = tryCatchSync(() => encodeURIComponent(event.path));
        if (error) return sendRedirect(event, "/signin");
        return sendRedirect(event, `/signin?callbackURL=${data}`);
    }
});
