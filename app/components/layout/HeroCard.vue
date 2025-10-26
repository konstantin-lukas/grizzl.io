<script setup lang="ts">
const { label, icon } = defineProps<{
    icon: string;
    label: string;
}>();
</script>

<template>
    <NuxtLink :to="label">
        <UCard
            class="center aspect-square w-48 transition-all hover:scale-110 hover:bg-primary hover:text-back"
            :class="$attrs.class"
        >
            <div class="center gap-2">
                <UIcon :name="icon" class="size-8 2xs:size-6 xs:size-8" />
                <span class="xs:text-md text-md 2xs:text-sm">{{ $t(`ui.${label}`) }}</span>
            </div>
        </UCard>
    </NuxtLink>
</template>
