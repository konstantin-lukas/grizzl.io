<script setup lang="ts">
import { LOCALES } from "#shared/core/constants/i18n.constant";
import { deepCopy } from "#shared/core/utils/object.util";
import { ellipsize } from "#shared/core/utils/string.util";
import { TITLE_MAX } from "#shared/core/validators/core.validator";
import { type Account, type PostAccount, PostAccountSchema } from "#shared/finance/validators/account.validator";
import { useToast } from "#ui/composables";
import BaseUpsertForm from "~/core/components/form/BaseUpsertForm.vue";
import Drawer from "~/core/components/overlay/Drawer.vue";
import H1 from "~/core/components/typo/H1.vue";
import { createToastError, createToastSuccess } from "~/core/utils/toast";
import useAccounts from "~/finance/composables/useAccounts";
import { getCurrencies } from "~/finance/utils/currency";

const { initialState = null } = defineProps<{ initialState?: Account }>();
const emit = defineEmits(["success"]);
const isInsert = computed(() => initialState === null);

const { refresh } = useAccounts();
const toast = useToast();
const { locale } = useI18n();

const open = defineModel<boolean>("open");
const currencyOptions = computed(() => getCurrencies(LOCALES.find(({ code }) => code === locale.value)!.language));

const emptyState = {
    title: "",
    currency: "",
};

const state = reactive<PostAccount>({
    ...emptyState,
    ...initialState,
});

watch(open, newOpen => {
    if (!newOpen) return;
    Object.assign(state, initialState ?? emptyState);
});

async function onSubmit() {
    const submissionState = deepCopy(state);
    $fetch(isInsert.value ? "/api/finance/accounts" : `/api/finance/accounts/${initialState?.id}`, {
        method: isInsert.value ? "POST" : "PUT",
        body: submissionState,
    })
        .then(() => {
            emit("success");
            toast.add(
                createToastSuccess(
                    $t(`finance.account.toast.${isInsert.value ? "created" : "updated"}Title`),
                    $t(`finance.account.toast.${isInsert.value ? "created" : "updated"}Description`, {
                        title: ellipsize(state.title, 15),
                    }),
                ),
            );
            refresh();
        })
        .catch(error => {
            toast.add(createToastError(error));
        });
}
</script>

<template>
    <Drawer v-model:open="open">
        <BaseUpsertForm
            :schema="PostAccountSchema"
            :state="state"
            :mode="isInsert ? 'insert' : 'update'"
            @submit.prevent="onSubmit"
        >
            <template #heading>
                <H1>{{ $t(`finance.account.aria.drawer.${isInsert ? "create" : "edit"}`) }}</H1>
            </template>
            <template #default>
                <UFormField :label="$t('finance.account.form.title')" name="title" class="w-full" required>
                    <UInput
                        v-model="state.title"
                        class="w-full"
                        :maxlength="TITLE_MAX"
                        data-test-id="finance-upsert-title-input"
                    />
                </UFormField>
                <UFormField :label="$t('finance.account.form.currency')" name="currency" class="w-full" required>
                    <USelectMenu
                        v-model="state.currency"
                        :disabled="!isInsert"
                        class="w-full"
                        value-key="id"
                        :items="currencyOptions"
                        data-test-id="finance-upsert-currency-select"
                    />
                </UFormField>
            </template>
        </BaseUpsertForm>
        <template #title>{{ $t(`finance.account.aria.drawer.${isInsert ? "create" : "edit"}`) }}</template>
        <template #description>{{ $t("finance.account.aria.drawer.description") }}</template>
    </Drawer>
</template>
