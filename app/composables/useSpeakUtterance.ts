export default function useSpeakUtterance() {
    const voices = useVoices();

    function speak(utterance: string, voiceURI: string) {
        if (speechSynthesis.speaking) return;
        const utterThis = new SpeechSynthesisUtterance(utterance);
        for (const voice of voices.value) {
            if (voice.voiceURI === voiceURI) {
                utterThis.voice = voice;
            }
        }
        if (!utterThis.voice) return;
        speechSynthesis.speak(utterThis);
    }

    return speak;
}
