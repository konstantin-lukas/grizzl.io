<script setup lang="ts">
import Empty from "~/core/components/data/Empty.vue";
import Wrapper from "~/core/components/layout/Wrapper.vue";
import AccountSelectMenu from "~/finance/components/AccountControlMenu.vue";
import AccountH1 from "~/finance/components/AccountH1.vue";
import AccountTabs from "~/finance/components/AccountTabs.vue";
import UpsertForm from "~/finance/components/UpsertForm.vue";
import useAccounts from "~/finance/composables/useAccounts";

const { accounts, openAccountId } = useAccounts();
const showEmptyView = computed(() => accounts.value?.length === 0 && !openAccountId.value);
const upsertFormOpen = ref(false);
</script>

<template>
    <Wrapper>
        <AccountSelectMenu class="fixed top-4 right-4" />
        <div class="flex min-h-main-height-no-padding w-full flex-col">
            <div class="relative mb-16 flex h-full w-full grow flex-col">
                <AccountH1 />
                <AccountTabs v-if="openAccountId" class="mt-8" />
                <Transition name="fade">
                    <div v-if="showEmptyView" class="center absolute h-full w-full grow">
                        <Empty @open="upsertFormOpen = true" />
                    </div>
                </Transition>
            </div>
            <UpsertForm v-model:open="upsertFormOpen" @success="upsertFormOpen = false" />
        </div>
    </Wrapper>
</template>
