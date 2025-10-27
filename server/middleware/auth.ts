import { sendRedirect } from "#imports";
import { PROTECTED_PATHS } from "#shared/constants/auth";
import { HttpStatusCode } from "#shared/enum/status";
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

    if (event.path.startsWith("/api") && !event.path.startsWith("/api/auth")) {
        throw createError({
            statusCode: HttpStatusCode.UNAUTHORIZED,
            statusMessage: "Unauthorized",
        });
    }

    if (PROTECTED_PATHS.some(path => event.path.startsWith(path))) {
        return sendRedirect(event, "/signin");
    }
});
