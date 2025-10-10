<script setup lang="ts">
import { authClient } from "@@/lib/auth-client";

const { provider, icon } = defineProps<{ provider: string; icon: string }>();
const providerLowerCase = provider.toLowerCase();
async function signIn() {
    await authClient.signIn.social({
        provider: providerLowerCase,
    });
}
</script>

<template>
    <NavBlockLink
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
