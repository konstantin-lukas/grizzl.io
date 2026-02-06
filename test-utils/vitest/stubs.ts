export const UTooltip = {
    template: `
        <div>
            <slot />
            <div class="tooltip">
                <slot name="content" />
            </div>
        </div>
    `,
};
