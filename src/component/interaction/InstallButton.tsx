"use client";

import { Button } from "@heroui/button";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function InstallButton() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as unknown as BeforeInstallPromptEvent);
        };
        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        console.log("User response:", choice.outcome);
        setDeferredPrompt(null);
    };

    if (!deferredPrompt) return null;

    return (
        <Button
            onPress={handleInstall}
            className="fixed top-6 right-6"
            color="success"
            size="md"
            radius="full"
            data-test-id="install-prompt-button"
        >
            Install App
        </Button>
    );
}
