import { beforeEach, expect, test, vi } from "vitest";
import DomainError from "~~/server/errors/domain-error";
import NotFoundError from "~~/server/errors/not-found-error";
import { createContainer } from "~~/server/utils/di";

const { db, BaseRepository } = vi.hoisted(() => {
    return {
        db: vi.fn(),
        BaseRepository: vi.fn(class {}),
    };
});

const id = "AAAAaaaaBBBBbbbb";
vi.mock("~~/server/database/mixins", () => {
    return {
        generateId: () => id,
    };
});

vi.mock("~~/server/database", () => {
    return {
        db,
    };
});

vi.mock("~~/server/features/core/base.repository", () => {
    return {
        default: BaseRepository,
    };
});

const SomeRepository = vi.fn(class extends BaseRepository {});

const SomeService = vi.fn(
    class {
        static readonly deps = [SomeRepository] as unknown[];
    },
);

const SomeController = vi.fn(
    class {
        static readonly deps = [SomeService] as unknown[];
    },
);

beforeEach(() => {
    vi.resetAllMocks();
});

test("creates a class without dependencies", () => {
    const container = createContainer();
    const result = container.resolve(SomeRepository as never);
    expect(SomeRepository).toHaveBeenCalledOnce();
    expect(result).toBeInstanceOf(SomeRepository);
});

test("resolves dependency chains", () => {
    const container = createContainer();
    const result = container.resolve(SomeController as never);
    expect(SomeRepository).toHaveBeenCalledOnce();
    expect(SomeService).toHaveBeenCalledOnce();
    expect(SomeController).toHaveBeenCalledOnce();
    expect(result).toBeInstanceOf(SomeController);
});

test("detects circular dependencies", () => {
    class CircularRepository {}
    class CircularService {}

    (CircularRepository as unknown as { deps: unknown }).deps = [CircularService];
    (CircularService as unknown as { deps: unknown }).deps = [CircularRepository];

    const container = createContainer();
    expect(() => container.resolve(CircularRepository as never)).toThrow(
        new Error("Circular dependency detected: CircularRepository -> CircularService -> CircularRepository"),
    );
});

test("automatically passes the database connection as the first constructor arguments for classes extending the base repository", () => {
    const container = createContainer();
    const result = container.resolve(SomeRepository as never);

    expect(result).toBeInstanceOf(SomeRepository);

    expect(SomeRepository).toHaveBeenCalledWith(db);
    expect(BaseRepository).toHaveBeenCalledWith(db);
});

test("resolves multiple dependencies and restores instances from cache when they appear multiple times in the dependency chain", () => {
    const RepositoryA = vi.fn(class {});
    const RepositoryB = vi.fn(class {});
    const ServiceA = vi.fn(
        class {
            static readonly deps = [RepositoryA, RepositoryB] as unknown[];
        },
    );
    const ServiceB = vi.fn(
        class {
            static readonly deps = [RepositoryB, RepositoryA] as unknown[];
        },
    );
    const MultipleController = vi.fn(
        class {
            static readonly deps = [ServiceA, ServiceB] as unknown[];
        },
    );

    const container = createContainer();
    const result = container.resolve(MultipleController as never);

    expect(result).toBeInstanceOf(MultipleController);
    expect(RepositoryA).toHaveBeenCalledOnce();
    expect(RepositoryB).toHaveBeenCalledOnce();
    expect(ServiceA).toHaveBeenCalledOnce();
    expect(ServiceB).toHaveBeenCalledOnce();
    expect(MultipleController).toHaveBeenCalledOnce();

    const [repoA] = ServiceA.mock.calls[0]! as unknown[];
    const [, repoB] = ServiceA.mock.calls[0]! as unknown[];

    expect(repoA).toBeInstanceOf(RepositoryA);
    expect(repoB).toBeInstanceOf(RepositoryB);

    expect((ServiceB.mock.calls[0]! as unknown[])[0]).toBe(repoB);
    expect((ServiceB.mock.calls[0]! as unknown[])[1]).toBe(repoA);
});

test.each([
    {
        errorType: DomainError,
        expectedError: {
            message: "Internal Server Error | AAAAaaaaBBBBbbbb",
            statusCode: 500,
            statusMessage: "Internal Server Error",
        },
    },
    {
        errorType: NotFoundError,
        expectedError: {
            message: "A | AAAAaaaaBBBBbbbb",
            statusCode: 404,
            statusMessage: "Not Found",
        },
    },
])(
    "automatically catches $errorType errors on created instance's method calls and translates them to http errors",
    async ({ errorType, expectedError }) => {
        class ThrowingController {
            static readonly deps = [];
            async throwingMethod() {
                throw new errorType("A", "B");
            }
        }

        const container = createContainer();
        const event = "event" as never;
        const throwingInstance = container.resolve(ThrowingController, event);

        await expect(throwingInstance.throwingMethod()).rejects.toMatchObject(expect.objectContaining(expectedError));
    },
);

test("automatically catches errors on synchronous method calls", () => {
    class ThrowingController {
        static readonly deps = [];
        throwingMethod() {
            throw new Error("A");
        }
    }

    const container = createContainer();
    const event = "event" as never;
    const throwingInstance = container.resolve(ThrowingController, event);

    expect(throwingInstance.throwingMethod).toThrow(
        expect.objectContaining({
            message: "Internal Server Error | AAAAaaaaBBBBbbbb",
            statusCode: 500,
            statusMessage: "Internal Server Error",
        }),
    );
});

test("does not turn synchronous methods into asynchronous ones", () => {
    const value = 123;
    class SyncController {
        static readonly deps = [];
        syncMethod() {
            return value;
        }
    }

    const container = createContainer();
    const event = "event" as never;
    const throwingInstance = container.resolve(SyncController, event);

    expect(throwingInstance.syncMethod()).toBe(value);
});

test("allows accessing non-function properties even when instance is proxied", () => {
    const value = 123;
    class SyncController {
        static readonly deps = [];
        value = value;
    }

    const container = createContainer();
    const event = "event" as never;
    const throwingInstance = container.resolve(SyncController, event);

    expect(throwingInstance.value).toBe(value);
});
