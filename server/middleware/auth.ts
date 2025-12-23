import { sendRedirect } from "#imports";
import { PROTECTED_PATHS, PUBLIC_API_PATHS } from "#shared/constants/auth";
import { DatabaseIdSchema } from "#shared/schema/id";
import { auth } from "~~/lib/auth";

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
        return;
    }

    if (event.path.startsWith("/api") && !PUBLIC_API_PATHS.some(path => event.path.startsWith(path))) {
        throwError("You need to sign in to perform this action.", "UNAUTHORIZED");
    }

    if (PROTECTED_PATHS.some(path => event.path.startsWith(path))) {
        return sendRedirect(event, "/signin");
    }
});
