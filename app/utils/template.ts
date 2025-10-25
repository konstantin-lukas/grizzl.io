export const tw = (strings: TemplateStringsArray, ...values: string[]): string =>
    String.raw({ raw: strings }, ...values);
