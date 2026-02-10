<script setup lang="ts">
import { authClient } from "~/constants/auth-client";
import { APP_NAV } from "~/constants/nav";

const session = authClient.useSession();
const { close } = useMenu();
</script>

<template>
    <div
        class="relative flex min-h-main-height w-full flex-col items-center gap-4 from-primary/50 to-[100dvh] xl:justify-center xl:bg-linear-to-bl xl:to-75% xl:px-24 dark:from-primary/25"
    >
        <div class="flex w-full max-w-7xl flex-col items-center xl:flex-row xl:gap-24">
            <div
                class="flex w-full flex-col items-start gap-6 from-primary/25 not-xl:mb-8 not-xl:bg-linear-to-t not-xl:pt-20 not-xl:pb-8 xl:mb-0 xl:min-h-0 xl:w-1/2 xl:gap-8 xl:py-10 dark:from-primary/15"
            >
                <div class="px-6 xs:px-12 md:px-24 xl:px-0">
                    <SvgGrizzlLogo class="hidden max-w-96 fill-front xl:block" />
                    <TypoH1 class="mb-2 xl:mt-4 xl:mb-4">{{ $t("meta.tagline") }}</TypoH1>
                    <p class="text-neutral-600 dark:text-neutral-400">Different Text</p>
                </div>
                <div class="flex gap-4 px-6 xs:px-12 md:px-24 xl:px-0">
                    <Button
                        v-if="session.data"
                        size="xl"
                        icon="heroicons:arrow-right-end-on-rectangle"
                        data-test-id="home-sign-out-button"
                        @click="
                            authClient
                                .signOut()
                                .then(async () => await navigateTo('/signin'))
                                .then(close)
                        "
                    >
                        {{ $t("ui.signOut") }}
                    </Button>
                    <Button
                        v-else
                        to="/signin"
                        size="xl"
                        icon="heroicons:arrow-right-end-on-rectangle"
                        data-test-id="home-sign-in-button"
                    >
                        {{ $t("ui.signIn") }}
                    </Button>
                    <Transition name="fade">
                        <div v-if="$pwa?.showInstallPrompt" @click="$pwa.install">
                            <Button variant="subtle" size="xl" icon="heroicons:arrow-down-tray">
                                {{ $t("ui.install") }}
                            </Button>
                        </div>
                    </Transition>
                </div>
            </div>
            <div class="mb-16 flex w-full flex-col items-center justify-center gap-6 xl:hidden">
                <div
                    class="mb-8 grid w-full grid-cols-1 gap-4 px-6 xs:grid-cols-2 xs:gap-6 xs:px-12 sm:gap-8 md:grid-cols-3 md:px-24"
                >
                    <LayoutHeroCard
                        v-for="[label, icon, disabled] in APP_NAV"
                        :key="label"
                        :data-test-id="`home-hero-card-${label}`"
                        :label
                        :icon
                        :disabled
                        class="w-full"
                    />
                </div>
            </div>
            <div class="hidden w-1/2 grid-cols-2 xl:grid motion-reduce:xl:hidden" aria-hidden="true">
                <UMarquee orientation="vertical" class="h-dvh items-end pr-8" :overlay="false">
                    <LayoutHeroCard
                        v-for="[label, icon, disabled] in APP_NAV"
                        :key="label"
                        :label
                        :icon
                        :disabled
                        tabindex="-1"
                    />
                </UMarquee>
                <UMarquee orientation="vertical" class="h-dvh items-start pl-8" :overlay="false" reverse>
                    <LayoutHeroCard
                        v-for="[label, icon, disabled] in APP_NAV"
                        :key="label"
                        :data-test-id="`home-hero-card-${label}`"
                        :label
                        :icon
                        :disabled
                        tabindex="-1"
                    />
                </UMarquee>
            </div>
            <div class="hidden w-1/3 grid-cols-2 justify-center gap-6 xl:grid not-motion-reduce:xl:hidden">
                <LayoutHeroCard
                    v-for="[label, icon, disabled] in APP_NAV"
                    :key="label"
                    :data-test-id="`home-hero-card-${label}`"
                    :label
                    :icon
                    :disabled
                    class="w-full"
                />
            </div>
        </div>
    </div>
</template>
