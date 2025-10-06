<script setup lang="ts">
import { authClient } from "@@/lib/auth-client";

definePageMeta({
    title: "save",
});
async function signIn() {
    await authClient.signIn.social({
        provider: "keycloak",
    });
}
</script>

<template>
    <UCard>
        <div class="mt-20 flex flex-col items-center gap-4">
            <h1 class="text-2xl font-bold">Login</h1>
            <div class="flex flex-col gap-2">
                <button data-test-id="keycloak-provider" @click="signIn">Login with Keycloak</button>
            </div>
        </div>
    </UCard>
</template>
