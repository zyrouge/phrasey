import {
    PhraseyTranslation,
    PhraseyTranslationStats,
    PhraseyTranslationStatsJson,
} from "./translation";

export interface PhraseySummaryJsonTotalStats {
    setCount: number;
    fallbackCount: number;
    unsetCount: number;
    total: number;
}

export interface PhraseySummaryJson {
    total: PhraseySummaryJsonTotalStats;
    individual: Record<string, PhraseyTranslationStatsJson>;
}

export class PhraseySummary {
    totalStats: PhraseySummaryJsonTotalStats = {
        setCount: 0,
        fallbackCount: 0,
        unsetCount: 0,
        total: 0,
    };
    individualStats = new Map<string, PhraseyTranslationStats>();

    add(translation: PhraseyTranslation) {
        this.individualStats.set(translation.locale.code, translation.stats);
        this.totalStats.setCount += translation.stats.setCount;
        this.totalStats.fallbackCount += translation.stats.fallbackCount;
        this.totalStats.unsetCount += translation.stats.unsetCount;
        this.totalStats.total += translation.stats.total;
    }

    json(): PhraseySummaryJson {
        const individual: PhraseySummaryJson["individual"] = {};
        for (const [locale, stats] of this.individualStats.entries()) {
            individual[locale] = stats.json();
        }
        return {
            total: this.totalStats,
            individual,
        };
    }
}
