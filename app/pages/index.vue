<script setup lang="ts">
import { APP_NAV } from "@/constants/nav";

const { t } = useI18n();
</script>

<template>
    <LayoutBlurryCircles>
        <div class="relative flex min-h-main-height w-full flex-col items-center justify-center">
            <SvgGrizzlLogo class="max-w-[600px] fill-front" />
            <TypoH1>{{ t("meta.tagline") }}</TypoH1>
            <div class="fixed top-0 z-10 flex w-full justify-center bg-back px-16 py-2">
                <UMarquee pause-on-hover>
                    <NuxtLink
                        class="inline-link group/link flex justify-center gap-2 bg-red-500"
                        to="/"
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
        </div>
    </LayoutBlurryCircles>
</template>
