"use client";

import { clsx } from "clsx/lite";
import Link from "next/link";
import type { ReactNode } from "react";
import { useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";

import ArrowRight from "@components/icons/ArrowRight";
import Banknotes from "@components/icons/Banknotes";
import Bars2 from "@components/icons/Bars2";
import ChartPie from "@components/icons/ChartPie";
import ClipboardDocumentList from "@components/icons/ClipboardDocumentList";
import Clock from "@components/icons/Clock";
import Grizzl from "@components/icons/Grizzl";
import XMark from "@components/icons/XMark";
import ThemeToggle from "@components/interaction/ThemeToggle";

function MenuLink({ children, color }: { children: ReactNode; color: string }) {
    const hoverClass = clsx("absolute", "h-full", "w-full", "px-8", "py-3", color);
    return (
        <li className="w-full">
            <Link
                href="/"
                className="group relative flex h-full w-full justify-center gap-4 overflow-hidden rounded-full text-front"
            >
                <div className="w-full transition-transform group-hover:-translate-y-full">
                    <div className="flex h-full w-full justify-center gap-2 bg-back px-8 py-3 text-center">
                        {children}
                    </div>
                    <div className={hoverClass}>
                        <ArrowRight className="absolute top-1/2 left-1/2 h-8 w-8 -translate-1/2 stroke-theme-white" />
                    </div>
                </div>
            </Link>
        </li>
    );
}

export default function Menu() {
    const [isOpen, setIsOpen] = useState(false);
    const openIconRef = useRef(null);
    const closeIconRef = useRef(null);
    const headerClass = clsx(
        "w-[100dvw]",
        "h-[100dvh]",
        "bg-front/30",
        "fixed",
        "top-0",
        "left-0",
        "z-40",
        "flex",
        "justify-center",
        "items-center",
        "transition-opacity",
        "duration-300",
        !isOpen && "opacity-0",
        !isOpen && "pointer-events-none",
        isOpen && "backdrop-blur-lg",
    );

    const menu = (
        <header className={headerClass}>
            <div className="max-h-full w-full overflow-auto">
                <nav className="m-auto flex flex-col items-center justify-center py-20">
                    <Link href="/" className="mb-8 block w-[75dvw] sm:w-80">
                        <Grizzl className="w-full fill-back" />
                    </Link>
                    <ul className="flex flex-col gap-6">
                        <MenuLink color="bg-emerald-700">
                            <ChartPie />
                            Poll
                        </MenuLink>
                        <MenuLink color="bg-cyan-700">
                            <ClipboardDocumentList />
                            To-Do
                        </MenuLink>
                        <MenuLink color="bg-purple-700">
                            <Clock className="size-6 stroke-front" />
                            Timer
                        </MenuLink>
                        <MenuLink color="bg-rose-700">
                            <Banknotes className="size-6 stroke-front" />
                            Finance
                        </MenuLink>
                    </ul>
                </nav>
            </div>
            <ThemeToggle />
        </header>
    );

    const menuButton = (
        <button
            className="fixed top-4 left-4 z-50 h-10 w-10 cursor-pointer"
            aria-label="Toggle the menu"
            onClick={() => setIsOpen(!isOpen)}
        >
            <CSSTransition in={isOpen} timeout={200} nodeRef={openIconRef} classNames="menu-icon-open" unmountOnExit>
                <XMark ref={openIconRef} className="absolute top-0 left-0 h-full w-full stroke-back" />
            </CSSTransition>
            <CSSTransition in={!isOpen} timeout={200} nodeRef={closeIconRef} classNames="menu-icon-close" unmountOnExit>
                <Bars2 ref={closeIconRef} className="absolute top-0 left-0 h-full w-full stroke-back" />
            </CSSTransition>
        </button>
    );

    return (
        <>
            {menu}
            {menuButton}
        </>
    );
}
