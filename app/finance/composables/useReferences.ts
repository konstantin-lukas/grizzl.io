import useTransactions from "~/finance/composables/useTransactions";

export default function useReferences() {
    const { transactions } = useTransactions();

    return computed(() => {
        const references = transactions.value.map(({ reference }) => reference);
        const deduplicatedReferences = [...new Set(references)];
        return deduplicatedReferences.filter(s => s);
    });
}
