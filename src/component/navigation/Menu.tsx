"use client";

import { clsx } from "clsx/lite";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
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
import ThemeToggle from "@component/interaction/ThemeToggle";
import MenuLink from "@component/navigation/MenuLink";

export default function Menu({ signedIn }: { signedIn: boolean }) {
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

    const sessionButton = (
        <div className="flex">
            <button
                onClick={signedIn ? () => signOut({ callbackUrl: "/" }) : () => signIn()}
                className="inline-link-1 group mx-auto mt-4 flex justify-center gap-2"
                data-test-id="session-button"
            >
                {signedIn ? (
                    <ArrowRightStartOnRectangle className="size-6 transition-colors group-hover:stroke-amber-400 group-focus-visible:stroke-amber-400 dark:group-hover:stroke-amber-600 dark:group-focus-visible:stroke-amber-600" />
                ) : (
                    <ArrowRightEndOnRectangle className="size-6 transition-colors group-hover:stroke-amber-400 group-focus-visible:stroke-amber-400 dark:group-hover:stroke-amber-600 dark:group-focus-visible:stroke-amber-600" />
                )}
                {signedIn ? "Sign Out" : "Sign In"}
            </button>
        </div>
    );

    const menu = (
        <header className={headerClass}>
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
                        <Grizzl className="w-full fill-back" />
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
                                Poll
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
                                To-Do
                            </MenuLink>
                        </li>
                        <li className="w-full">
                            <MenuLink
                                color="bg-purple-700"
                                onClick={() => setIsOpen(false)}
                                href="/timer"
                                data-test-id="menu-link-timer"
                            >
                                <Clock className="size-6 stroke-front" />
                                Timer
                            </MenuLink>
                        </li>
                        <li className="w-full">
                            <MenuLink
                                color="bg-rose-700"
                                onClick={() => setIsOpen(false)}
                                href="/finance"
                                data-test-id="menu-link-finance"
                            >
                                <Banknotes className="size-6 stroke-front" />
                                Finance
                            </MenuLink>
                        </li>
                        <li className="w-full">{sessionButton}</li>
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
            data-test-id="menu-button"
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
