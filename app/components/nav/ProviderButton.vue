<script setup lang="ts">
import { authClient } from "@@/lib/auth-client";

const { provider, icon, color } = defineProps<{ provider: string; icon: string; color: string }>();
async function signIn() {
    await authClient.signIn.social({
        provider: provider.toLowerCase(),
    });
}
</script>

<template>
    <NavBlockLink :color as="button" :aria-label="`Sign in with ${provider}`" @click="signIn">
        <Icon :name="icon" size="1.25rem" />
        {{ provider }}
    </NavBlockLink>
</template>

<style scoped></style>
