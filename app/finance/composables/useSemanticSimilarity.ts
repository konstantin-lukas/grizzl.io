import type { FeatureExtractionPipeline } from "@huggingface/transformers";
import { cosineSimilarity } from "~/finance/utils/tensor";

export function useSemanticSimilarity() {
    const embeddingModel: Ref<FeatureExtractionPipeline | null> = ref(null);

    async function getEmbedding(text: string): Promise<number[]> {
        const result = await embeddingModel.value!(text, { pooling: "mean", normalize: false });
        return Array.from(result.data) as number[];
    }

    async function compare(strA: string, strB: string) {
        if (!embeddingModel.value) return null;
        const [embA, embB] = await Promise.all([getEmbedding(strA), getEmbedding(strB)]);
        return cosineSimilarity(embA, embB);
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
    });

    if (embeddingModel.value) {
        return { compare: compare as (strA: string, strB: string) => Promise<number>, isLoading: false };
    }

    return { compare, isLoading: true };
}
