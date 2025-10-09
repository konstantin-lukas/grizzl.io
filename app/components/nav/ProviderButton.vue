<script setup lang="ts">
import { authClient } from "@@/lib/auth-client";

const { provider, icon, color } = defineProps<{ provider: string; icon: string; color: string }>();
const providerLowerCase = provider.toLowerCase();
async function signIn() {
    await authClient.signIn.social({
        provider: providerLowerCase,
    });
}
</script>

<template>
    <NavBlockLink
        :color
        as="button"
        :aria-label="`Sign in with ${provider}`"
        :data-test-id="`${providerLowerCase}-provider`"
        @click="signIn"
    >
        <Icon :name="icon" size="1.25rem" />
        {{ provider }}
    </NavBlockLink>
</template>

<style scoped></style>
