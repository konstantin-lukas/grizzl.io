import type { FeatureExtractionPipeline } from "@huggingface/transformers";

export function useSemanticSimilarity() {
    const isLoading: Ref<boolean> = ref(false);
    const loadingPromise: Ref<Promise<FeatureExtractionPipeline> | null> = ref(null);
    const embeddingModel: Ref<FeatureExtractionPipeline | null> = ref(null);

    /** Preload the embedding model in background */
    async function preloadModel() {
        if (!loadingPromise.value && import.meta.client) {
            loadingPromise.value = (async () => {
                const { pipeline, env } = await import("@huggingface/transformers");

                env.allowRemoteModels = false;
                env.allowLocalModels = true;
                env.useBrowserCache = true;
                env.backends.onnx.wasm!.wasmPaths = "/wasm/";

                isLoading.value = true;

                const model = await pipeline("feature-extraction", "Xenova/paraphrase-multilingual-MiniLM-L12-v2", {
                    dtype: "uint8",
                });

                embeddingModel.value = model;
                isLoading.value = false;

                return model;
            })();
        }

        return await loadingPromise.value!;
    }

    /** Get embedding vector for a string */
    async function getEmbedding(text: string): Promise<number[]> {
        const model = embeddingModel.value ?? (await preloadModel());
        const result = await model(text, { pooling: "mean", normalize: false });
        return Array.from(result.data) as number[];
    }

    /** Cosine similarity between two vectors */
    function cosineSimilarity(vecA: number[], vecB: number[]): number {
        let dot = 0;
        let magA = 0;
        let magB = 0;
        for (let i = 0; i < vecA.length; i++) {
            dot += vecA[i]! * vecB[i]!;
            magA += vecA[i]! ** 2;
            magB += vecB[i]! ** 2;
        }
        return dot / (Math.sqrt(magA) * Math.sqrt(magB));
    }

    /** Compare semantic similarity between two strings */
    async function compareStrings(strA: string, strB: string) {
        const [embA, embB] = await Promise.all([getEmbedding(strA), getEmbedding(strB)]);
        return cosineSimilarity(embA, embB);
    }

    // Load model in background immediately
    if (import.meta.client) {
        preloadModel();
    }

    return { compareStrings, isLoading, preloadModel };
}
