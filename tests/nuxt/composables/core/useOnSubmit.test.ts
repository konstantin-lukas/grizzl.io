import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, expect, test, vi } from "vitest";
import useOnSubmit from "~/core/composables/useOnSubmit";

const success = {
    title: "Success",
    description: "Nice!",
    color: "success",
};

const error = {
    title: "Error",
    description: "Oh no!",
    color: "error",
};

const {
    useToastMock,
    useI18nMock,
    createToastSuccessMock,
    useLoadingIndicatorMock,
    createToastErrorMock,
    start,
    finish,
} = await vi.hoisted(async () => {
    const t = vi.fn((key: string) => key);
    const add = vi.fn();
    const start = vi.fn();
    const finish = vi.fn();
    const createToastSuccessMock = vi.fn(() => success);
    const createToastErrorMock = vi.fn(() => error);

    return {
        useToastMock: () => ({ add }),
        createToastSuccessMock,
        createToastErrorMock,
        start,
        finish,
        useI18nMock: () => ({ t }),
        useLoadingIndicatorMock: () => ({ start, finish }),
    };
});

mockNuxtImport("useI18n", () => {
    return useI18nMock;
});

mockNuxtImport("useLoadingIndicator", () => {
    return useLoadingIndicatorMock;
});

vi.mock("#ui/composables", () => {
    return { useToast: useToastMock };
});

vi.mock("~/core/utils/toast", () => {
    return { createToastSuccess: createToastSuccessMock, createToastError: createToastErrorMock };
});

vi.mock("#shared/core/utils/object.util", () => ({
    deepCopy: vi.fn(v => ({ ...v })),
}));

const fetchMock = vi.fn();
vi.stubGlobal("$fetch", fetchMock);
const emit = vi.fn();
const refresh = vi.fn();

const baseState = { name: "Test Resource" };

beforeEach(() => {
    vi.clearAllMocks();
});

function setup(overrides = {}) {
    return useOnSubmit({
        url: () => "/api/test",
        method: () => "POST",
        state: baseState,
        emit,
        translationKey: "test",
        interpolations: v => ({
            name: v.name,
        }),
        refresh,
        ...overrides,
    });
}

test("calls $fetch with correct params (POST)", async () => {
    const onSubmit = setup();

    fetchMock.mockResolvedValueOnce({});

    await onSubmit();

    expect(fetchMock).toHaveBeenCalledWith("/api/test", {
        method: "POST",
        body: baseState,
    });
});

test("emits success and shows success toast (POST)", async () => {
    const onSubmit = setup();

    fetchMock.mockResolvedValueOnce({});

    await onSubmit();

    expect(emit).toHaveBeenCalledWith("success");
    expect(createToastSuccessMock).toHaveBeenCalled();
    expect(useToastMock().add).toHaveBeenCalledWith(success);
});

test("uses PUT flow and correct translation keys", async () => {
    const onSubmit = setup({
        method: () => "PUT",
    });

    fetchMock.mockResolvedValueOnce({});

    await onSubmit();

    expect(createToastSuccessMock).toHaveBeenCalledWith("test.toast.updatedTitle", "test.toast.updatedDescription");
});

test("applies transform before sending", async () => {
    const transform = vi.fn(v => ({
        ...v,
        name: "Transformed",
    }));

    const onSubmit = setup({ transform });

    fetchMock.mockResolvedValueOnce({});

    await onSubmit();

    expect(transform).toHaveBeenCalledWith(baseState);
    expect(fetchMock).toHaveBeenCalledWith("/api/test", {
        method: "POST",
        body: { name: "Transformed" },
    });
});

test("calls refresh on success if provided", async () => {
    const onSubmit = setup();

    fetchMock.mockResolvedValueOnce({});

    await onSubmit();

    expect(refresh).toHaveBeenCalled();
});

test("handles errors and shows error toast", async () => {
    const err = new Error("fail");
    fetchMock.mockRejectedValueOnce(err);

    const onSubmit = setup();

    await onSubmit();

    expect(createToastErrorMock).toHaveBeenCalledWith(err);
    expect(useToastMock().add).toHaveBeenCalledWith(error);
});

test("calls loading start and finish", async () => {
    const onSubmit = setup();

    fetchMock.mockResolvedValueOnce({});

    await onSubmit();

    expect(start).toHaveBeenCalledWith({ force: true });
    expect(finish).toHaveBeenCalled();
});

test("uses dynamic url and method", async () => {
    const url = vi.fn(() => "/api/dynamic");
    const method = vi.fn(() => "PUT");

    const onSubmit = setup({ url, method });

    fetchMock.mockResolvedValueOnce({});

    await onSubmit();

    expect(fetchMock).toHaveBeenCalledWith("/api/dynamic", {
        method: "PUT",
        body: baseState,
    });
});

test("passes interpolations result to description", async () => {
    const interpolations = vi.fn(() => ({
        name: "My Resource",
    }));

    const onSubmit = setup({ interpolations });

    fetchMock.mockResolvedValueOnce({});

    await onSubmit();

    expect(interpolations).toHaveBeenCalled();
});

test("does not emit success on error", async () => {
    fetchMock.mockRejectedValueOnce(new Error("fail"));

    const onSubmit = setup();

    await onSubmit();

    expect(emit).not.toHaveBeenCalled();
});

test("calls finish even on error", async () => {
    fetchMock.mockRejectedValueOnce(new Error("fail"));

    const onSubmit = setup();

    await onSubmit();

    expect(finish).toHaveBeenCalled();
});
