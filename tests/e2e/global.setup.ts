import type { FullConfig } from "@playwright/test";
import { firefox, selectors } from "@playwright/test";

export default async function GlobalSetup(config: FullConfig) {
    const { storageState, testIdAttribute } = config.projects[0].use;
    selectors.setTestIdAttribute(testIdAttribute!);

    const browser = await firefox.launch();
    const page = await browser.newPage();

    const context = page.context();
    await context.storageState({ path: storageState as string });

    await browser.close();
}
