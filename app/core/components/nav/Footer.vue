<template>
    <div class="relative" data-test-id="inert-elements">
        <footer class="pointer-events-none absolute -top-footer-height h-footer-height w-full">
            <nav class="flex h-full w-full items-center justify-center gap-4 px-4 xs:justify-start sm:gap-8">
                <NuxtLink class="inline-link pointer-events-auto" to="/legal-notice" data-test-id="legal-notice-link">
                    {{ $t("footer.legalNotice") }}
                </NuxtLink>
                <NuxtLink
                    class="inline-link pointer-events-auto"
                    to="/privacy-policy"
                    data-test-id="privacy-policy-link"
                >
                    {{ $t("footer.privacyPolicy") }}
                </NuxtLink>
            </nav>
        </footer>
    </div>
</template>
