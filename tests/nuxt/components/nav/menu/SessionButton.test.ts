import SessionButton from "@@/app/components/nav/menu/SessionButton.vue";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, expect, test, vi } from "vitest";

const { closeMock, navigateToMock, signOutMock, useSessionMock, setSession } = vi.hoisted(() => {
    const session = { data: null as null | Record<string, unknown> };

    const useSessionMock = vi.fn(() => session);
    const closeMock = vi.fn();
    const signOutMock = vi.fn(async () => undefined);
    const navigateToMock = vi.fn(async (_to: string) => undefined);

    const setSession = (data: null | Record<string, unknown>) => {
        session.data = data;
    };

    return { closeMock, navigateToMock, signOutMock, useSessionMock, setSession };
});

vi.mock("~~/lib/auth-client", () => ({
    authClient: {
        useSession: () => useSessionMock(),
        signOut: () => signOutMock(),
    },
}));

mockNuxtImport("useMenu", () => () => ({ close: closeMock }));
mockNuxtImport("navigateTo", () => navigateToMock);

beforeEach(() => {
    vi.clearAllMocks();
});

test("renders sign out button when session exists and triggers sign out flow", async () => {
    setSession({ user: { id: "1" } });

    const wrapper = await mountSuspended(SessionButton, { scoped: true });

    const button = wrapper.findByTestId("session-button");
    expect(button.attributes("href")).toBeUndefined();
    expect(signOutMock).not.toHaveBeenCalled();
    expect(navigateToMock).not.toHaveBeenCalled();
    expect(closeMock).not.toHaveBeenCalled();

    await button.trigger("click");

    expect(signOutMock).toHaveBeenCalledOnce();
    expect(navigateToMock).toHaveBeenCalledTimes(1);
    expect(navigateToMock).toHaveBeenCalledWith("/signin");
    await vi.waitFor(() => {
        expect(closeMock).toHaveBeenCalledTimes(1);
    });
});

test("renders sign in button as a link to sign in page when session doesn't exist", async () => {
    setSession(null);

    const wrapper = await mountSuspended(SessionButton, { scoped: true });

    const button = wrapper.findByTestId("session-button");
    expect(button.attributes("href")).toBe("/signin");
    expect(signOutMock).not.toHaveBeenCalled();
    expect(navigateToMock).not.toHaveBeenCalled();
    expect(closeMock).not.toHaveBeenCalled();

    await button.trigger("click");

    expect(closeMock).toHaveBeenCalledTimes(1);
    expect(signOutMock).toHaveBeenCalledTimes(0);
    expect(navigateToMock).toHaveBeenCalledTimes(0);
});
