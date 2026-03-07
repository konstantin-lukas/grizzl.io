<script setup lang="ts">
import Button from "~/core/components/button/Button.vue";

const key = "hide-cookie-banner";
const hideCookieBanner = ref<string | null | undefined>("true");

onMounted(() => {
    hideCookieBanner.value = localStorage.getItem(key);
});

watch(hideCookieBanner, newValue => {
    if (newValue === null || newValue === undefined) {
        localStorage.removeItem(key);
        hideCookieBanner.value = undefined;
    } else {
        localStorage.setItem(key, newValue);
    }
});
</script>

<template>
    <Transition name="fade-pure">
        <div
            v-if="!hideCookieBanner"
            class="fixed top-0 left-0 flex min-h-18 w-full flex-col items-center justify-between gap-4 bg-primary px-6 py-4 text-back not-xs:pt-16 xs:px-18 sm:flex-row"
        >
            <div>
                <i18n-t keypath="privacy.cookieBanner">
                    <template #privacyPolicy>
                        <NuxtLink class="underline" to="/privacy-policy" data-test-id="privacy-policy-link">
                            {{ $t("privacy.title") }}
                        </NuxtLink>
                    </template>
                </i18n-t>
            </div>
            <Button
                color="neutral"
                class="flex shrink-0 justify-center not-sm:w-full"
                @click="hideCookieBanner = 'true'"
            >
                {{ $t("ui.okay") }}
            </Button>
        </div>
    </Transition>
</template>
