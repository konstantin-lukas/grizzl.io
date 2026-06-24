<script setup lang="ts">
const polls = await useFetch("/api/polls");
const poll = await useFetch(`/api/polls/${polls.data.value?.[0]?.id}`);
</script>

<template>
    <div>
        <span>Poll:</span>
        <p>
            {{ poll }}
        </p>
    </div>
</template>
