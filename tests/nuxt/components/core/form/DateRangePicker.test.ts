import { CalendarDate } from "@internationalized/date";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { expect, test } from "vitest";
import { nextTick } from "vue";
import DateRangePicker from "~/core/components/form/DateRangePicker.vue";

const stubs = {
    UInputDate: {
        props: ["modelValue", "range", "separatorIcon"],
        emits: ["update:modelValue"],
        setup() {
            return {
                // DateRangePicker reads inputDate?.inputsRef[0]?.$el
                inputsRef: [{ $el: document.createElement("input") }],
            };
        },
        template: `
            <div data-test-id="u-input-date">
                <slot name="trailing" />
            </div>
        `,
    },
    UPopover: {
        props: ["reference"],
        template: `
            <div>
                <slot />
                <slot name="content" />
            </div>
        `,
    },
    UButton: {
        template: `<button data-test-id="date-range-picker-button" v-bind="$attrs" />`,
    },
    UCalendar: {
        props: ["modelValue", "range"],
        emits: ["update:modelValue"],
        template: `<div data-test-id="u-calendar" />`,
    },
};

test("emits update when both start and end are selected", async () => {
    const wrapper = await mountSuspended(DateRangePicker, {
        scoped: true,
        props: { start: undefined, end: undefined },
        global: { stubs },
    });

    const start = new CalendarDate(2026, 1, 2);
    const end = new CalendarDate(2026, 1, 8);

    wrapper.findComponent(stubs.UInputDate).vm.$emit("update:modelValue", { start, end });
    await nextTick();

    expect(wrapper.emitted("update")).toEqual([[{ start, end }]]);
});

test("does not emit update if range is incomplete", async () => {
    const wrapper = await mountSuspended(DateRangePicker, {
        scoped: true,
        props: { start: undefined, end: undefined },
        global: { stubs },
    });

    const start = new CalendarDate(2026, 1, 2);

    wrapper.findComponent(stubs.UInputDate).vm.$emit("update:modelValue", { start, end: undefined });
    await nextTick();

    expect(wrapper.emitted("update")).toBeUndefined();
});

test("does not emit on mount even when initial range is complete", async () => {
    const wrapper = await mountSuspended(DateRangePicker, {
        scoped: true,
        props: {
            start: new CalendarDate(2026, 2, 1),
            end: new CalendarDate(2026, 2, 7),
        },
        global: { stubs },
    });

    await nextTick();

    expect(wrapper.emitted("update")).toBeUndefined();
});

test("renders the calendar trigger button with translated aria-label", async () => {
    const wrapper = await mountSuspended(DateRangePicker, {
        scoped: true,
        props: { start: undefined, end: undefined },
        global: { stubs },
    });

    const button = wrapper.findByTestId("date-range-picker-button");

    expect(button.exists()).toBe(true);
    expect(button.attributes("aria-label")).toBe("ui.selectDateRange");
});
