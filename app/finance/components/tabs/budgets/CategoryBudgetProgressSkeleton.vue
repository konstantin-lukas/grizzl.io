<template>
    <div>
        <USkeleton class="relative aspect-square w-full rounded-full">
            <div
                class="center absolute top-1/2 left-1/2 size-[calc(100%-2rem)] -translate-1/2 rounded-full bg-back xs:size-[calc(100%-3rem)] md:size-[calc(100%-5rem)]"
            >
                <div>
                    <USkeleton class="mx-auto size-8 rounded-full xs:size-12" />
                    <USkeleton class="mx-auto mt-2 h-6 w-12" />
                </div>
            </div>
        </USkeleton>
        <USkeleton class="mx-auto mt-4 h-5 max-w-30" />
        <USkeleton class="mx-auto mt-2 h-5 max-w-50" />
    </div>
</template>
