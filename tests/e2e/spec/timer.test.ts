import { testPageIntegrity, testRedirectWhenLoggedOut } from "@e2e/utils/helpers";

testRedirectWhenLoggedOut("/timer");

testPageIntegrity("/timer");
