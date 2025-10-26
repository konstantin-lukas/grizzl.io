<script setup lang="ts">
import { authClient } from "@@/lib/auth-client";

const session = authClient.useSession();
</script>

<template>
    <div
        class="relative flex min-h-main-height w-full flex-col items-center justify-center gap-4 bg-gradient-to-bl from-primary/50 to-75% px-24 dark:from-primary/25"
    >
        <div class="flex max-w-[1280px] items-center gap-24">
            <div class="flex w-1/2 flex-col items-start gap-8 py-10">
                <div>
                    <SvgGrizzlLogo class="max-w-96 fill-front" />
                    <TypoH1 class="my-4">{{ $t("meta.tagline") }}</TypoH1>
                    <p class="text-neutral-600 dark:text-neutral-400">
                        {{ $t("meta.description") }}
                    </p>
                </div>
                <div class="flex gap-4">
                    <UButton
                        v-if="session.data"
                        size="xl"
                        icon="heroicons:arrow-right-end-on-rectangle"
                        @click="authClient.signOut()"
                    >
                        {{ $t("ui.signOut") }}
                    </UButton>
                    <UButton v-else to="/signin" size="xl" icon="heroicons:arrow-right-end-on-rectangle">
                        {{ $t("ui.signIn") }}
                    </UButton>
                    <div v-if="$pwa?.showInstallPrompt" @click="$pwa.install">
                        <UButton variant="subtle" size="xl" icon="heroicons:arrow-down-tray">
                            {{ $t("ui.install") }}
                        </UButton>
                    </div>
                </div>
            </div>
            <div class="hidden w-1/2 grid-cols-2 xl:grid">
                <LayoutHeroMarquee class="items-end pr-8" />
                <LayoutHeroMarquee class="items-start pl-8" reverse />
            </div>
        </div>
    </div>
</template>
