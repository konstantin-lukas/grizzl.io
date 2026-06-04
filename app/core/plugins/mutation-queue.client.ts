import useMutationQueue from "~/todo/composables/useMutationQueue";

export default defineNuxtPlugin(() => {
    useMutationQueue(true);
});
