<script setup lang="ts">
import { APP_NAV } from "@/constants/nav";
import { authClient } from "@@/lib/auth-client";

const { t } = useI18n();
const session = authClient.useSession();
</script>

<template>
    <LayoutBlurryCircles>
        <div class="fixed top-0 z-10 flex w-full justify-center bg-back px-16 py-2">
            <UMarquee pause-on-hover>
                <NuxtLink
                    class="inline-link group/link flex justify-center gap-2 bg-red-500"
                    :to="`/${link[0]}`"
                    v-for="link in APP_NAV"
                    :key="link[0]"
                >
                    <UIcon
                        :name="link[1]"
                        class="size-6 transition-colors group-hover/link:text-violet-600 dark:group-hover/link:text-violet-400"
                    />
                    {{ t(`menu.${link[0]}`) }}
                </NuxtLink>
            </UMarquee>
        </div>
        <div class="relative flex min-h-main-height w-full flex-col items-center justify-center gap-4 px-8">
            <SvgGrizzlLogo class="max-w-[600px] fill-front" />
            <div>
                <NavBlockLink as="button" v-if="session.data" @click="authClient.signOut()">
                    <UIcon name="heroicons:arrow-right-end-on-rectangle" class="size-6" />
                    {{ t("menu.signOut") }}
                </NavBlockLink>
                <NavBlockLink to="/signin" v-else>
                    <UIcon name="heroicons:arrow-right-end-on-rectangle" class="size-6" />
                    {{ t("menu.signIn") }}
                </NavBlockLink>
            </div>
        </div>
    </LayoutBlurryCircles>
</template>
