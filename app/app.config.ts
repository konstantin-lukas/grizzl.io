export default defineAppConfig({
    ui: {
        inputNumber: {
            variants: {
                size: {
                    md: "px-2.5 py-1.5 text-sm gap-1.5",
                    lg: "px-3 py-2 text-sm gap-2",
                },
            },
        },
        input: {
            variants: {
                size: {
                    md: {
                        base: "px-2.5 py-1.5 text-sm gap-1.5",
                    },
                    lg: {
                        base: "px-3 py-2 text-sm gap-2",
                    },
                },
            },
        },
        pinInput: {
            variants: {
                size: {
                    md: {
                        base: "size-8 text-sm",
                    },
                    lg: {
                        base: "size-9 text-sm",
                    },
                },
            },
        },
    },
});
