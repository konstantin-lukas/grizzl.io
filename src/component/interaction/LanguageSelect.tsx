import { Button } from "@heroui/button";
import { Modal, ModalContent, useDisclosure } from "@heroui/modal";
import { Radio, RadioGroup } from "@heroui/radio";
import { startTransition, useState } from "react";

import Language from "@component/icon/Language";

import { LANGUAGES, LOCALES } from "@const/i18n";

import { useChangeLanguage } from "@hook/action/useChangeLanguage";
import useLoadingState from "@hook/useLoadingState";

import type { DictionaryMap, Locale } from "@type/i18n";

function ChangeLanguageButton({ locale }: { locale: Locale }) {
    const language = LANGUAGES[locale];
    return (
        <Radio value={locale} classNames={{ label: "flex gap-2 items-center" }}>
            {language}
        </Radio>
    );
}

export default function LanguageSelect({
    translation,
    locale,
}: {
    translation: DictionaryMap["menu"] & DictionaryMap["ui"];
    locale: Locale;
}) {
    const languageButtons = LOCALES.map(locale => <ChangeLanguageButton key={locale} locale={locale} />);
    const [selectedLocale, setSelectedLocale] = useState<typeof locale>(locale);
    const action = useChangeLanguage(selectedLocale);
    const { isLoading } = useLoadingState();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            <button
                aria-label={translation.aria.changeLang}
                className="absolute right-4 bottom-4 h-10 w-10"
                data-test-id="language-select"
                onClick={onOpen}
            >
                <Language className="absolute right-0 bottom-0 h-full w-full stroke-front" />
            </button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {onClose => (
                        <div className="p-8">
                            <RadioGroup
                                isDisabled={isLoading}
                                value={selectedLocale}
                                onValueChange={setSelectedLocale as (v: string) => void}
                                label={translation.selectLanguage}
                                classNames={{ label: "mb-4" }}
                            >
                                {languageButtons}
                            </RadioGroup>
                            <div className="mt-8">
                                <Button
                                    color="primary"
                                    onPress={() => {
                                        startTransition(action);
                                        onClose();
                                    }}
                                >
                                    {translation.save}
                                </Button>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    {translation.cancel}
                                </Button>
                            </div>
                        </div>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
