import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

import en from './en.json';

const messages = {
    en,
};

export const DEFAULT_LANGUAGE = 'en';
export const LANGUAGES = [DEFAULT_LANGUAGE, 'nl'];

// Create a new vuei18n object with the locale and all messages.
const i18n = new VueI18n({
    locale: DEFAULT_LANGUAGE,
    messages,
});

export default i18n;
