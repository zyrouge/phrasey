import {
    PhraseyTranslation,
    PhraseyTranslationStats,
    PhraseyTranslationStatsJson,
} from "./translation";

export interface PhraseySummaryJson {
    totalStats: PhraseyTranslationStatsJson;
    individualStats: Record<string, PhraseyTranslationStatsJson>;
}

export class PhraseySummary {
    totalStats = new PhraseyTranslationStats();
    individualStats = new Map<string, PhraseyTranslationStats>();

    add(translation: PhraseyTranslation) {
        this.individualStats.set(translation.locale.code, translation.stats);
        this.totalStats.incrementWith(translation.stats);
    }

    json(): PhraseySummaryJson {
        const individualStats: PhraseySummaryJson["individualStats"] = {};
        for (const [locale, stats] of this.individualStats.entries()) {
            individualStats[locale] = stats.json();
        }
        return {
            totalStats: this.totalStats.json(),
            individualStats,
        };
    }
}
