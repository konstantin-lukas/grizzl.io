import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { startTransition } from "react";

import Language from "@component/icon/Language";

import { LANGUAGES, LOCALES } from "@const/i18n";

import { useChangeLanguage } from "@hook/action/useChangeLanguage";

import type { Locale } from "@type/i18n";

import type { getDictionary } from "@util/server/translation";

function ChangeLanguageButton({ locale, index }: { locale: Locale; index: number }) {
    const action = useChangeLanguage(locale);
    const lang = LANGUAGES[locale];
    return (
        <li>
            <button
                className={`inline-link-${(index % 3) + 1} flex items-center gap-2`}
                onClick={() => startTransition(action)}
            >
                {lang.flag} {lang.name}
            </button>
        </li>
    );
}

export default function LanguageSelect({ translation }: { translation: Awaited<ReturnType<typeof getDictionary>> }) {
    const languageButtons = LOCALES.map((locale, index) => (
        <ChangeLanguageButton key={locale} index={index} locale={locale} />
    ));

    return (
        <Popover placement="top-end" className="absolute right-4 bottom-4">
            <PopoverTrigger className="absolute right-4 bottom-4 h-10 w-10">
                <button aria-label={translation.aria.changeLang} className="h-10 w-10" data-test-id="language-select">
                    <Language className="absolute bottom-0 left-0 h-full w-full stroke-front" />
                </button>
            </PopoverTrigger>
            <PopoverContent>
                <ul className="p-2">{languageButtons}</ul>
            </PopoverContent>
        </Popover>
    );
}
