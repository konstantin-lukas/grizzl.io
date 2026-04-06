<script setup lang="ts">
import Button from "~/core/components/button/Button.vue";
import { ICON_FILTER } from "~/core/constants/icons.constant";
</script>

<template>
    <UDropdownMenu>
        <Button
            :icon="ICON_FILTER"
            square
            variant="ghost"
            color="neutral"
            :aria-label="$t('ui.filters')"
            class="hover:bg-accented focus-visible:bg-accented"
        />
        <template #item-label="{ item }"> {{ $t(`ui.${item.label}`) }}</template>
    </UDropdownMenu>
</template>

<style scoped></style>
