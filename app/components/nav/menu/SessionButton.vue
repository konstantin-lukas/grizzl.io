<script setup lang="ts">
import { authClient } from "~~/lib/auth-client";

const session = authClient.useSession();
const { close } = useMenu();
</script>

<template>
    <div class="flex">
        <button
            v-if="session.data"
            class="inline-link group mx-auto mt-4 flex justify-center gap-2"
            data-test-id="session-button"
            @click="
                authClient
                    .signOut()
                    .then(async () => await navigateTo('/signin'))
                    .then(close)
            "
        >
            <UIcon
                name="heroicons:arrow-right-start-on-rectangle"
                class="size-6 transition-colors group-hover:text-primary"
            />
            {{ $t("ui.signOut") }}
        </button>
        <NuxtLink
            v-else
            class="inline-link group mx-auto mt-4 flex justify-center gap-2"
            to="/signin"
            data-test-id="session-button"
            @click="close"
        >
            <UIcon
                name="heroicons:arrow-right-end-on-rectangle"
                class="size-6 transition-colors group-hover:text-primary"
            />
            {{ $t("ui.signIn") }}
        </NuxtLink>
    </div>
</template>
