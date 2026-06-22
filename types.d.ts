// types/i18n.d.ts
import type { Composer } from "vue-i18n";

declare module "#app" {
    interface NuxtApp {
        $t: Composer["t"];
    }
}

declare module "vue" {
    interface ComponentCustomProperties {
        $t: Composer["t"];
    }
}

declare global {
    type NTuple<T, N extends number, Acc extends T[] = []> = Acc["length"] extends N ? Acc : NTuple<T, N, [...Acc, T]>;
    type ArrayElement<T> = T extends (infer U)[] ? U : never;
}

export {};
