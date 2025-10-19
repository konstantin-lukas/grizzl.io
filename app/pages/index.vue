<script setup lang="ts">
import { APP_NAV } from "@/constants/nav";
import { authClient } from "@@/lib/auth-client";
import { clsx } from "clsx/lite";

const { $pwa } = useNuxtApp();

const className = computed(() => clsx("grid", "grid-cols-1", "gap-4", $pwa?.showInstallPrompt && "sm:grid-cols-2"));

const { t } = useI18n();
const session = authClient.useSession();
</script>

<template>
    <LayoutBlurryCircles>
        <div class="fixed top-0 z-10 flex w-full justify-center bg-back px-16 py-2">
            <UMarquee pause-on-hover>
                <NuxtLink
                    v-for="link in APP_NAV"
                    :key="link[0]"
                    class="inline-link group/link flex justify-center gap-2 bg-red-500"
                    :to="`/${link[0]}`"
                >
                    <UIcon
                        :name="link[1]"
                        class="size-6 transition-colors group-hover/link:text-violet-600 dark:group-hover/link:text-violet-400"
                    />
                    {{ t(`menu.${link[0]}`) }}
                </NuxtLink>
            </UMarquee>
        </div>
        <div class="relative flex min-h-main-height w-full flex-col items-center justify-center gap-4 px-8 pt-10">
            <SvgGrizzlLogo class="max-w-[600px] fill-front" />
            <div :class="className">
                <NavBlockLink v-if="session.data" as="button" @click="authClient.signOut()">
                    <UIcon name="heroicons:arrow-right-end-on-rectangle" class="size-6" />
                    {{ t("menu.signOut") }}
                </NavBlockLink>
                <NavBlockLink v-else to="/signin">
                    <UIcon name="heroicons:arrow-right-end-on-rectangle" class="size-6" />
                    {{ t("menu.signIn") }}
                </NavBlockLink>
                <NavBlockLink v-if="$pwa?.showInstallPrompt" as="button" @click="$pwa.install">
                    <UIcon name="heroicons:arrow-down-tray" class="size-6" />
                    {{ t("ui.install") }}
                </NavBlockLink>
            </div>
        </div>
    </LayoutBlurryCircles>
</template>
