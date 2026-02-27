<script setup lang="ts">
import type { NuxtError } from "#app";
import Button from "~/core/components/button/Button.vue";
import Wrapper from "~/core/components/layout/Wrapper.vue";
import H1 from "~/core/components/typo/H1.vue";

defineProps({
    // eslint-disable-next-line vue/require-default-prop
    error: Object as () => NuxtError,
});

const handleError = () => clearError({ redirect: "/" });
</script>

<template>
    <NuxtLayout>
        <Wrapper class="flex h-dvh w-dvw flex-col items-center justify-center">
            <NuxtImg
                src="/images/undraw_server-down.svg"
                class="w-full max-w-108 select-none"
                alt=""
                draggable="false"
            />
            <H1 class="mt-8">{{ $t("ui.error") }} {{ error?.statusCode }}</H1>
            <span class="mt-2 mb-4">Error {{ error?.message }}</span>
            <Button @click="handleError">{{ $t("ui.homepage") }}</Button>
        </Wrapper>
    </NuxtLayout>
</template>
