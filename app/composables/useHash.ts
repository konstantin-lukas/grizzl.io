export default function useHash(message: Ref<string>) {
    const messageDigest = ref("");
    watchEffect(async () => {
        messageDigest.value = await hash(message.value);
    });
    return messageDigest;
}
