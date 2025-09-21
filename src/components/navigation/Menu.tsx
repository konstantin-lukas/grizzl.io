"use client";

import { Card } from "@heroui/card";
import { clsx } from "clsx/lite";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";

import Bars2 from "@components/icons/Bars2";
import XMark from "@components/icons/XMark";

import useHasMounted from "@hooks/useHasMounted";

export default function Menu() {
    const [isOpen, setIsOpen] = useState(false);
    const { setTheme, resolvedTheme } = useTheme();
    const hasMounted = useHasMounted();
    const openIconRef = useRef(null);
    const closeIconRef = useRef(null);
    const headerClass = clsx(
        "w-[100dvw]",
        "h-[100dvh]",
        "bg-white/30",
        "dark:bg-black/30",
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
                    Toggle
                </button>
            </header>
            <button
                className="fixed top-4 left-4 z-50 cursor-pointer w-8 h-8"
                aria-label="Toggle the menu"
                onClick={() => setIsOpen(!isOpen)}
            >
                <CSSTransition
                    in={isOpen}
                    timeout={200}
                    nodeRef={openIconRef}
                    classNames="menu-icon-open"
                    unmountOnExit
                >
                    <Bars2
                        ref={openIconRef}
                        className="w-full h-full stroke-black dark:stroke-white absolute left-0 top-0"
                    />
                </CSSTransition>
                <CSSTransition
                    in={!isOpen}
                    timeout={200}
                    nodeRef={closeIconRef}
                    classNames="menu-icon-close"
                    unmountOnExit
                >
                    <XMark
                        ref={closeIconRef}
                        className="w-full h-full stroke-black dark:stroke-white absolute left-0 top-0"
                    />
                </CSSTransition>
            </button>
        </>
    );
}
