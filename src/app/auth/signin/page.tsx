import { Card } from "@heroui/card";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

import Discord from "@component/icon/oauth-service/Discord";
import GitHub from "@component/icon/oauth-service/GitHub";
import Keycloak from "@component/icon/oauth-service/Keycloak";
import Reddit from "@component/icon/oauth-service/Reddit";
import Spotify from "@component/icon/oauth-service/Spotify";
import Twitch from "@component/icon/oauth-service/Twitch";
import SignInButton from "@component/interaction/SignInButton";
import Wrapper from "@component/layout/Wrapper";
import H1 from "@component/typography/H1";

export default async function Page(context: { searchParams: Promise<{ callbackUrl: string }> }) {
    const session = await getServerSession();
    if (session?.user) redirect((await context.searchParams)?.callbackUrl ?? "/");

    const heading = <H1>Sign In</H1>;

    const buttons =
        process.env.APP_ENV === "production" ? (
            <>
                <SignInButton color="bg-emerald-700" serviceName="discord">
                    <Discord className="size-5 fill-back" />
                    <span>Discord</span>
                </SignInButton>
                <SignInButton color="bg-cyan-700" serviceName="github">
                    <GitHub className="size-5 fill-back" />
                    <span>GitHub</span>
                </SignInButton>
                <SignInButton color="bg-purple-700" serviceName="reddit">
                    <Reddit className="size-5 fill-back" />
                    <span>Reddit</span>
                </SignInButton>
                <SignInButton color="bg-rose-700" serviceName="twitch">
                    <Twitch className="size-4 stroke-back" />
                    <span>Twitch</span>
                </SignInButton>
                <SignInButton color="bg-amber-700" serviceName="spotify">
                    <Spotify className="size-5 fill-back" />
                    <span>Spotify</span>
                </SignInButton>
            </>
        ) : (
            <SignInButton color="bg-emerald-700" serviceName="keycloak">
                <Keycloak className="size-4 fill-back" />
                <span>Keycloak</span>
            </SignInButton>
        );

    return (
        <div className="flex min-h-main-height-no-padding items-center justify-center">
            <Wrapper>
                <div className="flex items-center justify-center">
                    <Card>
                        <div className="flex flex-col items-center justify-center gap-4 px-10 pt-6 pb-8">
                            {heading}
                            {buttons}
                        </div>
                    </Card>
                </div>
            </Wrapper>
        </div>
    );
}
