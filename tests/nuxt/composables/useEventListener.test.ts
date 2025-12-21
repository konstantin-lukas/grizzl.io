import { useEventListener } from "@@/app/composables/useEventListener";
import { withSetup } from "@@/tests/utils/nuxt";
import { expect, test, vi } from "vitest";
import { ref } from "vue";

test("adds the event listener on mount and removes it on unmount", async () => {
    const target = new EventTarget();
    const addSpy = vi.spyOn(target, "addEventListener");
    const removeSpy = vi.spyOn(target, "removeEventListener");

    const listener = vi.fn();
    const { wrapper } = await withSetup(() => useEventListener(target, "bloobs", listener));

    expect(addSpy).toHaveBeenCalledOnce();
    expect(removeSpy).not.toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalledWith("bloobs", listener, undefined);

    wrapper.unmount();

    expect(addSpy).toHaveBeenCalledOnce();
    expect(removeSpy).toHaveBeenCalledOnce();
    expect(removeSpy).toHaveBeenCalledWith("bloobs", listener, undefined);
});

test("invokes the provided listener when the event fires", async () => {
    const target = new EventTarget();
    const listener = vi.fn();

    await withSetup(() => useEventListener(target, "strawbs", listener));

    expect(listener).not.toHaveBeenCalled();
    target.dispatchEvent(new Event("strawbs"));
    expect(listener).toHaveBeenCalledOnce();
    const calledEvent = listener.mock.calls[0]?.[0];
    expect(calledEvent.type).toEqual("strawbs");
    expect(calledEvent.target).toEqual(target);
});

test("does nothing if the target is null on mount, then attaches when it becomes available", async () => {
    const targetRef = ref<EventTarget | null>(null);
    const listener = vi.fn();

    const addSpyLater = vi.fn();
    const removeSpyLater = vi.fn();

    const { wrapper } = await withSetup(() => useEventListener(targetRef, "bananas", listener));

    expect(listener).not.toHaveBeenCalled();

    const target = new EventTarget();
    vi.spyOn(target, "addEventListener").mockImplementation(addSpyLater);
    vi.spyOn(target, "removeEventListener").mockImplementation(removeSpyLater);
    expect(addSpyLater).not.toHaveBeenCalled();
    expect(removeSpyLater).not.toHaveBeenCalled();

    targetRef.value = target;
    await wrapper.vm.$nextTick();

    expect(addSpyLater).toHaveBeenCalledOnce();
    expect(removeSpyLater).not.toHaveBeenCalled();
    expect(addSpyLater).toHaveBeenCalledWith("bananas", listener, undefined);

    wrapper.unmount();
    expect(addSpyLater).toHaveBeenCalledOnce();
    expect(removeSpyLater).toHaveBeenCalledOnce();
    expect(removeSpyLater).toHaveBeenCalledWith("bananas", listener, undefined);
});

test("re-attaches the listener when the target changes (cleans up old target first)", async () => {
    const t1 = new EventTarget();
    const t2 = new EventTarget();

    const add1 = vi.spyOn(t1, "addEventListener");
    const remove1 = vi.spyOn(t1, "removeEventListener");
    const add2 = vi.spyOn(t2, "addEventListener");
    const remove2 = vi.spyOn(t2, "removeEventListener");

    const targetRef = ref<EventTarget>(t1);
    const listener = vi.fn();
    const options = { capture: true } as AddEventListenerOptions;

    const { wrapper } = await withSetup(() => useEventListener(targetRef, "kiwis", listener, options));

    expect(add1).toHaveBeenCalledOnce();
    expect(add2).not.toHaveBeenCalled();
    expect(add1).toHaveBeenCalledWith("kiwis", listener, options);
    expect(remove1).not.toHaveBeenCalled();
    expect(remove2).not.toHaveBeenCalled();

    targetRef.value = t2;
    await wrapper.vm.$nextTick();

    expect(remove1).toHaveBeenCalledOnce();
    expect(remove1).toHaveBeenCalledWith("kiwis", listener, options);
    expect(add2).toHaveBeenCalledOnce();
    expect(add2).toHaveBeenCalledWith("kiwis", listener, options);
    expect(remove2).not.toHaveBeenCalled();

    wrapper.unmount();
    expect(remove2).toHaveBeenCalledOnce();
    expect(remove2).toHaveBeenCalledWith("kiwis", listener, options);
});
