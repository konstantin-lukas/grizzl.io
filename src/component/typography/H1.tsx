import type { ElementType, ReactNode } from "react";

export default function H1({ children, as: Component = "h1" }: { children: ReactNode; as?: ElementType }) {
    return (
        <Component
            className="inline-block bg-gradient-to-r from-amber-500 to-emerald-500 bg-clip-text pt-1 pb-2
            text-4xl font-bold text-transparent uppercase dark:from-amber-400 dark:to-emerald-400"
        >
            {children}
        </Component>
    );
}
