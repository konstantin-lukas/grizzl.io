import type { DBFixtures } from "~~/test-utils/database/fixture";
import { truncate } from "~~/test-utils/database/truncate";
import { sortByCreatedAt } from "~~/test-utils/helpers/sort";
import { expect, test } from "~~/test-utils/playwright";
import { withoutAuth } from "~~/test-utils/playwright/utils/auth";

const TYPES = [
    ["string", "42"],
    ["int", 42],
    ["float", 42.5],
    ["boolean", true],
    ["null", null],
    ["object", {}],
    ["array", []],
] as const;

export function testIdParameter(method: "put" | "patch", path: string, data?: object) {
    test("returns a 404 status code when the provided id is unknown", async ({ request }) => {
        const response = await request[method](`${path}/2222222222222222`, { data });
        expect(response.status()).toBe(404);
    });

    test("returns a 400 status code when the provided id has the wrong format", async ({ request }) => {
        const response = await request[method](`${path}/bananas`, { data });
        expect(response.status()).toBe(400);
    });
}

export function test401WhenLoggedOut(method: "get" | "post" | "patch" | "delete" | "put", path: string) {
    withoutAuth(() => {
        test("returns a 401 status code when an unauthenticated request is made", async ({ request }) => {
            const response = await request[method](path);
            expect(response.status()).toBe(401);
        });
    });
}

export function createInvalidTypeTestCases<T extends Record<string, unknown>>(
    data: T,
    property: keyof T,
    options: {
        valid?: (typeof TYPES)[number][0][];
        caseName?: (property: string, type: string) => string;
        dataTransform?: (data: T, property: string, value: (typeof TYPES)[number][1]) => unknown;
    },
) {
    const testCases = [];
    for (const [type, value] of TYPES) {
        if (!(options.valid ?? []).includes(type)) {
            testCases.push([
                options.caseName?.(property as string, type) ?? `property ${property as string} is of type ${type}`,
                options.dataTransform?.(data, property as string, value) ?? { ...data, [property]: value },
            ]);
        }
    }
    return testCases as [string, T][];
}

export function testGetCollectionOwnership(fixtureProvider: (db: DBFixtures, userId: string) => Promise<string>) {
    test("does not return resources of other users", async ({ request, db }) => {
        const user = await db.user.selectByEmail("cmontgomeryburns@springfieldnuclear.com");
        const route = await fixtureProvider(db, user!.id);
        const response = await request.get(route);
        expect(response.status()).toBe(200);
        expect(await response.json()).toStrictEqual([]);
    });
}

export function testGetEmptyCollection(route: string | ((db: DBFixtures) => Promise<string>)) {
    test("returns an empty array when there are no resources", async ({ request, db }) => {
        const response = await request.get(typeof route === "string" ? route : await route(db));
        expect(response.status()).toBe(200);
        expect(await response.json()).toStrictEqual([]);
    });
}

export function testGetSoftDeletedCollection(fixtureProvider: (db: DBFixtures) => Promise<string>) {
    test("does not return soft-deleted resources", async ({ request, db }) => {
        const route = await fixtureProvider(db);
        const response = await request.get(route);
        expect(response.status()).toBe(200);
        expect(await response.json()).toStrictEqual([]);
    });
}

export function testGetCollectionSubResourceFiltering(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fixtureProvider: (db: DBFixtures) => Promise<{ thisRoute: string; otherRoute: string; subResources: any[] }>,
) {
    test("does not return sub-resources belonging to other resources", async ({ request, db }) => {
        const { subResources, thisRoute, otherRoute } = await fixtureProvider(db);
        const mappedSubResources = subResources.map(({ accountId, createdAt, deletedAt, userId, ...rest }) => ({
            ...rest,
            createdAt: createdAt.toISOString(),
        }));
        sortByCreatedAt(mappedSubResources, "desc");
        const response1 = await request.get(thisRoute);
        const response2 = await request.get(otherRoute);
        expect(response1.status()).toBe(200);
        expect(response2.status()).toBe(200);
        expect(await response1.json()).toStrictEqual(mappedSubResources);
        expect(await response2.json()).toStrictEqual([]);
    });
}

export function testGetCollectionSortedByCreationDate(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fixtureProvider: (db: DBFixtures) => Promise<{ route: string; resources: any[] }>,
) {
    test("allows retrieving a list of resources sorted by creation date", async ({ request, db }) => {
        const { route, resources } = await fixtureProvider(db);
        const mappedResources = resources.map(({ accountId, createdAt, deletedAt, userId, ...rest }) => ({
            ...rest,
            createdAt: createdAt.toISOString(),
        }));
        sortByCreatedAt(mappedResources, "desc");
        const response = await request.get(route);
        expect(response.status()).toBe(200);
        expect(await response.json()).toStrictEqual(mappedResources);
    });
}

export function testGetCollectionOfSoftDeletedParentResource(fixtureProvider: (db: DBFixtures) => Promise<string>) {
    test("does not return sub-resources of soft-deleted resources", async ({ request, db }) => {
        const route = await fixtureProvider(db);
        const response = await request.get(route);
        expect(response.status()).toBe(200);
        expect(await response.json()).toStrictEqual([]);
    });
}

type SoftDeletableFixture = "financeTransaction" | "financeAccount" | "financeAutoTransaction" | "timer";
type OwnableFixture = "financeAccount" | "timer";

export function testPostSubResourceToInvalidParentResource(
    route: (parentId: string) => string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parentFixture: (db: DBFixtures, userId?: string) => Promise<{ baseData: object; parentResource: any }>,
) {
    test("rejects creating a sub-resource on another user's parent resource", async ({ request, db }) => {
        const user = await db.user.selectByEmail("cmontgomeryburns@springfieldnuclear.com");
        const { parentResource, baseData } = await parentFixture(db, user!.id);

        const response = await request.post(route(parentResource.id), { data: baseData });
        expect(response.status()).toBe(404);
    });

    test("rejects creating a sub-resource on a non-existent parent resource", async ({ request, db }) => {
        const { baseData } = await parentFixture(db);
        const response = await request.post(route("2222222222222222"), { data: baseData });
        expect(response.status()).toBe(404);
    });
}

export function testPatchDeletedPropertyOnSubResourceWithInvalidParentResource(
    fixtureProvider: (
        db: DBFixtures,
        userId?: string,
    ) => Promise<{ validUrl: string; invalidUrl: string; unknownUrl: string }>,
) {
    test("rejects updating a sub-resource on another user's parent resource", async ({ request, db }) => {
        const user = await db.user.selectByEmail("cmontgomeryburns@springfieldnuclear.com");
        const { validUrl: route } = await fixtureProvider(db, user!.id);

        const response = await request.patch(route, { data: { deleted: true } });
        expect(response.status()).toBe(404);
    });

    test("rejects updating a sub-resource when the parent resource is not associated", async ({ request, db }) => {
        const { invalidUrl: route } = await fixtureProvider(db);

        const response = await request.patch(route, { data: { deleted: true } });
        expect(response.status()).toBe(404);
    });

    test("rejects updating a sub-resource on a non-existent parent resource", async ({ request, db }) => {
        const { unknownUrl: route } = await fixtureProvider(db);
        await truncate(db.client);
        const response = await request.patch(route, { data: { deleted: true } });
        expect(response.status()).toBe(404);
    });
}

export function testPostIgnoresUserId(route: string, fixtureName: OwnableFixture, baseData: object) {
    test("ignores any provided id for determining ownership", async ({ request, db }) => {
        await request.post(route, { data: { ...baseData, userId: "2222222222222222" } });
        const data = await db[fixtureName].select();
        const user = await db.user.selectByEmail("user@test.com");
        expect(data[0]!.userId).toBe(user!.id);
    });
}

export function testPatchSoftDeletableTrait({
    fixtureProvider,
    fixtureName,
    fullData,
    baseData,
}: {
    fixtureProvider: (
        db: DBFixtures,
        options?: { userId?: string; deleted?: boolean },
    ) => Promise<{ data: any; route: string }>; // eslint-disable-line @typescript-eslint/no-explicit-any
    fixtureName: SoftDeletableFixture;
    fullData: object;
    baseData: object;
}) {
    test("only allows a user to edit their own resources", async ({ request, db }) => {
        const otherUser = await db.user.selectByEmail("cmontgomeryburns@springfieldnuclear.com");

        const { data, route } = await fixtureProvider(db, { userId: otherUser!.id });
        expect(data.deletedAt).toBeNull();
        const response = await request.patch(route, {
            data: { deleted: true },
        });

        expect(response.status()).toBe(404);
        const [patchedData] = await db[fixtureName].select(data.id);
        expect(patchedData).toStrictEqual(data);
    });

    test("only allows patching the deleted property", async ({ request, db }) => {
        const { data, route } = await fixtureProvider(db);

        const response = await request.patch(route, {
            data: { ...fullData, deleted: true },
        });
        expect(response.status()).toBe(204);
        const [patchedData] = await db[fixtureName].select(data.id);
        const { deletedAt: _, ...expected } = data;
        expect(patchedData).toStrictEqual(expect.objectContaining(expected));
        expect(patchedData!.deletedAt).not.toBeNull();
    });

    test("only modifies the requested resource", async ({ request, db }) => {
        const otherUser = await db.user.selectByEmail("cmontgomeryburns@springfieldnuclear.com");
        const { data: otherData } = await fixtureProvider(db, { userId: otherUser!.id });
        const { data, route } = await fixtureProvider(db);

        expect(data.deletedAt).toBeNull();
        expect(otherData.deletedAt).toBeNull();
        await request.patch(route, { data: { deleted: true } });
        const [dataAfterPatch] = await db[fixtureName].select(data.id);
        const [otherDataAfterPatch] = await db[fixtureName].select(otherData.id);

        const { deletedAt: _, ...expected } = data;
        expect(dataAfterPatch).toStrictEqual(expect.objectContaining(expected));
        expect(dataAfterPatch!.deletedAt).not.toBeNull();

        expect(otherDataAfterPatch).toStrictEqual(otherData);
    });

    test("allows undoing a delete", async ({ request, db }) => {
        const { data, route } = await fixtureProvider(db, { deleted: true });
        expect(data.deletedAt).not.toBe(null);
        await request.patch(route, { data: { ...baseData, deleted: false } });
        const [patchedData] = await db[fixtureName].select(data.id);
        expect(patchedData!.deletedAt).toBeNull();
    });
}
