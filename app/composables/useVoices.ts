export default function useVoices() {
    const ttsVoices = ref<SpeechSynthesisVoice[]>([]);

    onMounted(() => {
        if (typeof speechSynthesis === "undefined") return;
        const loadVoices = () => {
            ttsVoices.value = speechSynthesis.getVoices();
        };
        loadVoices();
        speechSynthesis.addEventListener("voiceschanged", loadVoices);
        onBeforeUnmount(() => {
            if (typeof speechSynthesis === "undefined") return;
            speechSynthesis.removeEventListener("voiceschanged", loadVoices);
        });
    });

    return ttsVoices;
}
