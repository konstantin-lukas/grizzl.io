import { Moon, Sun } from "@heroui/shared-icons";
import { useTheme } from "next-themes";
import { useRef } from "react";
import { CSSTransition } from "react-transition-group";

import useHasMounted from "@hook/useHasMounted";

export default function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme();
    const hasMounted = useHasMounted();
    const moonIconRef = useRef(null);
    const sunIconRef = useRef(null);
    return (
        <button
            onClick={() => setTheme(hasMounted && resolvedTheme === "dark" ? "light" : "dark")}
            aria-label="Toggle app theme"
            className="absolute top-4 right-4 h-10 w-10"
            data-test-id={hasMounted && `theme-toggle-${resolvedTheme}`}
        >
            <CSSTransition
                in={hasMounted && resolvedTheme === "light"}
                timeout={250}
                nodeRef={moonIconRef}
                classNames="menu-icon-open"
                unmountOnExit
            >
                <Moon ref={moonIconRef} className="absolute top-0 left-0 h-full w-full stroke-front" />
            </CSSTransition>
            <CSSTransition
                in={hasMounted && resolvedTheme === "dark"}
                timeout={250}
                nodeRef={sunIconRef}
                classNames="menu-icon-close"
                unmountOnExit
            >
                <Sun ref={sunIconRef} className="absolute top-0 left-0 h-full w-full stroke-front" />
            </CSSTransition>
        </button>
    );
}
