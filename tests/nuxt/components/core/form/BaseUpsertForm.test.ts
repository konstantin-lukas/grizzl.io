import { mountSuspended } from "@nuxt/test-utils/runtime";
import { expect, test } from "vitest";
import BaseUpsertForm from "~/core/components/form/BaseUpsertForm.vue";

test("should display different text in the submit button depending on the mode", async () => {
    const wrapper = await mountSuspended(BaseUpsertForm, {
        scoped: true,
        props: { mode: "insert" },
    });
    const submit = wrapper.findByTestId("upsert-form-submit-button");
    expect(submit.text()).toBe("ui.create");

    await wrapper.setProps({ mode: "update" });
    expect(submit.text()).toBe("ui.save");
});
