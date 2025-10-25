// types/i18n.d.ts
import type { Composer } from 'vue-i18n'

declare module '#app' {
    interface NuxtApp {
        $t: Composer['t']
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $t: Composer['t']
    }
}

export {}
