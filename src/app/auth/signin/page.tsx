import { Card } from "@heroui/card";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { LuTwitch } from "react-icons/lu";
import { PiRedditLogo, PiSpotifyLogo } from "react-icons/pi";
import { RiDiscordLine, RiGithubLine } from "react-icons/ri";
import { SiKeycloak } from "react-icons/si";

import SignInButton from "@components/interaction/SignInButton";
import Wrapper from "@components/layout/Wrapper";
import H1 from "@components/typography/H1";

export default async function Page(context: { searchParams: Promise<{ callbackUrl: string }> }) {
    const session = await getServerSession();
    if (session?.user) redirect((await context.searchParams)?.callbackUrl ?? "/");

    const heading = <H1>Sign In</H1>;

    const buttons =
        process.env.APP_ENV === "production" ? (
            <>
                <SignInButton color="bg-emerald-700" serviceName="discord">
                    <RiDiscordLine className="mr-2 inline" />
                    <span>Discord</span>
                </SignInButton>
                <SignInButton color="bg-emerald-700" serviceName="github">
                    <RiGithubLine className="mr-2 inline" />
                    <span>GitHub</span>
                </SignInButton>
                <SignInButton color="bg-emerald-700" serviceName="reddit">
                    <PiRedditLogo className="mr-2 inline" />
                    <span>Reddit</span>
                </SignInButton>
                <SignInButton color="bg-emerald-700" serviceName="twitch">
                    <LuTwitch className="mr-2 inline" />
                    <span>Twitch</span>
                </SignInButton>
                <SignInButton color="bg-emerald-700" serviceName="spotify">
                    <PiSpotifyLogo className="mr-2 inline" />
                    <span>Spotify</span>
                </SignInButton>
            </>
        ) : (
            <SignInButton color="bg-emerald-700" serviceName="keycloak">
                <SiKeycloak className="mr-2 inline" />
                <span>KeyCloak</span>
            </SignInButton>
        );

    return (
        <div className="min-h-main-height-mobile desktop:min-h-main-height flex items-center justify-center">
            <Wrapper>
                <Card>
                    <div className="inset-shadow-3d dark:inset-shadow-dark-3d mx-auto my-8 box-border flex max-w-72 flex-col items-center justify-center p-8">
                        <div className="mb-4">{heading}</div>
                        {buttons}
                    </div>
                </Card>
            </Wrapper>
        </div>
    );
}
