<script setup lang="ts">
import { authClient } from "~~/lib/auth-client";

const { t } = useI18n();
const session = authClient.useSession();
</script>

<template>
    <div class="flex">
        <button
            v-if="session.data"
            class="inline-link group mx-auto mt-4 flex justify-center gap-2"
            data-test-id="session-button"
            @click="authClient.signOut()"
        >
            <UIcon
                name="heroicons:arrow-right-start-on-rectangle"
                class="size-6 transition-colors group-hover:text-violet-600 dark:group-hover:text-violet-400"
            />
            {{ t("menu.signOut") }}
        </button>
        <NuxtLink
            v-else
            class="inline-link group mx-auto mt-4 flex justify-center gap-2"
            to="/signin"
            data-test-id="session-button"
        >
            <UIcon
                name="heroicons:arrow-right-end-on-rectangle"
                class="size-6 transition-colors group-hover:text-violet-600 dark:group-hover:text-violet-400"
            />
            {{ t("menu.signIn") }}
        </NuxtLink>
    </div>
</template>
