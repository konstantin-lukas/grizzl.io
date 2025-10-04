export default defineOAuthKeycloakEventHandler({
    config: {
        scope: ["openid", "email", "profile"],
        clientId: "test-client",
        clientSecret: "test-client-secret",
        realm: "dev-test",
        serverUrl: "http://keycloak.grizzl.localhost",
        serverUrlInternal: "http://keycloak:8080",
    },
    async onSuccess(event, { user, tokens }) {
        console.log(user, tokens.length);
        await setUserSession(event, { user, secure: { tokens } });
        return sendRedirect(event, "/");
    },
});
