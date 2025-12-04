import Footer from "@@/app/components/nav/Footer.vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { expect, test } from "vitest";

test("should have links to the legal pages", async () => {
    const wrapper = await mountSuspended(Footer);
    const legalNoticeLink = wrapper.findByTestId("legal-notice-link");
    expect(legalNoticeLink.text()).toBe("footer.legalNotice");
    expect(legalNoticeLink.attributes("href")).toBe("/legal-notice");
    const privacyPolicyLink = wrapper.findByTestId("privacy-policy-link");
    expect(privacyPolicyLink.text()).toBe("footer.privacyPolicy");
    expect(privacyPolicyLink.attributes("href")).toBe("/privacy-policy");
});
