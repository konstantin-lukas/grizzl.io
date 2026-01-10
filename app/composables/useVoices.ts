export default function useVoices() {
    const ttsVoices = ref<SpeechSynthesisVoice[]>([]);
    const { locale } = useI18n();

    onMounted(() => {
        if (typeof speechSynthesis === "undefined") return;
        const loadVoices = () => {
            const voices = speechSynthesis.getVoices();
            const map = new Map<string, SpeechSynthesisVoice>();
            for (const v of voices) {
                if (locale.value === v.lang.substring(0, 2) && v.localService) map.set(v.voiceURI, v);
            }
            ttsVoices.value = [...map.values()].slice(0, 50);
        };
        loadVoices();
        speechSynthesis.addEventListener("voiceschanged", loadVoices);
        onBeforeUnmount(() => {
            speechSynthesis.removeEventListener("voiceschanged", loadVoices);
        });
    });

    return ttsVoices;
}
