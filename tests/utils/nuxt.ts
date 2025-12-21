import { mountSuspended } from "@nuxt/test-utils/runtime";
import { defineComponent } from "vue";

export async function withSetup<T>(c: () => T, mountOptions?: Parameters<typeof mountSuspended>[1]) {
    let composable: T;
    const Comp = defineComponent({
        setup() {
            composable = c();
            return () => {};
        },
    });
    const wrapper = await mountSuspended(Comp, { scoped: true, ...mountOptions });
    return { composable: composable!, wrapper };
}
