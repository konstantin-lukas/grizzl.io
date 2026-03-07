import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, expect, test, vi } from "vitest";
import Slideover from "~/core/components/overlay/Slideover.vue";
import { UTooltip } from "~~/test-utils/vitest/stubs";

const slots = { default: "Hello, world!" };
const stubs = { UTooltip };

const { pushMock } = vi.hoisted(() => {
    return { pushMock: vi.fn() };
});

mockNuxtImport("useRoute", () => {
    return () => ({ path: "/cherries" });
});

mockNuxtImport("useRouter", () => {
    return () => ({ push: pushMock, afterEach: vi.fn(), replace: vi.fn() });
});

beforeEach(() => {
    vi.resetAllMocks();
});

test("should be closed when no queryValue is passed", async () => {
    const wrapper = await mountSuspended(Slideover, {
        scoped: true,
        slots,
        props: { portal: false, queryKey: "bananas" },
    });
    const slideover = wrapper.find("[role='dialog']");
    expect(slideover.exists()).toBe(false);
});

test("should be opened by passing a queryValue", async () => {
    const wrapper = await mountSuspended(Slideover, {
        scoped: true,
        slots,
        global: { stubs },
        props: { queryKey: "bananas", queryValue: "apples", portal: false },
    });
    const slideover = wrapper.find("[role='dialog']");
    expect(slideover.text()).toBe(`ui.goBack${slots.default}`);
    expect(pushMock).toHaveBeenCalledExactlyOnceWith("/cherries?bananas=apples");
});

test("should have button that emits the close event", async () => {
    const wrapper = await mountSuspended(Slideover, {
        scoped: true,
        slots,
        global: { stubs },
        props: { queryKey: "bananas", queryValue: "apples", portal: false },
    });
    const button = wrapper.find("[data-test-id='go-back-button']");
    expect(wrapper.emitted("close")).toBeUndefined();
    await button.trigger("click");
    expect(wrapper.emitted("close")).toHaveLength(1);
});
