<script setup lang="ts">
import type { ButtonProps } from "#ui/components/Button.vue";
import { authClient } from "~/core/constants/auth-client.constant";
import { ICON_DISCORD, ICON_GITHUB, ICON_REDDIT, ICON_TWITCH, ICON_USER } from "~/core/constants/icons.constant";

const { query } = useRoute();
const callbackURL =
    typeof query.callbackURL === "string" && query.callbackURL.length > 1 ? query.callbackURL : undefined;

async function signIn(provider: string) {
    const providerLowerCase = provider.toLowerCase();
    await authClient.signIn.social({
        provider: providerLowerCase,
        callbackURL,
    });
}

const config = useRuntimeConfig();
const providerMetaInformation =
    config.public.appEnv === "production"
        ? ([
              ["Discord", ICON_DISCORD],
              ["GitHub", ICON_GITHUB],
              ["Reddit", ICON_REDDIT],
              ["Twitch", ICON_TWITCH],
          ] as const)
        : ([["Keycloak", ICON_GITHUB]] as const);

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
    <div class="flex min-h-main-height items-center justify-center px-8 py-main-padding">
        <UPageCard>
            <UAuthForm :description="$t('ui.pickProvider')" :icon="ICON_USER" :providers>
                <template #title>
                    <span role="heading" aria-level="1">{{ $t("ui.signIn") }}</span>
                </template>
            </UAuthForm>
        </UPageCard>
    </div>
</template>
