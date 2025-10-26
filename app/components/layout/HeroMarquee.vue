<script setup lang="ts">
import { APP_NAV } from "~/constants/nav";
</script>

<template>
    <UMarquee orientation="vertical" class="h-dvh" :overlay="false">
        <NuxtLink v-for="[label, icon] in APP_NAV" :key="label" :to="label">
            <UCard class="center aspect-square w-48 transition-all hover:scale-110 hover:bg-primary hover:text-back">
                <div class="center gap-2">
                    <UIcon :name="icon" size="32" />
                    <span>{{ $t(`ui.${label}`) }}</span>
                </div>
            </UCard>
        </NuxtLink>
    </UMarquee>
</template>
