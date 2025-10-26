<script setup lang="ts">
import { APP_NAV } from "~/constants/nav";
</script>

<template>
    <div class="relative flex min-h-main-height w-full flex-col items-center justify-center gap-4 px-8 pt-10">
        <div v-if="$pwa?.showInstallPrompt" class="fixed top-6 right-6" @click="$pwa.install">
            <UButton variant="subtle">
                <UIcon name="heroicons:arrow-down-tray" class="size-6" />
                {{ $t("ui.install") }}
            </UButton>
        </div>
        <SvgGrizzlLogo class="max-w-[600px] fill-front" />
        <div>
            <UCard v-for="test in APP_NAV" :key="test[0]">{{ $t(`ui.${test[0]}`) }}</UCard>
        </div>
    </div>
</template>
