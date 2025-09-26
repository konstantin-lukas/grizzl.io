import { clsx } from "clsx";
import Link from "next/link";
import type { ElementType, ReactNode } from "react";

import ArrowRight from "@component/icon/ArrowRight";

export default function MenuLink({
    children,
    color,
    onClick,
    href,
    "as": Component = Link,
    "data-test-id": id,
}: {
    "children": ReactNode;
    "color": string;
    "onClick"?: () => void;
    "href"?: string;
    "as"?: ElementType;
    "data-test-id"?: string;
}) {
    const hoverClass = clsx("absolute", "h-full", "w-full", "px-8", "py-3", "left-0", "top-full", color);
    if (Component === Link && !href) throw new Error("Component needs an href attribute");
    return (
        <Component
            onClick={onClick}
            data-test-id={id}
            href={Component === Link ? href : undefined}
            className="group relative flex h-full w-full justify-center gap-4 overflow-hidden rounded-full text-front"
        >
            <span className="w-full transition-transform group-hover:-translate-y-full group-focus-visible:-translate-y-full">
                <span className="flex h-full w-full items-center justify-center gap-2 bg-back px-8 py-3 text-center">
                    {children}
                </span>
                <span className={hoverClass}>
                    <ArrowRight className="absolute top-1/2 left-1/2 h-8 w-8 -translate-1/2 stroke-theme-white" />
                </span>
            </span>
        </Component>
    );
}
