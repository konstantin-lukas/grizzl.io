import type { Dispatch, SetStateAction } from "react";
import { createContext } from "react";

export const LoadingStateContext = createContext<{
    loadingState: boolean | number;
    setLoadingState: Dispatch<SetStateAction<boolean | number>>;
}>({
    loadingState: false,
    setLoadingState: () => undefined,
});
