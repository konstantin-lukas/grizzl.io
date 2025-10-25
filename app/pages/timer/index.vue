<script setup lang="ts"></script>

<template>
    <LayoutWrapper class="flex flex-col items-center justify-center">
        <UCard>
            <div class="flex flex-col items-center justify-center">
                <UIcon name="heroicons:inbox" size="100" />
                <span>{{ $t("timer.noTimers") }}</span>
            </div>
        </UCard>
        <UButton size="xl" class="mt-8" trailing-icon="heroicons:plus-small">{{ $t("ui.create") }}</UButton>
    </LayoutWrapper>
</template>
