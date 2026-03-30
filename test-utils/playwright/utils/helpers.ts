import { ID_LENGTH } from "#shared/core/validators/core.validator";
import type { DBFixtures } from "~~/test-utils/database/fixture";
import { wrapArray } from "~~/test-utils/helpers/array";
import { sortByCreatedAt } from "~~/test-utils/helpers/sort";
import { JSONWithBigInt } from "~~/test-utils/helpers/string";
import { expect, test } from "~~/test-utils/playwright";
import { withoutAuth } from "~~/test-utils/playwright/utils/auth";

const Types = [
    ["string", "42"],
    ["int", 42],
    ["float", 42.5],
    ["boolean", true],
    ["null", null],
    ["object", {}],
    ["array", []],
] as const;

type SoftDeletableFixture = "financeTransaction" | "financeAccount" | "financeAutoTransaction" | "timer";
type OwnableFixture = "financeAccount" | "timer";

export type Method = "get" | "get-collection" | "post" | "patch" | "delete" | "put";
type FixtureKey = Exclude<keyof DBFixtures, "client">;
interface FixtureResource {
    id: string;
    parentId?: string;
    data: any;
    basePath: string;
    fullPath: string;
    postDatabaseOverrides?: object;
    postRequestOverrides?: object;
    putDatabaseOverrides?: object;
    putRequestOverrides?: object;
    getDatabaseOverrides?: object;
}
type FixtureProvider = (options: { db: DBFixtures; userId?: string; count?: number }) => Promise<FixtureResource>;
type ConstructorOptions = {
    fixtureProvider: FixtureProvider;
    baseData: object;
    fullData: object;
    fixtureName: FixtureKey;
    parentFixtureName?: FixtureKey;
    method: Method;
    badPut: readonly any[];
    validPut: readonly any[];
    badPost: readonly any[];
    validPost: readonly any[];
};

function removeUndefinedFields(obj: object) {
    return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== undefined));
}

export class TestBuilder {
    private tests: (() => void)[] = [];
    private readonly fixtureProvider: FixtureProvider;
    private readonly method: Method = "get";
    private readonly resolvedMethod: Exclude<Method, "get-collection"> = "get";
    private readonly baseData: object;
    private readonly fullData: object;
    private readonly badPut: readonly any[];
    private readonly validPut: readonly any[];
    private readonly badPost: readonly any[];
    private readonly validPost: readonly any[];
    private readonly fixtureName: FixtureKey;
    private readonly parentFixtureName?: FixtureKey;

    constructor({
        fixtureProvider,
        baseData,
        fullData,
        fixtureName,
        method,
        badPut,
        validPut,
        badPost,
        validPost,
        parentFixtureName,
    }: ConstructorOptions) {
        this.method = method;
        this.resolvedMethod = method === "get-collection" ? "get" : method;
        this.fixtureProvider = fixtureProvider;
        this.baseData = baseData;
        this.fullData = fullData;
        this.fixtureName = fixtureName;
        this.badPut = badPut;
        this.validPut = validPut;
        this.badPost = badPost;
        this.validPost = validPost;
        this.parentFixtureName = parentFixtureName;
    }

    public build() {
        for (const test of this.tests) {
            test();
        }
        this.tests = [];
    }

    private checkMethods(testSuiteName: string, allowedMethods: Method[]) {
        if (!allowedMethods.includes(this.method)) {
            throw new Error(`Test suite '${testSuiteName}' can only be run with these methods: ${allowedMethods}.`);
        }
    }

    /**
     * @allowed patch, put
     */
    public returnsA404StatusCodeWhenTheProvidedIdIsUnknown() {
        this.tests.push(() => {
            this.checkMethods("returnsA404StatusCodeWhenTheProvidedIdIsUnknown", ["patch", "put"]);

            test("returns a 404 status code when the provided id is unknown", async ({ request, db }) => {
                const { basePath } = await this.fixtureProvider({ db });
                const response = await request[this.resolvedMethod](`${basePath}/2222222222222222`, {
                    data: this.method === "patch" ? { deleted: true } : this.baseData,
                });
                expect(response.status()).toBe(404);
            });
        });

        return this;
    }

    /**
     * @allowed patch, put
     */
    public returnsA400StatusCodeWhenTheProvidedIdHasTheWrongFormat() {
        this.tests.push(() => {
            this.checkMethods("returnsA400StatusCodeWhenTheProvidedIdHasTheWrongFormat", ["patch", "put"]);

            test("returns a 400 status code when the provided id has the wrong format", async ({ request, db }) => {
                const { basePath } = await this.fixtureProvider({ db });
                const response = await request[this.resolvedMethod](`${basePath}/bananas`, {
                    data: this.method === "patch" ? { deleted: true } : this.baseData,
                });
                expect(response.status()).toBe(400);
            });
        });

        return this;
    }

    /**
     * @allowed patch, put, post, get, get-collection
     */
    public returnsA401StatusCodeWhenAnUnauthenticatedRequestIsMade() {
        this.tests.push(() => {
            this.checkMethods("returnsA401StatusCodeWhenAnUnauthenticatedRequestIsMade", [
                "patch",
                "put",
                "post",
                "get",
                "get-collection",
            ]);

            withoutAuth(() => {
                test("returns a 401 status code when an unauthenticated request is made", async ({ request, db }) => {
                    const { basePath, fullPath } = await this.fixtureProvider({ db });
                    const path = this.method === "get" || this.method === "post" ? basePath : fullPath;
                    const response = await request[this.resolvedMethod](path);
                    expect(response.status()).toBe(401);
                });
            });
        });

        return this;
    }

    /**
     * @allowed patch
     */
    public onlyAllowsAUserToSoftDeleteTheirOwnResources() {
        this.tests.push(() => {
            this.checkMethods("onlyAllowsAUserToSoftDeleteTheirOwnResources", ["patch"]);

            test("only allows a user to soft-delete their own resources", async ({ request, db }) => {
                const otherUser = await db.user.selectByEmail("cmontgomeryburns@springfieldnuclear.com");

                const { fullPath, data } = await this.fixtureProvider({ db, userId: otherUser!.id });
                expect(data.deletedAt).toBeNull();
                const response = await request[this.resolvedMethod](fullPath, {
                    data: { deleted: true },
                });

                expect(response.status()).toBe(404);
                const [patchedData] = await db[this.fixtureName].select(data.id);
                expect(patchedData).toStrictEqual(data);
            });
        });

        return this;
    }

    /**
     * @allowed patch
     */
    public onlyAllowsPatchingTheDeletedProperty() {
        this.tests.push(() => {
            this.checkMethods("onlyAllowsPatchingTheDeletedProperty", ["patch"]);

            test("only allows patching the deleted property", async ({ request, db }) => {
                const { data, fullPath } = await this.fixtureProvider({ db });

                const response = await request[this.resolvedMethod](fullPath, {
                    data: { ...this.fullData, deleted: true },
                });
                expect(response.status()).toBe(204);
                const [patchedData] = await db[this.fixtureName].select(data.id);
                const { deletedAt: _, ...expected } = data;
                expect(patchedData).toStrictEqual(
                    expect.objectContaining({ ...expected, deletedAt: expect.any(Date) }),
                );
            });
        });

        return this;
    }

    /**
     * @allowed patch
     */
    public onlySoftDeletesTheRequestedResource() {
        this.tests.push(() => {
            this.checkMethods("onlySoftDeletesTheRequestedResource", ["patch"]);

            test("only soft-deletes the requested resource", async ({ request, db }) => {
                const otherUser = await db.user.selectByEmail("cmontgomeryburns@springfieldnuclear.com");
                const { data: otherData } = await this.fixtureProvider({ db, userId: otherUser!.id });
                const { data, fullPath } = await this.fixtureProvider({ db });

                expect(data.deletedAt).toBeNull();
                expect(otherData.deletedAt).toBeNull();

                await request[this.resolvedMethod](fullPath, { data: { deleted: true } });
                const [dataAfterPatch] = await db[this.fixtureName].select(data.id);
                const [otherDataAfterPatch] = await db[this.fixtureName].select(otherData.id);

                const { deletedAt: _, ...expected } = data;
                expect(dataAfterPatch).toStrictEqual(
                    expect.objectContaining({ ...expected, deletedAt: expect.any(Date) }),
                );
                expect(otherDataAfterPatch).toStrictEqual(otherData);
            });
        });

        return this;
    }

    /**
     * @allowed patch
     */
    public allowsUndoingADelete() {
        this.tests.push(() => {
            this.checkMethods("allowsUndoingADelete", ["patch"]);

            test("allows undoing a delete", async ({ request, db }) => {
                const { id, data, fullPath } = await this.fixtureProvider({ db });
                await db[this.fixtureName].update({ deletedAt: new Date() }, id);
                const softDeletedDatum = await db[this.fixtureName].select(id);
                expect((softDeletedDatum as unknown as { deletedAt: unknown }).deletedAt).not.toBe(null);

                await request[this.resolvedMethod](fullPath, { data: { ...this.baseData, deleted: false } });
                const [patchedData] = await db[this.fixtureName].select(data.id);
                expect((patchedData as { deletedAt: unknown }).deletedAt).toBeNull();
            });
        });

        return this;
    }

    /**
     * @allowed get-collection
     */
    public returnsAnEmptyArrayWhenThereAreNoResources() {
        this.tests.push(() => {
            this.checkMethods("returnsAnEmptyArrayWhenThereAreNoResources", ["get-collection"]);

            test("returns an empty array when there are no resources", async ({ request, db }) => {
                const { basePath } = await this.fixtureProvider({ db });
                await db[this.fixtureName].delete();

                const response = await request[this.resolvedMethod](basePath);

                expect(response.status()).toBe(200);
                expect(await response.json()).toStrictEqual([]);
            });
        });

        return this;
    }

    /**
     * @allowed get-collection
     */
    public doesNotReturnResourcesOfOtherUsers() {
        this.tests.push(() => {
            this.checkMethods("doesNotReturnResourcesOfOtherUsers", ["get-collection"]);

            test("does not return resources of other users", async ({ request, db }) => {
                const user = await db.user.selectByEmail("cmontgomeryburns@springfieldnuclear.com");
                const { basePath } = await this.fixtureProvider({ db, userId: user!.id });

                const response = await request[this.resolvedMethod](basePath);
                expect(response.status()).toBe(200);
                expect(await response.json()).toStrictEqual([]);
            });
        });

        return this;
    }

    /**
     * @allowed get-collection
     */
    public doesNotReturnSoftDeletedResources() {
        this.tests.push(() => {
            this.checkMethods("doesNotReturnSoftDeletedResources", ["get-collection"]);

            test("does not return soft-deleted resources", async ({ request, db }) => {
                const { id, basePath } = await this.fixtureProvider({ db });
                await db[this.fixtureName].update({ deletedAt: new Date() }, id);

                const response = await request[this.resolvedMethod](basePath);
                expect(response.status()).toBe(200);
                expect(await response.json()).toStrictEqual([]);
            });
        });

        return this;
    }

    /**
     * @allowed get-collection
     */
    public allowsRetrievingAListOfResourcesSortedByCreationDate() {
        this.tests.push(() => {
            this.checkMethods("allowsRetrievingAListOfResourcesSortedByCreationDate", ["get-collection"]);

            test("allows retrieving a list of resources sorted by creation date", async ({ request, db }) => {
                const { basePath, data, getDatabaseOverrides } = await this.fixtureProvider({ db, count: 3 });
                const mappedResources = wrapArray(data).map(
                    ({ accountId, createdAt, deletedAt, userId, ...rest }: any) => {
                        return removeUndefinedFields({
                            ...rest,
                            createdAt: createdAt.toISOString(),
                            ...getDatabaseOverrides,
                        });
                    },
                );
                sortByCreatedAt(mappedResources as never, "desc");

                const response = await request[this.resolvedMethod](basePath);

                expect(response.status()).toBe(200);
                expect(await response.json()).toStrictEqual(mappedResources);
            });
        });

        return this;
    }

    /**
     * @allowed post
     */
    public ignoresAnyProvidedIdForDeterminingOwnership() {
        this.tests.push(() => {
            this.checkMethods("ignoresAnyProvidedIdForDeterminingOwnership", ["post"]);

            test("ignores any provided id for determining ownership", async ({ request, db }) => {
                const { basePath } = await this.fixtureProvider({ db });
                await db[this.fixtureName].delete();

                await request[this.resolvedMethod](basePath, {
                    data: { ...this.baseData, userId: "2222222222222222" },
                });
                const data = await db[this.fixtureName].select();
                const user = await db.user.selectByEmail("user@test.com");
                expect((data[0] as { userId: string }).userId).toBe(user!.id);
            });
        });

        return this;
    }

    /**
     * @allowed post, put
     */
    public rejectsRequestsWhenPayloadIsInvalid() {
        this.tests.push(() => {
            this.checkMethods("rejectsRequestsWhenPayloadIsInvalid", ["post", "put"]);

            const isPost = this.method === "post";
            const testCases = isPost ? this.badPost : this.badPut;
            for (const [name, data] of testCases) {
                test(`rejects creating resources when ${name}`, async ({ request, db }) => {
                    const { basePath, fullPath } = await this.fixtureProvider({ db });
                    const path = isPost ? basePath : fullPath;
                    const response = await request[this.resolvedMethod](path, { data: JSONWithBigInt(data) });
                    expect(response.status()).toBe(400);
                });
            }
        });

        return this;
    }
    /**
     * @allowed post, put
     */
    public acceptsRequestsWhenPayloadIsValid() {
        this.tests.push(() => {
            this.checkMethods("acceptsRequestsWhenPayloadIsValid", ["post", "put"]);

            const isPost = this.method === "post";
            const testCases = isPost ? this.validPost : this.validPut;
            for (const [name, data] of testCases) {
                test(`allows creating resources when ${name}`, async ({ request, db }) => {
                    const {
                        basePath,
                        fullPath,
                        id,
                        putDatabaseOverrides,
                        postDatabaseOverrides,
                        postRequestOverrides,
                        putRequestOverrides,
                    } = await this.fixtureProvider({ db });
                    const path = isPost ? basePath : fullPath;

                    const requestOverrides = isPost ? postRequestOverrides : putRequestOverrides;
                    const response = await request[this.resolvedMethod](path, {
                        data: JSONWithBigInt({ ...data, ...requestOverrides }),
                    });

                    expect(response.status()).toBe(isPost ? 201 : 204);

                    const {
                        id: createdId,
                        createdAt,
                        deletedAt,
                        userId,
                        ...resource
                    } = (await db[this.fixtureName].select()).find(r => (isPost ? r.id !== id : r.id === id)) as any;

                    const databaseOverrides = isPost ? postDatabaseOverrides : putDatabaseOverrides;
                    const expectedData = removeUndefinedFields({ ...data, ...databaseOverrides });
                    expect(resource).toStrictEqual(expectedData);

                    if (!isPost) return;

                    const responseData = response.headers().location;
                    expect(responseData).toBe(`${basePath}/${createdId}`);
                });
            }
        });

        return this;
    }

    /**
     * @allowed post, patch, put
     */
    public rejectsAnOperationOnASubResourceOwnedByAnotherUsersParentResource() {
        this.tests.push(() => {
            this.checkMethods("rejectsAnOperationOnASubResourceOwnedByAnotherUsersParentResource", [
                "post",
                "put",
                "patch",
            ]);

            test("rejects an operation on a sub-resource owned by another user's parent resource", async ({
                request,
                db,
            }) => {
                const user = await db.user.selectByEmail("cmontgomeryburns@springfieldnuclear.com");
                const { fullPath, basePath } = await this.fixtureProvider({ db, userId: user!.id });
                const path = this.method === "post" ? basePath : fullPath;
                const data = this.method === "patch" ? { deleted: true } : this.baseData;

                const response = await request[this.resolvedMethod](path, { data });
                expect(response.status()).toBe(404);
            });
        });

        return this;
    }

    /**
     * @allowed patch, put
     */
    public rejectsAnOperationOnASubResourceWhenTheParentResourceIsNotAssociated() {
        this.tests.push(() => {
            this.checkMethods("rejectsAnOperationOnASubResourceWhenTheParentResourceIsNotAssociated", ["put", "patch"]);

            test("rejects an operation on a sub-resource when the parent resource is not associated", async ({
                request,
                db,
            }) => {
                const { basePath } = await this.fixtureProvider({ db });
                const { id } = await this.fixtureProvider({ db });
                const data = this.method === "patch" ? { deleted: true } : this.baseData;

                const response = await request[this.resolvedMethod](`${basePath}/${id}`, { data });
                expect(response.status()).toBe(404);
            });
        });

        return this;
    }

    /**
     * @allowed post, patch, put
     */
    public rejectsAnOperationOnASubResourceOnANonExistentParentResource() {
        this.tests.push(() => {
            this.checkMethods("rejectsAnOperationOnASubResourceOnANonExistentParentResource", ["post", "put", "patch"]);

            test("rejects an operation a sub-resource on a non-existent parent resource", async ({ request, db }) => {
                const { basePath, fullPath, parentId } = await this.fixtureProvider({ db });

                expect(parentId?.length).toBe(ID_LENGTH);
                const path = this.method === "post" ? basePath : fullPath;
                const invalidPath = path.replace(parentId!, "2222222222222222");

                expect(invalidPath).not.toBe(path);
                const data = this.method === "patch" ? { deleted: true } : this.baseData;

                const response = await request[this.resolvedMethod](invalidPath, { data });
                expect(response.status()).toBe(404);
            });
        });

        return this;
    }

    /**
     * Get on a single resource is currently not implement but can be added if needed
     * @allowed get-collection
     */
    public doesNotReturnSubResourcesBelongingToOtherResources() {
        this.tests.push(() => {
            this.checkMethods("doesNotReturnSubResourcesBelongingToOtherResources", ["get-collection"]);

            test("does not return sub-resources belonging to other resources", async ({ request, db }) => {
                const {
                    basePath: path1,
                    data: data1,
                    getDatabaseOverrides: o1,
                } = await this.fixtureProvider({ db, count: 2 });
                const {
                    basePath: path2,
                    data: data2,
                    getDatabaseOverrides: o2,
                } = await this.fixtureProvider({ db, count: 3 });

                const mappedSubResources1 = data1.map(({ accountId, createdAt, deletedAt, userId, ...rest }: any) =>
                    removeUndefinedFields({
                        ...rest,
                        createdAt: createdAt.toISOString(),
                        ...o1,
                    }),
                );
                const mappedSubResources2 = data2.map(({ accountId, createdAt, deletedAt, userId, ...rest }: any) =>
                    removeUndefinedFields({
                        ...rest,
                        createdAt: createdAt.toISOString(),
                        ...o2,
                    }),
                );

                sortByCreatedAt(mappedSubResources1, "desc");
                sortByCreatedAt(mappedSubResources2, "desc");
                const response1 = await request.get(path1);
                const response2 = await request.get(path2);
                expect(response1.status()).toBe(200);
                expect(response2.status()).toBe(200);
                expect(await response1.json()).toStrictEqual(mappedSubResources1);
                expect(await response2.json()).toStrictEqual(mappedSubResources2);
            });
        });

        return this;
    }

    /**
     * Get on a single resource is currently not implement but can be added if needed
     * @allowed get-collection
     */
    public doesNotReturnSubResourcesOfSoftDeletedResources() {
        this.tests.push(() => {
            this.checkMethods("doesNotReturnSubResourcesOfSoftDeletedResources", ["get-collection"]);

            test("does not return sub-resources of soft-deleted resources", async ({ request, db }) => {
                const { parentId, basePath } = await this.fixtureProvider({ db });
                await db[this.parentFixtureName!].update({ deletedAt: new Date() }, parentId);
                const response = await request.get(basePath);
                expect(response.status()).toBe(200);
                expect(await response.json()).toStrictEqual([]);
            });
        });

        return this;
    }
}

export function createInvalidTypeTestCases<T extends Record<string, unknown>, K extends keyof T>(
    data: T,
    property: K,
    options: {
        valid?: (typeof Types)[number][0][];
        caseName?: (property: K, type: string) => string;
        dataTransform?: (data: T, property: K, value: (typeof Types)[number][1]) => unknown;
    },
) {
    const testCases = [];
    for (const [type, value] of Types) {
        if (!(options.valid ?? []).includes(type)) {
            testCases.push([
                options.caseName?.(property, type) ?? `property ${property.toString()} is of type ${type}`,
                options.dataTransform?.(data, property, value) ?? { ...data, [property]: value },
            ]);
        }
    }
    return testCases as [string, T][];
}

/**
 * @deprecated
 */
export function testPostSubResourceToInvalidParentResource(
    route: (parentId: string) => string,

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

/**
 * @deprecated
 */
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

/**
 * @deprecated
 */
export function test401WhenLoggedOut(method: "get" | "post" | "patch" | "delete" | "put", path: string) {
    withoutAuth(() => {
        test("returns a 401 status code when an unauthenticated request is made", async ({ request }) => {
            const response = await request[method](path);
            expect(response.status()).toBe(401);
        });
    });
}

/**
 * @deprecated
 */
export function testPatchSoftDeletableTrait({
    fixtureProvider,
    fixtureName,
    fullData,
    baseData,
}: {
    fixtureProvider: (
        db: DBFixtures,
        options?: { userId?: string; deleted?: boolean },
    ) => Promise<{ data: any; route: string }>;
    fixtureName: SoftDeletableFixture;
    fullData: object;
    baseData: object;
}) {
    // OK
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

    // OK
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

    // OK
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

    // OK
    test("allows undoing a delete", async ({ request, db }) => {
        const { data, route } = await fixtureProvider(db, { deleted: true });
        expect(data.deletedAt).not.toBe(null);
        await request.patch(route, { data: { ...baseData, deleted: false } });
        const [patchedData] = await db[fixtureName].select(data.id);
        expect(patchedData!.deletedAt).toBeNull();
    });
}

/**
 * @deprecated
 */
export function testGetEmptyCollection(route: string | ((db: DBFixtures) => Promise<string>)) {
    test("returns an empty array when there are no resources", async ({ request, db }) => {
        const response = await request.get(typeof route === "string" ? route : await route(db));
        expect(response.status()).toBe(200);
        expect(await response.json()).toStrictEqual([]);
    });
}

/**
 * @deprecated
 */
export function testGetCollectionOwnership(fixtureProvider: (db: DBFixtures, userId: string) => Promise<string>) {
    test("does not return resources of other users", async ({ request, db }) => {
        const user = await db.user.selectByEmail("cmontgomeryburns@springfieldnuclear.com");
        const route = await fixtureProvider(db, user!.id);
        const response = await request.get(route);
        expect(response.status()).toBe(200);
        expect(await response.json()).toStrictEqual([]);
    });
}

/**
 * @deprecated
 */
export function testGetSoftDeletedCollection(fixtureProvider: (db: DBFixtures) => Promise<string>) {
    test("does not return soft-deleted resources", async ({ request, db }) => {
        const route = await fixtureProvider(db);
        const response = await request.get(route);
        expect(response.status()).toBe(200);
        expect(await response.json()).toStrictEqual([]);
    });
}

/**
 * @deprecated
 */
export function testGetCollectionSortedByCreationDate(
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

/**
 * @deprecated
 */
export function testPostIgnoresUserId(route: string, fixtureName: OwnableFixture, baseData: object) {
    test("ignores any provided id for determining ownership", async ({ request, db }) => {
        await request.post(route, { data: { ...baseData, userId: "2222222222222222" } });
        const data = await db[fixtureName].select();
        const user = await db.user.selectByEmail("user@test.com");
        expect(data[0]!.userId).toBe(user!.id);
    });
}

/**
 * @deprecated
 */
export function testGetCollectionSubResourceFiltering(
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

/**
 * @deprecated
 */
export function testGetCollectionOfSoftDeletedParentResource(fixtureProvider: (db: DBFixtures) => Promise<string>) {
    test("does not return sub-resources of soft-deleted resources", async ({ request, db }) => {
        const route = await fixtureProvider(db);
        const response = await request.get(route);
        expect(response.status()).toBe(200);
        expect(await response.json()).toStrictEqual([]);
    });
}
