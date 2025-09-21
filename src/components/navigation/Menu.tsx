"use client";

import { clsx } from "clsx/lite";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";

import ArrowRightEndOnRectangle from "@components/icons/ArrowRightEndOnRectangle";
import ArrowRightStartOnRectangle from "@components/icons/ArrowRightStartOnRectangle";
import Banknotes from "@components/icons/Banknotes";
import Bars2 from "@components/icons/Bars2";
import ChartPie from "@components/icons/ChartPie";
import ClipboardDocumentList from "@components/icons/ClipboardDocumentList";
import Clock from "@components/icons/Clock";
import Grizzl from "@components/icons/Grizzl";
import XMark from "@components/icons/XMark";
import ThemeToggle from "@components/interaction/ThemeToggle";
import MenuLink from "@components/navigation/MenuLink";

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
        <MenuLink
            as="button"
            color="bg-emerald-700"
            onClick={signedIn ? () => signOut({ callbackUrl: "/" }) : () => signIn()}
        >
            {signedIn ? <ArrowRightStartOnRectangle /> : <ArrowRightEndOnRectangle />}
            {signedIn ? "Sign Out" : "Sign Out"}
        </MenuLink>
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
                        <li className="w-full">{sessionButton}</li>
                        <li className="w-full">
                            <MenuLink color="bg-cyan-700" onClick={() => setIsOpen(false)} href="/poll">
                                <ChartPie />
                                Poll
                            </MenuLink>
                        </li>
                        <li className="w-full">
                            <MenuLink color="bg-purple-700" onClick={() => setIsOpen(false)} href="/todo">
                                <ClipboardDocumentList />
                                To-Do
                            </MenuLink>
                        </li>
                        <li className="w-full">
                            <MenuLink color="bg-rose-700" onClick={() => setIsOpen(false)} href="/timer">
                                <Clock className="size-6 stroke-front" />
                                Timer
                            </MenuLink>
                        </li>
                        <li className="w-full">
                            <MenuLink color="bg-amber-700" onClick={() => setIsOpen(false)} href="/finance">
                                <Banknotes className="size-6 stroke-front" />
                                Finance
                            </MenuLink>
                        </li>
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
