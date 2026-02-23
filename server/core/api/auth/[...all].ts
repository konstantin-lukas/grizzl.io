import { auth } from "~~/server/core/auth";

export default defineEventHandler(event => {
    return auth.handler(toWebRequest(event));
});
