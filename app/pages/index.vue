<script setup lang="ts">
import { authClient } from "@@/lib/auth-client";
import { APP_NAV } from "~/constants/nav";

const session = authClient.useSession();
</script>

<template>
    <div
        class="relative flex min-h-main-height w-full flex-col items-center justify-center gap-4 bg-gradient-to-b from-primary/50 to-[100dvh] px-6 xs:px-12 md:px-24 xl:bg-gradient-to-bl xl:to-75% dark:from-primary/25"
    >
        <div class="flex max-w-[1280px] flex-col items-center xl:flex-row xl:gap-24">
            <div class="flex w-full flex-col items-center justify-center gap-6 pt-20 xl:hidden">
                <SvgGrizzlLogo class="max-w-120 fill-front" />
                <div class="mt-4 mb-8 grid w-full grid-cols-1 gap-4 2xs:grid-cols-2 xs:gap-6 sm:gap-8 md:grid-cols-3">
                    <LayoutHeroCard v-for="[label, icon] in APP_NAV" :key="label" :label="label" :icon class="w-auto" />
                </div>
            </div>
            <div class="mb-32 flex flex-col items-start gap-8 xl:mb-0 xl:min-h-0 xl:w-1/2 xl:py-10">
                <div>
                    <SvgGrizzlLogo class="hidden max-w-96 fill-front xl:block" />
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
                <UMarquee orientation="vertical" class="h-dvh items-end pr-8" :overlay="false">
                    <LayoutHeroCard v-for="[label, icon] in APP_NAV" :key="label" :label :icon />
                </UMarquee>
                <UMarquee orientation="vertical" class="h-dvh items-start pl-8" :overlay="false" reverse>
                    <LayoutHeroCard v-for="[label, icon] in APP_NAV" :key="label" :label :icon />
                </UMarquee>
            </div>
        </div>
    </div>
</template>
