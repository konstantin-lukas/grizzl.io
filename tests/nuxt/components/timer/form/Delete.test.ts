import Delete from "@@/app/components/timer/form/Delete.vue";
import { UTooltip } from "@@/tests/nuxt/components/stubs";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, expect, test, vi } from "vitest";

const stubs = { UTooltip };

const { useSoftDeleteMock, executeMock } = await vi.hoisted(async () => {
    const executeMock = vi.fn();
    const useSoftDeleteMock = vi.fn(() => executeMock);
    return {
        useSoftDeleteMock,
        executeMock,
    };
});

mockNuxtImport("useSoftDelete", async () => {
    return useSoftDeleteMock;
});

beforeEach(() => {
    vi.clearAllMocks();
});

test("should soft delete the associated timer on click", async () => {
    const title = "My Timer";
    const wrapper = await mountSuspended(Delete, {
        scoped: true,
        props: {
            timer: {
                id: "123",
                title,
            },
        },
        global: { stubs },
    });
    expect(executeMock).not.toHaveBeenCalled();
    expect(useSoftDeleteMock).toHaveBeenCalledOnce();
    expect(useSoftDeleteMock).toHaveBeenCalledWith(
        "/api/timers/123",
        expect.objectContaining({
            successTitle: "timer.toast.deletedTitle",
            successDescription: "timer.toast.deletedDescription",
            interpolations: { title },
        }),
    );
    await wrapper.find("button").trigger("click");
    expect(executeMock).toHaveBeenCalledOnce();
});

test("should not throw an error when no timer is provided", async () => {
    await mountSuspended(Delete, {
        scoped: true,
        global: { stubs },
    });
    expect(executeMock).not.toHaveBeenCalled();
    expect(useSoftDeleteMock).toHaveBeenCalledOnce();
    expect(useSoftDeleteMock).toHaveBeenCalledWith(
        "/api/timers/undefined",
        expect.objectContaining({
            successTitle: "timer.toast.deletedTitle",
            successDescription: "timer.toast.deletedDescription",
            interpolations: { title: "" },
        }),
    );
});
