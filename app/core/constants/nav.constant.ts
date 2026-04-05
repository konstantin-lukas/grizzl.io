import { ICON_FINANCE, ICON_POLL, ICON_TIMER, ICON_TODO } from "~/core/constants/icons.constant";

export const APP_NAV = [
    ["poll", ICON_POLL, true],
    ["todo", ICON_TODO, true],
    ["timer", ICON_TIMER, false],
    ["finance", ICON_FINANCE, false],
] as const;
