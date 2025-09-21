import { withAuth } from "next-auth/middleware";

export const config = { matcher: ["/"] };

export default withAuth({
    pages: {
        signIn: "/auth/signin",
    },
});
