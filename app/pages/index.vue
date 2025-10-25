<script setup lang="ts">
import { authClient } from "@@/lib/auth-client";
import { clsx } from "clsx/lite";

const { $pwa } = useNuxtApp();

const className = computed(() => clsx("grid", "grid-cols-1", "gap-4", $pwa?.showInstallPrompt && "sm:grid-cols-2"));

const session = authClient.useSession();
</script>

<template>
    <LayoutBlurryCircles>
        <div class="relative flex min-h-main-height w-full flex-col items-center justify-center gap-4 px-8 pt-10">
            <SvgGrizzlLogo class="max-w-[600px] fill-front" />
            <div :class="className">
                <NavBlockLink v-if="session.data" as="button" @click="authClient.signOut()">
                    <UIcon name="heroicons:arrow-right-end-on-rectangle" class="size-6" />
                    {{ $t("menu.signOut") }}
                </NavBlockLink>
                <NavBlockLink v-else to="/signin">
                    <UIcon name="heroicons:arrow-right-end-on-rectangle" class="size-6" />
                    {{ $t("menu.signIn") }}
                </NavBlockLink>
                <NavBlockLink v-if="$pwa?.showInstallPrompt" as="button" @click="$pwa.install">
                    <UIcon name="heroicons:arrow-down-tray" class="size-6" />
                    {{ $t("ui.install") }}
                </NavBlockLink>
            </div>
        </div>
    </LayoutBlurryCircles>
</template>
