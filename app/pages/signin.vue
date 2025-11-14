<script setup lang="ts">
import type { ButtonProps } from "#ui/components/Button.vue";
import { authClient } from "@@/lib/auth-client";

definePageMeta({
    title: "ui.signIn",
});

async function signIn(provider: string) {
    const providerLowerCase = provider.toLowerCase();
    await authClient.signIn.social({
        provider: providerLowerCase,
    });
}

const config = useRuntimeConfig();
const providerMetaInformation =
    config.public.appEnv === "production"
        ? ([
              ["Discord", "ri:discord-line"],
              ["GitHub", "ri:github-line"],
              ["Reddit", "ri:reddit-line"],
              ["Twitch", "ri:twitch-line"],
          ] as const)
        : ([["Keycloak", "simple-icons:keycloak"]] as const);

const providers = providerMetaInformation.map<ButtonProps>(([label, icon]) => ({
    label,
    icon,
    "color": "primary",
    "variant": "solid",
    "aria-label": `Sign in with ${label}`,
    "data-test-id": `${label.toLowerCase()}-provider`,
    "onClick": () => signIn(label.toLowerCase()),
}));
</script>

<template>
    <div class="flex min-h-main-height items-center justify-center py-main-padding">
        <UPageCard>
            <UAuthForm :title="$t('ui.signIn')" :description="$t('ui.pickProvider')" icon="heroicons:user" :providers />
        </UPageCard>
    </div>
</template>
