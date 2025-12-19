import Offline from "@@/app/components/data/Offline.vue";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { expect, test, vi } from "vitest";

const { useOnlineStatusMock } = vi.hoisted(() => {
    return {
        useOnlineStatusMock: vi.fn(() => {
            return true;
        }),
    };
});

mockNuxtImport("useOnlineStatus", () => {
    return useOnlineStatusMock;
});

test("should be hidden when the user is online", async () => {
    useOnlineStatusMock.mockReturnValue(true);
    const wrapper = await mountSuspended(Offline, { scoped: true });
    const banner = wrapper.findByTestId("offline-banner");
    expect(banner.exists()).toBe(false);
});

test("should be a visible alert with a short message when the user is offline", async () => {
    useOnlineStatusMock.mockReturnValue(false);
    const wrapper = await mountSuspended(Offline, { scoped: true });
    const banner = wrapper.findByTestId("offline-banner");
    const title = wrapper.findByTestId("offline-banner-title");
    expect(banner.attributes().role).toBe("alert");
    expect(title.text()).toBe("ui.offline");
});
