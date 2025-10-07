<script setup lang="ts">
definePageMeta({
    title: "ui.save",
});
const config = useRuntimeConfig();
const providers =
    config.public.appEnv === "production"
        ? ([
              ["Discord", "ri:discord-line", "bg-emerald-700"],
              ["GitHub", "ri:github-line", "bg-cyan-700"],
              ["Reddit", "ri:reddit-line", "bg-purple-700"],
              ["Twitch", "ri:twitch-line", "bg-rose-700"],
              ["Spotify", "ri:spotify-line", "bg-amber-700"],
          ] as const)
        : ([["Keycloak", "simple-icons:keycloak", "bg-emerald-700"]] as const);
</script>

<template>
    <div class="flex min-h-main-height-no-padding items-center justify-center">
        <UCard>
            <div class="flex flex-col items-center justify-center gap-4 p-4">
                <TypoH1 class="text-2xl font-bold">Sign In</TypoH1>
                <NavProviderButton
                    v-for="[provider, icon, color] in providers"
                    :key="provider"
                    :provider
                    :icon
                    :color
                />
            </div>
        </UCard>
    </div>
</template>
