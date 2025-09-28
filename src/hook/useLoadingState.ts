import { LoadingStateContext } from "@context";
import { usePathname, useSearchParams } from "next/navigation";
import { useContext, useEffect } from "react";

export default function useLoadingState() {
    const { loadingState, setLoadingState } = useContext(LoadingStateContext);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    useEffect(() => {
        setLoadingState(false);
    }, [pathname, searchParams, setLoadingState]);
    return { loadingState, setLoadingState };
}
