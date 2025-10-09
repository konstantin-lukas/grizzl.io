<script setup lang="ts">
const { t } = useI18n();
const config = useRuntimeConfig();
</script>

<template>
    <footer class="h-footer-height" data-test-id="inert-elements">
        <nav class="flex h-full items-center justify-center gap-8">
            <NuxtLink class="inline-link-1" to="/legal-notice">{{ t("footer.legalNotice") }}</NuxtLink>
            <NuxtLink class="inline-link-2" to="/privacy-policy">{{ t("footer.privacyPolicy") }}</NuxtLink>
            <NuxtLink class="inline-link-3" to="https://github.com/konstantin-lukas/grizzl.io">
                {{ t("footer.version") }}
                {{ config.public.version }}
            </NuxtLink>
        </nav>
    </footer>
</template>
