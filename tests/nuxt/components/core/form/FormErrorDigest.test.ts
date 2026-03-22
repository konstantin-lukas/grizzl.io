import { mountSuspended } from "@nuxt/test-utils/runtime";
import { expect, test } from "vitest";
import FormErrorDigest from "~/core/components/form/FormErrorDigest.vue";

test("displays the given errors and disappears when there are none", async () => {
    const wrapper = await mountSuspended(FormErrorDigest, {
        scoped: true,
        props: { errors: ["bananas"] },
    });
    const digest = wrapper.findByTestId("form-error-digest");
    expect(digest.text()).toBe("ui.formErrorsbananas");

    await wrapper.setProps({ errors: [] });
    expect(wrapper.findByTestId("form-error-digest").exists()).toBe(false);
});
