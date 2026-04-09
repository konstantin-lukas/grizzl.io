import { deepCopy } from "#shared/core/utils/object.util";
import { useToast } from "#ui/composables";
import { createToastError, createToastSuccess } from "~/core/utils/toast";

export default function useOnSubmit<T extends object>({
    url,
    method,
    state,
    emit,
    translationKey,
    transform,
    interpolations,
    refresh,
}: {
    url: () => string;
    method: () => "POST" | "PUT";
    state: T;
    transform?: (v: T) => T;
    emit: (e: "success") => void;
    translationKey: string;
    interpolations: (v: T) => Record<string, string>;
    refresh?: () => void;
}) {
    const toast = useToast();
    const { t } = useI18n();

    const { start, finish } = useLoadingIndicator();
    async function onSubmit() {
        const m = method();
        const isPost = m === "POST";
        const action = isPost ? "created" : "updated";
        let submissionState = deepCopy(state);
        if (transform) submissionState = transform(submissionState);
        start({ force: true });
        await $fetch(url(), {
            method: m,
            body: submissionState,
        })
            .then(() => {
                emit("success");
                toast.add(
                    createToastSuccess(
                        isPost ? t(`${translationKey}.toast.createdTitle`) : t(`${translationKey}.toast.updatedTitle`),
                        t(
                            isPost
                                ? `${translationKey}.toast.${action}Description`
                                : `${translationKey}.toast.${action}Description`,
                            interpolations(submissionState),
                        ),
                    ),
                );
                if (refresh) refresh();
            })
            .catch(error => {
                toast.add(createToastError(error));
            })
            .finally(finish);
    }

    return onSubmit;
}
