import { expect, test, vi } from "vitest";
import useHash from "~/composables/useHash";

test("produces the correct SHA-1 hash for a known string", async () => {
    const message = ref("hello world");
    const result = useHash(message);
    await vi.waitFor(() => {
        expect(result.value).toBe("2aae6c35c94fcfb415dbe95f408b9ce91ee846ed");
    });
});
