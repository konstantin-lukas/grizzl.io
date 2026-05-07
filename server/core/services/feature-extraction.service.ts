import LoggerService from "#server/core/services/logger.service";
import { IconTagsMap } from "#shared/core/maps/icon-tags.map";
import { type FeatureExtractionPipeline, env, pipeline } from "@huggingface/transformers";

/* c8 ignore start */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class FeatureExtractionService {
    static instance: FeatureExtractionPipeline | null = null;
    static iconEmbeddings: [string, number[]][] | null = null;

    static cosineSimilarity(vectorA: number[], vectorB: number[]) {
        let dotProduct = 0;
        let magnitudeA = 0;
        let magnitudeB = 0;
        for (let i = 0; i < vectorA.length; i++) {
            dotProduct += vectorA[i]! * vectorB[i]!;
            magnitudeA += vectorA[i]! ** 2;
            magnitudeB += vectorB[i]! ** 2;
        }
        return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
    }

    static async getEmbedding(text: string): Promise<number[]> {
        if (!this.instance) return [];
        const result = await this.instance(text, { pooling: "mean", normalize: false });
        return Array.from(result.data) as number[];
    }

    static async initialize() {
        const logger = new LoggerService();
        if (this.instance === null) {
            env.localModelPath = "./models";
            env.allowRemoteModels = false;

            // @ts-ignore Expression produces a union type that is too complex to represent
            this.instance = await pipeline("feature-extraction", "Xenova/paraphrase-multilingual-MiniLM-L12-v2", {
                dtype: "uint8",
            });
            logger.info("Extraction pipeline ready!");
        }

        if (!this.iconEmbeddings) {
            this.iconEmbeddings = await Promise.all(
                Object.entries(IconTagsMap).map(async ([icon, tags]) => [icon, await this.getEmbedding(tags)] as const),
            );
            logger.info("Icon embeddings ready!");
        }

        return this.instance;
    }

    static async getClosestMatch(input: string) {
        await this.initialize();
        if (!this.iconEmbeddings || !this.instance) return null;
        const inputEmbedding = await this.getEmbedding(input);
        const similarities = await Promise.all(
            this.iconEmbeddings.map(async ([icon, tagEmbedding]) => ({
                icon,
                similarity: this.cosineSimilarity(inputEmbedding, tagEmbedding) ?? 0,
            })),
        );
        const closestMatch = similarities.reduce((max, current) =>
            current.similarity > max.similarity ? current : max,
        );
        return closestMatch as { icon: keyof typeof IconTagsMap; similarity: number };
    }
}
/* c8 ignore stop */
