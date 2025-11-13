export default function useVoices() {
    const ttsVoices = ref<{ label: string; value: string | undefined }[]>([]);

    onMounted(() => {
        if (typeof speechSynthesis === "undefined") return;
        const loadVoices = () => {
            const voices = speechSynthesis.getVoices();
            ttsVoices.value = voices.map(v => ({ label: v.name, value: v.voiceURI }));
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
