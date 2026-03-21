<script setup lang="ts">
import Empty from "~/core/components/data/Empty.vue";
import Wrapper from "~/core/components/layout/Wrapper.vue";
import AccountH1 from "~/finance/components/AccountH1.vue";
import useAccounts from "~/finance/composables/useAccounts";

const { accounts, openAccountId } = useAccounts();
const showEmptyView = computed(() => accounts.value?.length === 0 && !openAccountId.value);
</script>

<template>
    <Wrapper>
        <div class="flex min-h-main-height-no-padding w-full flex-col">
            <div class="mb-16 flex w-full grow flex-col">
                <Transition name="fade">
                    <AccountH1 v-if="!showEmptyView" />
                </Transition>
                <Transition name="fade">
                    <div v-if="showEmptyView" class="center w-full grow">
                        <Empty />
                    </div>
                </Transition>
            </div>
        </div>
    </Wrapper>
</template>
