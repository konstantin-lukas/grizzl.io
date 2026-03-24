export function useSemanticSimilarity() {
    const isLoading: Ref<boolean> = ref(false);

    let embeddingModel: any | null = null;
    let loadingPromise: Promise<any> | null = null;
    /** Preload the embedding model in background */
    async function preloadModel() {
        if (!loadingPromise && import.meta.client) {
            const { pipeline, env } = await import("@xenova/transformers");
            env.allowRemoteModels = false;

            env.backends.onnx.wasm.wasmPaths = "/wasm/";
            env.useBrowserCache = true;

            isLoading.value = true;
            loadingPromise = pipeline("feature-extraction", "/paraphrase-multilingual-MiniLM-L12-v2").then(model => {
                embeddingModel = model;
                isLoading.value = false;
                return model;
            });
        }
        return loadingPromise;
    }

    /** Get embedding vector for a string */
    async function getEmbedding(text: string): Promise<number[]> {
        const model = embeddingModel ?? (await preloadModel());
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
    preloadModel();

    return { compareStrings, isLoading, preloadModel };
}
