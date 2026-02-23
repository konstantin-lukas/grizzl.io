<script setup lang="ts">
import Wrapper from "~/core/components/layout/Wrapper.vue";
import H1 from "~/core/components/typo/H1.vue";
import H2 from "~/core/components/typo/H2.vue";

const runtimeConfig = useRuntimeConfig();
</script>

<template>
    <Wrapper>
        <H1>
            {{ $t("legal.notice") }}
        </H1>
        <p class="mb-4">
            {{ runtimeConfig.public.legalEntity }}
            <br />
            {{ runtimeConfig.public.legalStreet }}
            <br />
            {{ runtimeConfig.public.legalCity }}
        </p>
        <H2>{{ $t("legal.contact") }}</H2>
        <p class="mb-4">
            {{ $t("legal.phone") }}: {{ runtimeConfig.public.legalPhone }}
            <br />
            {{ $t("legal.email") }}:
            <NuxtLink :href="`mailto:${runtimeConfig.public.legalEmail}`" class="inline-link inline-link-resting">
                {{ runtimeConfig.public.legalEmail }}
            </NuxtLink>
            <br />
        </p>
    </Wrapper>
</template>
