import { useToast } from "#ui/composables";
import { createToastError } from "~/core/utils/toast";
import useMutationQueue from "~/todo/composables/useMutationQueue";

export default defineNuxtPlugin(() => {
    const toast = useToast();
    const { error } = useMutationQueue(true);

    watch(error, () => {
        if (!error.value) return;
        toast.add(createToastError(error.value));
    });
});
