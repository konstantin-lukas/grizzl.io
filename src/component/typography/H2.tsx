import type { ElementType, ReactNode } from "react";

export default function H2({ children, as: Component = "h2" }: { children: ReactNode; as?: ElementType }) {
    return <Component className="inline-block pt-1 pb-2 text-3xl font-bold uppercase">{children}</Component>;
}
