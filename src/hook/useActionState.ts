import { useEffect, useActionState as useReactActionState } from "react";

import useLoadingState from "@hook/useLoadingState";

import type { ActionResult, ActionStateResult, Failure, Success } from "@type/result";

export default function useActionState<T>(
    action: () => ActionResult<T>,
    initialData: Success<T> | Failure<string[]>,
): ActionStateResult<T> {
    const [payload, dispatch, pending] = useReactActionState(action, initialData);
    const { setLoadingState } = useLoadingState();
    useEffect(() => {
        setLoadingState(pending);
    }, [pending, setLoadingState]);

    return { ...payload, action: dispatch, pending };
}
