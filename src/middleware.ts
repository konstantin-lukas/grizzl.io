import { withAuth } from "next-auth/middleware";

export const config = { matcher: ["/poll"] };

export default withAuth({
    pages: {
        signIn: "/auth/signin",
    },
});
