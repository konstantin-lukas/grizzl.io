"use client";

import { LoadingStateContext } from "@context";
import type { ReactNode } from "react";
import { useState } from "react";

export default function LoadingStateProvider({ children }: { children: ReactNode }) {
    const [loadingState, setLoadingState] = useState<number | boolean>(false);
    return (
        <LoadingStateContext.Provider value={{ loadingState, setLoadingState }}>
            {children}
        </LoadingStateContext.Provider>
    );
}
