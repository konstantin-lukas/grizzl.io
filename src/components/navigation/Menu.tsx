"use client";

import { Card } from "@heroui/card";
import { clsx } from "clsx/lite";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";

import useHasMounted from "@hooks/useHasMounted";

export default function Menu() {
    const [isOpen, setIsOpen] = useState(false);
    const { setTheme, resolvedTheme } = useTheme();
    const hasMounted = useHasMounted();
    const headerClass = clsx(
        "w-[100dvw]",
        "h-[100dvh]",
        "bg-black/30",
        "fixed",
        "top-0",
        "left-0",
        "z-40",
        "flex",
        "justify-center",
        "items-center",
        "transition-all",
        "duration-300",
        !isOpen && "opacity-0",
        !isOpen && "pointer-events-none",
        isOpen && "backdrop-blur-lg",
    );
    return (
        <>
            <header className={headerClass}>
                <nav className="grid">
                    <Link href="/public">
                        <Card className="p-4">Test</Card>
                    </Link>
                </nav>
                <button onClick={() => setTheme(hasMounted && resolvedTheme === "dark" ? "light" : "dark")}>
                    Toggle darkmode
                </button>
            </header>
            <button className="fixed top-0 left-0 z-50 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                Menu
            </button>
        </>
    );
}
