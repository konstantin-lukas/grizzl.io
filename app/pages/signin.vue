<script setup lang="ts">
import { authClient } from "@@/lib/auth-client";

async function signIn() {
    await authClient.signIn.social({
        provider: "keycloak",
    });
}
</script>

<template>
    <div class="mt-20 flex flex-col items-center gap-4">
        <h1 class="text-2xl font-bold">Login</h1>

        <div class="flex flex-col gap-2">
            <button class="rounded bg-green-600 px-4 py-2 text-white" @click="signIn">Login with Keycloak</button>
        </div>
    </div>
</template>
