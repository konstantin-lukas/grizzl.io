<script setup lang="ts">
definePageMeta({
    title: "ui.save",
});
const config = useRuntimeConfig();
const providers =
    config.public.appEnv === "production"
        ? ([
              ["Discord", "ri:discord-line"],
              ["GitHub", "ri:github-line"],
              ["Reddit", "ri:reddit-line"],
              ["Twitch", "ri:twitch-line"],
          ] as const)
        : ([["Keycloak", "simple-icons:keycloak"]] as const);
</script>

<template>
    <LayoutBlurryCircles>
        <div class="flex min-h-main-height items-center justify-center py-main-padding">
            <UCard>
                <div class="flex flex-col items-center justify-center gap-4 p-2">
                    <TypoH1>Sign In</TypoH1>
                    <NavProviderButton v-for="[provider, icon] in providers" :key="provider" :provider :icon />
                </div>
            </UCard>
        </div>
    </LayoutBlurryCircles>
</template>
