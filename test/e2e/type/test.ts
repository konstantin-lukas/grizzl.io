import type { Page } from "@playwright/test";

export type ExtendedGotoOptions = Omit<NonNullable<Parameters<Page["goto"]>[1]>, "waitUntil"> & {
    waitUntil?: NonNullable<Parameters<Page["goto"]>[1]>["waitUntil"] | "hydration";
};
