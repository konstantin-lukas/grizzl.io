<script setup lang="ts">
import Slideover from "~/core/components/overlay/Slideover.vue";
import { useOpenList } from "~/todo/composables/useOpenList";

const { openList } = useOpenList();
</script>

<template>
    <Slideover query-key="list" :query-value="openList?.id" @close="openList = null">AAAAAAA</Slideover>
</template>

<style scoped></style>
