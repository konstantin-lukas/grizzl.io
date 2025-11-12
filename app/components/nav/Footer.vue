<template>
    <div class="relative" data-test-id="inert-elements">
        <footer class="absolute -top-footer-height h-footer-height">
            <nav class="mx-4 flex h-full items-center justify-start gap-4 sm:gap-8">
                <NuxtLink class="inline-link" to="/legal-notice">{{ $t("footer.legalNotice") }}</NuxtLink>
                <NuxtLink class="inline-link" to="/privacy-policy">{{ $t("footer.privacyPolicy") }}</NuxtLink>
            </nav>
        </footer>
    </div>
</template>
