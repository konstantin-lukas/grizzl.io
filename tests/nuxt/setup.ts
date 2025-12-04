import type { VueWrapper } from "@vue/test-utils";
import { DOMWrapper, config } from "@vue/test-utils";

declare module "@vue/test-utils" {
    interface VueWrapper {
        findByTestId: (id: string) => VueWrapper;
    }
}

const DataTestIdPlugin = (wrapper: VueWrapper) => {
    function findByTestId(selector: string) {
        const dataSelector = `[data-test-id='${selector}']`;
        const element = wrapper.element.querySelector(dataSelector);
        return new DOMWrapper(element);
    }

    return {
        findByTestId,
    };
};

config.global.mocks = {
    $t: (tKey: string) => tKey,
};

config.plugins.VueWrapper.install(DataTestIdPlugin);
