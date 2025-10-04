<script setup lang="ts">
const { loggedIn, clear, openInPopup } = useUserSession();
const loginWith = (provider: string) => {
    openInPopup(`/api/auth/${provider}`);
};
</script>

<template>
    <div class="mt-20 flex flex-col items-center gap-4">
        <h1 class="text-2xl font-bold">Login</h1>

        <div v-if="loggedIn">
            <button @click="clear">Sign out</button>
        </div>

        <div v-else class="flex flex-col gap-2">
            <button class="rounded bg-green-600 px-4 py-2 text-white" @click="loginWith('keycloak')">
                Login with Keycloak
            </button>
        </div>
    </div>
</template>
