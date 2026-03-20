<script setup lang="ts">
import Empty from "~/core/components/data/Empty.vue";
import Wrapper from "~/core/components/layout/Wrapper.vue";
</script>

<template>
    <Wrapper :class="{ 'max-w-xl': true }">
        <div class="flex min-h-main-height-no-padding w-full flex-col">
            <div class="mb-16 flex w-full grow flex-col">
                <Transition name="fade">
                    <div v-if="true" class="center w-full grow">
                        <Empty />
                    </div>
                </Transition>
            </div>
        </div>
    </Wrapper>
</template>
