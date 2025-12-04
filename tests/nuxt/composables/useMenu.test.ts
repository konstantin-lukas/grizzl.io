import useMenu from "@@/app/composables/useMenu";
import { expect, test } from "vitest";

test("should allow opening and closing the menu", () => {
    const { isOpen, toggle, open, close } = useMenu();

    expect(isOpen.value).toBe(false);
    toggle();
    expect(isOpen.value).toBe(true);
    toggle();
    expect(isOpen.value).toBe(false);
    open();
    expect(isOpen.value).toBe(true);
    open();
    expect(isOpen.value).toBe(true);
    close();
    expect(isOpen.value).toBe(false);
    close();
    expect(isOpen.value).toBe(false);
});
