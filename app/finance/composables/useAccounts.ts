import { useToast } from "#ui/composables";
import { useLocalStorage } from "~/core/composables/useLocalStorage";
import { onResponseError } from "~/core/utils/toast";

export default function useAccounts() {
    const toast = useToast();
    const { data: accounts, refresh } = useFetch("/api/finance/accounts", {
        key: "/api/finance/accounts",
        onResponseError: onResponseError(toast),
    });
    const openAccountId = useLocalStorage("openFinanceAccountId", "");

    watch(accounts, () => {
        if (openAccountId.value && accounts.value?.every(account => account.id !== openAccountId.value)) {
            openAccountId.value = "";
        }
    });

    watch(accounts, () => {
        const firstAccount = accounts.value?.[0]?.id;
        if (openAccountId.value || !firstAccount) return;
        openAccountId.value = firstAccount;
    });

    const openAccount = computed(() => accounts.value?.find(account => account.id === openAccountId.value));

    return { accounts, refresh, openAccount, openAccountId };
}
