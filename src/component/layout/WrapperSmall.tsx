import type { ReactNode } from "react";

export default function WrapperSmall({ children }: { children: ReactNode }) {
    return <div className="mx-auto size-full w-10/12 max-w-screen-md">{children}</div>;
}
