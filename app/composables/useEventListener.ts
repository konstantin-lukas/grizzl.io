import { onBeforeUnmount, onMounted, unref, watch } from "vue";

export function useEventListener(
    target: EventTarget,
    event: string,
    listener: (evt: Event) => void,
    options?: boolean | AddEventListenerOptions,
) {
    const cleanupFns: (() => void)[] = [];

    const add = (el: EventTarget | null) => {
        if (!el) return;
        el.addEventListener(event, listener, options);
        cleanupFns.push(() => el.removeEventListener(event, listener, options));
    };

    const cleanup = () => {
        cleanupFns.forEach(fn => fn());
        cleanupFns.length = 0;
    };

    onMounted(() => {
        const el = unref(target);
        add(el);
    });

    onBeforeUnmount(() => {
        cleanup();
    });

    watch(
        () => unref(target),
        (newEl, oldEl) => {
            if (newEl === oldEl) return;
            cleanup();
            add(newEl);
        },
    );
}
