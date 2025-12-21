import useSoftDelete from "@@/app/composables/useSoftDelete";
import { mockNuxtImport, registerEndpoint } from "@nuxt/test-utils/runtime";
import { beforeEach, expect, test, vi } from "vitest";

const error = {
    title: "Error",
    description: "An error occurred",
    color: "error",
};

const { t, start, finish, add, fetchSpy, createToastErrorMock, useI18nMock, useLoadingIndicatorMock, useToastMock } =
    await vi.hoisted(async () => {
        const t = vi.fn((key: string) => key);
        const start = vi.fn();
        const finish = vi.fn();
        const add = vi.fn();
        const createToastErrorMock = vi.fn(() => error);
        const fetchSpy = vi.spyOn(global, "$fetch");

        return {
            t,
            start,
            finish,
            add,
            fetchSpy,
            createToastErrorMock,
            useI18nMock: () => ({ t }),
            useLoadingIndicatorMock: () => ({ start, finish }),
            useToastMock: () => ({ add }),
        };
    });

mockNuxtImport("useI18n", () => {
    return useI18nMock;
});

mockNuxtImport("useLoadingIndicator", () => {
    return useLoadingIndicatorMock;
});

mockNuxtImport("useToast", () => {
    return useToastMock;
});

mockNuxtImport("createToastError", () => {
    return createToastErrorMock;
});

registerEndpoint("/api/bananas/123", () => ({
    method: "PATCH",
    handler: () => {},
}));

beforeEach(() => {
    vi.resetAllMocks();
});

test("should make a call to the provided resource and add a toast with an undo option on success", async () => {
    const execute = useSoftDelete("/api/bananas/123");
    expect(t).not.toHaveBeenCalled();
    expect(start).not.toHaveBeenCalled();
    expect(finish).not.toHaveBeenCalled();
    expect(add).not.toHaveBeenCalled();
    expect(fetchSpy).not.toHaveBeenCalled();

    await execute();

    expect(t).toHaveBeenCalledOnce();
    expect(t).toHaveBeenCalledWith("ui.undo");
    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(fetchSpy).toHaveBeenCalledWith("/api/bananas/123", { method: "PATCH", body: { deleted: true } });
    expect(start).not.toHaveBeenCalled();
    expect(finish).not.toHaveBeenCalled();
    expect(add).toHaveBeenCalledWith(
        expect.objectContaining({
            title: undefined,
            description: undefined,
            orientation: "vertical",
            color: "success",
            actions: [
                {
                    label: "ui.undo",
                    icon: "heroicons:arrow-turn-down-left",
                    color: "neutral",
                    variant: "outline",
                    onClick: expect.any(Function),
                },
            ],
        }),
    );
    add.mock.calls[0][0].actions[0].onClick();
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(fetchSpy).toHaveBeenCalledWith("/api/bananas/123", { method: "PATCH", body: { deleted: false } });
    await vi.waitFor(() => {
        expect(start).toHaveBeenCalledOnce();
        expect(finish).toHaveBeenCalledOnce();
    });
});

test("should add an error toast and still call optional refresh", async () => {
    const refresh = vi.fn().mockImplementation(() => Promise.resolve(undefined));
    fetchSpy.mockImplementationOnce(() => Promise.reject());
    const execute = useSoftDelete("/api/bananas/124", { refresh });
    await execute();

    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(fetchSpy).toHaveBeenCalledWith("/api/bananas/124", { method: "PATCH", body: { deleted: true } });
    expect(add).toHaveBeenCalledOnce();
    expect(add).toHaveBeenCalledWith(error);
    expect(refresh).toHaveBeenCalled();
    expect(start).not.toHaveBeenCalled();
    expect(finish).not.toHaveBeenCalled();
});

test("should add an error toast when undo failed", async () => {
    const refresh = vi.fn().mockImplementation(() => Promise.resolve(undefined));
    const execute = useSoftDelete("/api/bananas/123", { refresh });
    expect(start).not.toHaveBeenCalled();
    expect(finish).not.toHaveBeenCalled();
    expect(refresh).not.toHaveBeenCalled();
    expect(add).not.toHaveBeenCalled();
    await execute();

    expect(refresh).toHaveBeenCalledOnce();
    expect(add).toHaveBeenCalledOnce();

    fetchSpy.mockImplementationOnce(() => Promise.reject());
    add.mock.calls[0][0].actions[0].onClick();

    await vi.waitFor(() => {
        expect(start).toHaveBeenCalledOnce();
        expect(finish).toHaveBeenCalledOnce();
        expect(refresh).toHaveBeenCalledTimes(2);
        expect(add).toHaveBeenCalledTimes(2);
        expect(add).toHaveBeenCalledWith(error);
    });
});

test("should allow passing custom translation keys for the title and description of the success toast", async () => {
    const options = { successTitle: "Oranges", successDescription: "Yay", interpolations: { count: "2" } };
    const execute = useSoftDelete("/api/bananas/123", options);
    await execute();
    expect(t).toHaveBeenCalledTimes(3);
    expect(t).toHaveBeenCalledWith(options.successTitle);
    expect(t).toHaveBeenCalledWith(options.successDescription, options.interpolations);
    expect(t).toHaveBeenCalledWith("ui.undo");
    expect(add).toHaveBeenCalledWith(
        expect.objectContaining({
            title: options.successTitle,
            description: options.successDescription,
        }),
    );
});

test("should default to providing empty interpolations if only a success description is provided", async () => {
    const options = { successDescription: "Yay" };
    const execute = useSoftDelete("/api/bananas/123", options);
    await execute();
    expect(t).toHaveBeenCalledTimes(2);
    expect(t).toHaveBeenCalledWith(options.successDescription, {});
});
