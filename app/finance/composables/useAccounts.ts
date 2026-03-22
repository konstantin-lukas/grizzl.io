import { useToast } from "#ui/composables";
import useLocalStorage from "~/core/composables/useLocalStorage";
import { onResponseError } from "~/core/utils/toast";

export default function useAccounts() {
    const toast = useToast();
    const { t } = useI18n();
    const { data: accounts, refresh: refreshAccounts } = useFetch("/api/finance/accounts", {
        key: "/api/finance/accounts",
        onResponseError: onResponseError(toast, t),
    });
    const openAccountId = useLocalStorage<string>("openFinanceAccountId", "");

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
    const refresh = async () => {
        const accountCountBeforeRefresh = accounts.value?.length ?? 0;
        await refreshAccounts();
        if (!accounts.value) return;
        const accountsList = accounts.value;
        const accountCountAfterRefresh = accountsList.length ?? 0;
        if (!accountCountAfterRefresh) {
            openAccountId.value = "";
            return;
        }
        if (accountCountAfterRefresh > accountCountBeforeRefresh) {
            const latest = accountsList.reduce((latest, current) => {
                return new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest;
            });

            openAccountId.value = latest.id;
            return;
        }
        if (accountCountAfterRefresh < accountCountBeforeRefresh) {
            const [first] = accountsList;

            openAccountId.value = first!.id;
            return;
        }
    };

    return { accounts, refresh, openAccount, openAccountId };
}
