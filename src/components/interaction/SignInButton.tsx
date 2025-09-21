"use client";

import { signIn } from "next-auth/react";
import type { ReactNode } from "react";

import ButtonLink from "@components/navigation/MenuLink";

export default function SignInButton({
    serviceName,
    children,
    color,
}: {
    serviceName: string;
    children: ReactNode;
    color: string;
}) {
    return (
        <ButtonLink
            color={color}
            data-test-id={`${serviceName}-provider`}
            onClick={() => signIn(serviceName)}
            as="button"
        >
            {children}
        </ButtonLink>
    );
}
