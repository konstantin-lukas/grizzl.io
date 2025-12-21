import { mountSuspended } from "@nuxt/test-utils/runtime";
import { defineComponent } from "vue";

export async function withSetup<T>(c: () => T) {
    let composable: T | null = null;
    const Comp = defineComponent({
        setup() {
            composable = c();
            return () => {};
        },
    });
    const wrapper = await mountSuspended(Comp, { scoped: true });
    return { composable, wrapper };
}
