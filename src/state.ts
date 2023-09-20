import { PhraseyConfig } from "./config";
import { PhraseyError } from "./errors";
import { PhraseyHooks } from "./hooks";
import { PhraseyLocales } from "./locales";
import { Phrasey } from "./phrasey";
import { PhraseySchema } from "./schema";
import { PhraseyTranslations } from "./translations";

export interface PhraseyStateOptions {
    config?: PhraseyConfig;
    hooks?: PhraseyHooks;
    schema?: PhraseySchema;
    locales?: PhraseyLocales;
    translations?: PhraseyTranslations;
}

export class PhraseyState {
    _config?: PhraseyConfig;
    _hooks?: PhraseyHooks;
    _schema?: PhraseySchema;
    _locales?: PhraseyLocales;
    _translations?: PhraseyTranslations;

    constructor(
        public phrasey: Phrasey,
        public options: PhraseyStateOptions,
    ) {
        this.setConfig(options.config);
        this.setHooks(options.hooks);
        this.setSchema(options.schema);
        this.setLocales(options.locales);
        this.setTranslations(options.translations);
    }

    hasConfig() {
        return this._config !== undefined;
    }

    getConfig() {
        if (!this.hasConfig()) {
            throw new PhraseyError("State does not possess config");
        }
        return this._config!;
    }

    setConfig(config?: PhraseyConfig) {
        this._config = config;
    }

    hasHooks() {
        return this._hooks !== undefined;
    }

    getHooks() {
        if (!this.hasHooks()) {
            throw new PhraseyError("State does not possess hooks");
        }
        return this._hooks!;
    }

    setHooks(hooks?: PhraseyHooks) {
        this._hooks = hooks;
    }

    hasSchema() {
        return this._schema !== undefined;
    }

    getSchema() {
        if (!this.hasSchema()) {
            throw new PhraseyError("State does not possess schema");
        }
        return this._schema!;
    }

    setSchema(schema?: PhraseySchema) {
        this._schema = schema;
    }

    hasLocales() {
        return this._locales !== undefined;
    }

    getLocales() {
        if (!this.hasLocales()) {
            throw new PhraseyError("State does not possess locales");
        }
        return this._locales!;
    }

    setLocales(locales?: PhraseyLocales) {
        this._locales = locales;
    }

    hasTranslations() {
        return this._translations !== undefined;
    }

    getTranslations() {
        if (!this.hasTranslations()) {
            throw new PhraseyError("State does not possess translations");
        }
        return this._translations!;
    }

    setTranslations(translations?: PhraseyTranslations) {
        this._translations = translations;
    }
}
