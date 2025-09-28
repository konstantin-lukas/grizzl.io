"use client";

import { clsx } from "clsx/lite";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";

import ArrowRightEndOnRectangle from "@component/icon/ArrowRightEndOnRectangle";
import ArrowRightStartOnRectangle from "@component/icon/ArrowRightStartOnRectangle";
import Banknotes from "@component/icon/Banknotes";
import Bars2 from "@component/icon/Bars2";
import ChartPie from "@component/icon/ChartPie";
import ClipboardDocumentList from "@component/icon/ClipboardDocumentList";
import Clock from "@component/icon/Clock";
import Grizzl from "@component/icon/Grizzl";
import XMark from "@component/icon/XMark";
import LanguageSelect from "@component/interaction/LanguageSelect";
import ThemeToggle from "@component/interaction/ThemeToggle";
import MenuLink from "@component/navigation/MenuLink";

import type { getDictionary } from "@util/server/translation";

export default function Menu({
    signedIn,
    children,
    translation,
}: {
    signedIn: boolean;
    children: ReactNode;
    translation: Awaited<ReturnType<typeof getDictionary>>;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const openIconRef = useRef(null);
    const closeIconRef = useRef(null);
    const headerClass = clsx(
        "w-[100dvw]",
        "h-[100dvh]",
        "bg-back/30",
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
        !isOpen && "invisible",
        isOpen && "backdrop-blur-lg",
    );

    const sessionButton = (
        <div className="flex">
            <button
                onClick={signedIn ? () => signOut({ callbackUrl: "/" }) : () => signIn()}
                className="inline-link-1 group mx-auto mt-4 flex justify-center gap-2"
                data-test-id="session-button"
            >
                {signedIn ? (
                    <ArrowRightStartOnRectangle className="size-6 transition-colors group-hover:stroke-amber-600 group-focus-visible:stroke-amber-600 dark:group-hover:stroke-amber-400 dark:group-focus-visible:stroke-amber-400" />
                ) : (
                    <ArrowRightEndOnRectangle className="size-6 transition-colors group-hover:stroke-amber-600 group-focus-visible:stroke-amber-600 dark:group-hover:stroke-amber-400 dark:group-focus-visible:stroke-amber-400" />
                )}
                {signedIn ? translation.signOut : translation.signIn}
            </button>
        </div>
    );

    const menu = (
        <header className={headerClass} id="menu" aria-hidden={!isOpen}>
            <div className="max-h-full w-full overflow-auto">
                <nav
                    className="m-auto flex flex-col items-center justify-center py-20"
                    aria-label="Main site navigation"
                >
                    <Link
                        href="/"
                        className="mb-8 block w-[75dvw] sm:w-80"
                        aria-label="Go to Home"
                        onClick={() => setIsOpen(false)}
                    >
                        <Grizzl className="w-full fill-front" />
                    </Link>
                    <ul className="flex flex-col gap-6">
                        <li className="w-full">
                            <MenuLink
                                color="bg-emerald-700"
                                onClick={() => setIsOpen(false)}
                                href="/poll"
                                data-test-id="menu-link-poll"
                            >
                                <ChartPie />
                                {translation.poll}
                            </MenuLink>
                        </li>
                        <li className="w-full">
                            <MenuLink
                                color="bg-cyan-700"
                                onClick={() => setIsOpen(false)}
                                href="/todo"
                                data-test-id="menu-link-todo"
                            >
                                <ClipboardDocumentList />
                                {translation.todo}
                            </MenuLink>
                        </li>
                        <li className="w-full">
                            <MenuLink
                                color="bg-purple-700"
                                onClick={() => setIsOpen(false)}
                                href="/timer"
                                data-test-id="menu-link-timer"
                            >
                                <Clock className="size-6" />
                                {translation.timer}
                            </MenuLink>
                        </li>
                        <li className="w-full">
                            <MenuLink
                                color="bg-rose-700"
                                onClick={() => setIsOpen(false)}
                                href="/finance"
                                data-test-id="menu-link-finance"
                            >
                                <Banknotes className="size-6" />
                                {translation.finance}
                            </MenuLink>
                        </li>
                        <li className="w-full">{sessionButton}</li>
                    </ul>
                </nav>
            </div>
            <ThemeToggle />
            <LanguageSelect translation={translation} />
        </header>
    );

    const menuButton = (
        <button
            className="fixed top-4 left-4 z-50 h-10 w-10 cursor-pointer"
            aria-label="Toggle the menu"
            data-test-id="menu-button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="menu"
        >
            <CSSTransition in={isOpen} timeout={250} nodeRef={openIconRef} classNames="menu-icon-open" unmountOnExit>
                <XMark ref={openIconRef} className="absolute top-0 left-0 h-full w-full stroke-front" />
            </CSSTransition>
            <CSSTransition in={!isOpen} timeout={250} nodeRef={closeIconRef} classNames="menu-icon-close" unmountOnExit>
                <Bars2 ref={closeIconRef} className="absolute top-0 left-0 h-full w-full stroke-front" />
            </CSSTransition>
        </button>
    );

    return (
        <>
            {menu}
            {menuButton}
            <div aria-hidden={isOpen} inert={isOpen} data-test-id="inert-container">
                {children}
            </div>
        </>
    );
}
