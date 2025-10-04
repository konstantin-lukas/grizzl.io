<script setup lang="ts">
import { authClient } from "@@/lib/auth-client";

const { close } = useMenu();
const session = authClient.useSession();
</script>

<template>
    <div class="flex">
        <button
            v-if="session.data"
            class="inline-link-1 group mx-auto mt-4 flex justify-center gap-2"
            data-test-id="session-button"
            @click="authClient.signOut()"
        >
            Sign out
        </button>
        <NuxtLink
            v-else
            class="inline-link-1 group mx-auto mt-4 flex justify-center gap-2"
            to="/signin"
            data-test-id="session-button"
            @click="close"
        >
            Sign in
        </NuxtLink>
    </div>
</template>
