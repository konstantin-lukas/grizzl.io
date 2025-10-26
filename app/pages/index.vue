<script setup lang="ts">
import { authClient } from "@@/lib/auth-client";

const session = authClient.useSession();
</script>

<template>
    <div class="relative flex min-h-main-height w-full flex-col items-center justify-center gap-4 px-24">
        <div class="flex max-w-[1280px] items-center gap-24">
            <div class="flex w-1/2 flex-col items-start gap-8 py-10">
                <div>
                    <SvgGrizzlLogo class="max-w-96 fill-front" />
                    <TypoH1 class="my-4">{{ $t("meta.tagline") }}</TypoH1>
                    <p class="text-neutral-600 dark:text-neutral-400">
                        {{ $t("meta.description") }}
                    </p>
                </div>
                <div class="flex gap-8">
                    <NavBlockLink v-if="session.data" as="button" @click="authClient.signOut()">
                        <UIcon name="heroicons:arrow-right-end-on-rectangle" class="size-6" />
                        {{ $t("ui.signOut") }}
                    </NavBlockLink>
                    <NavBlockLink v-else to="/signin">
                        <UIcon name="heroicons:arrow-right-end-on-rectangle" class="size-6" />
                        {{ $t("ui.signIn") }}
                    </NavBlockLink>
                    <div v-if="$pwa?.showInstallPrompt" @click="$pwa.install">
                        <NavBlockLink as="button" variant="subtle">
                            <UIcon name="heroicons:arrow-down-tray" class="size-6" />
                            {{ $t("ui.install") }}
                        </NavBlockLink>
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
