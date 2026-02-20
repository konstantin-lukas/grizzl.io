export default function useVoiceDigest() {
    const ttsVoices = useVoices();

    const voiceListAsString = computed(() =>
        ttsVoices.value
            .map(voice => voice.voiceURI)
            .sort((a, b) => a.localeCompare(b))
            .join(""),
    );

    return useHash(voiceListAsString);
}
