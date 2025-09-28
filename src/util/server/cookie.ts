import { cookies } from "next/headers";

export async function setCookie(name: string, value: string) {
    const cookie = await cookies();
    cookie.set(name, value, {
        httpOnly: true,
        secure: process.env.APP_ENV === "production",
        sameSite: "strict",
    });
}
