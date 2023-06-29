import {
    PhraseyTranslation,
    PhraseyTranslationStats,
    PhraseyTranslationStatsJson,
} from "./translation";

export interface PhraseySummaryJsonTotalStats {
    set: number;
    defaulted: number;
    unset: number;
    total: number;
}

export interface PhraseySummaryJson {
    total: PhraseySummaryJsonTotalStats;
    individual: Record<string, PhraseyTranslationStatsJson>;
}

export class PhraseySummary {
    totalStats: PhraseySummaryJsonTotalStats = {
        set: 0,
        defaulted: 0,
        unset: 0,
        total: 0,
    };
    individualStats = new Map<string, PhraseyTranslationStats>();

    add(translation: PhraseyTranslation) {
        this.individualStats.set(translation.locale.code, translation.stats);
        this.totalStats.set += translation.stats.setCount;
        this.totalStats.defaulted += translation.stats.defaultedCount;
        this.totalStats.unset += translation.stats.unsetCount;
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
