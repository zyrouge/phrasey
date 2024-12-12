import {
    PhraseyTranslation,
    PhraseyTranslationStats,
    PhraseyTranslationStatsJson,
} from "./translation";

export interface PhraseySummaryOptions {
    keysCount: number;
}

export interface PhraseySummaryJsonTotalStats {
    keysCount: number;
    setCount: number;
    fallbackCount: number;
    unsetCount: number;
    unknownCount: number;
    total: number;
}

export interface PhraseySummaryJson {
    full: PhraseySummaryJsonTotalStats;
    individual: Record<string, PhraseyTranslationStatsJson>;
}

export class PhraseySummary {
    fullStats: PhraseySummaryJsonTotalStats = {
        keysCount: 0,
        setCount: 0,
        fallbackCount: 0,
        unsetCount: 0,
        unknownCount: 0,
        total: 0,
    };
    individualStats = new Map<string, PhraseyTranslationStats>();

    constructor(public options: PhraseySummaryOptions) {
        this.fullStats.keysCount = options.keysCount;
    }

    add(translation: PhraseyTranslation) {
        this.individualStats.set(translation.locale.code, translation.stats);
        this.fullStats.setCount += translation.stats.setCount;
        this.fullStats.fallbackCount += translation.stats.fallbackCount;
        this.fullStats.unsetCount += translation.stats.unsetCount;
        this.fullStats.unknownCount += translation.stats.unknownCount;
        this.fullStats.total += translation.stats.total;
    }

    json(): PhraseySummaryJson {
        const individual: PhraseySummaryJson["individual"] = {};
        for (const [locale, stats] of this.individualStats.entries()) {
            individual[locale] = stats.json();
        }
        return {
            full: this.fullStats,
            individual,
        };
    }
}
