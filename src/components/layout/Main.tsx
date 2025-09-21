"use client";

import { clsx } from "clsx/lite";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";

import useHasMounted from "@hooks/useHasMounted";

export default function Main({ children }: { children: ReactNode }) {
    const { resolvedTheme } = useTheme();
    const hasMounted = useHasMounted();
    const isDark = hasMounted && resolvedTheme === "dark";
    const className = clsx("min-h-[calc(100dvh_-_var(--spacing-footer-height))]", !isDark && "dark");
    return <main className={className}>{children}</main>;
}
