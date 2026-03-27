import type { FeatureExtractionPipeline } from "@huggingface/transformers";
import { cosineSimilarity } from "~/finance/utils/tensor";
import { CategoryIconsMap } from "~~/shared/finance/maps/category-icons.map";

export default function useIconSuggestion() {
    const embeddingModel: Ref<FeatureExtractionPipeline | null> = ref(null);
    const icons = ref<[string, number[]][] | null>(null);

    async function getEmbedding(text: string): Promise<number[]> {
        const result = await embeddingModel.value!(text, { pooling: "mean", normalize: false });
        return Array.from(result.data) as number[];
    }

    onMounted(async () => {
        if (!import.meta.client) return;

        const { pipeline, env } = await import("@huggingface/transformers");

        env.allowRemoteModels = false;
        env.allowLocalModels = true;
        env.useBrowserCache = true;
        env.backends.onnx.wasm!.wasmPaths = "/wasm/";

        // @ts-expect-error Expression produces a union type that is too complex to represent
        embeddingModel.value = await pipeline("feature-extraction", "Xenova/paraphrase-multilingual-MiniLM-L12-v2", {
            dtype: "uint8",
        });

        icons.value = await Promise.all(
            Object.entries(CategoryIconsMap).map(async ([icon, tags]) => [icon, await getEmbedding(tags)] as const),
        );
    });

    return async (input: string) => {
        if (!icons.value) return null;
        const inputEmbedding = await getEmbedding(input);
        const similarities = await Promise.all(
            icons.value.map(async ([icon, tagEmbedding]) => ({
                icon,
                similarity: cosineSimilarity(inputEmbedding, tagEmbedding) ?? 0,
            })),
        );
        const closestMatch = similarities.reduce((max, current) =>
            current.similarity > max.similarity ? current : max,
        );
        return closestMatch.icon as keyof typeof CategoryIconsMap;
    };
}
