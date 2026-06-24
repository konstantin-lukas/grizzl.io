import { ICON_FINANCE, ICON_POLL, ICON_TIMER, ICON_TODO } from "~/core/constants/icons.constant";

export const APP_NAV = [
    ["poll", ICON_POLL, false],
    ["todo", ICON_TODO, false],
    ["timer", ICON_TIMER, false],
    ["finance", ICON_FINANCE, false],
] as const;
