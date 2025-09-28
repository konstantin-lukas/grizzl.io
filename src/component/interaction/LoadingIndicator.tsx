"use client";

import { Progress } from "@heroui/progress";

import useLoadingState from "@hook/useLoadingState";

export default function LoadingIndicator() {
    const { loadingState } = useLoadingState();
    if (loadingState === false) return null;
    return (
        <Progress
            classNames={{ base: "fixed top-0 z-10 w-full", track: "rounded-none h-2", indicator: "rounded-none" }}
            aria-label="Loading..."
            value={(typeof loadingState === "number" && loadingState) || undefined}
            isIndeterminate={typeof loadingState === "boolean"}
        />
    );
}
