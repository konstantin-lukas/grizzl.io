/**
 * @returns A 40 character long hexadecimal string based on the message
 * @param message The message to generate a hash for
 */
export async function hash(message: string) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await window.crypto.subtle.digest("SHA-1", msgUint8);
    const bytes = new Uint8Array(hashBuffer);
    let hex = "";
    for (let i = 0; i < bytes.length; i++) {
        hex += bytes[i]!.toString(16).padStart(2, "0");
    }
    return hex.slice(0, 40);
}
