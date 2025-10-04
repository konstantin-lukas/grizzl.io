<script setup lang="ts">
const { close } = useMenu();
</script>

<template>
    <div class="flex">
        <AuthState v-slot="{ loggedIn, clear }">
            <button v-if="loggedIn" class="inline-link-1 group mx-auto mt-4 flex justify-center gap-2" @click="clear">
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
        </AuthState>
    </div>
</template>
