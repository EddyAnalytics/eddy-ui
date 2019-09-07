import i18n from '@/languages';
import { LANGUAGES, DEFAULT_LANGUAGE } from '@/languages';
import moment from 'moment';

const namespace = 'locale/';

export const LOCALE = Object.freeze({
    SET: namespace + 'set_locale',
    GET: namespace + 'get_locale',
});

const STORAGE_KEY = 'lang';

/**
 * Sets the language and updates settings across used modules to use the new language
 * @param {String} localeCode
 */
function applyLocale(localeCode) {
    i18n.locale = localeCode;
    moment.locale(localeCode);
}

export default {
    state: () => {
        const code = window.localStorage.getItem(STORAGE_KEY) || DEFAULT_LANGUAGE;
        applyLocale(code);
        return {
            language: code,
        };
    },
    mutations: {
        [LOCALE.SET]: (state, localeCode) => {
            state.language = localeCode;
            applyLocale(localeCode);
            window.localStorage.setItem(STORAGE_KEY, localeCode);
        },
    },
    actions: {
        [LOCALE.SET]: ({ commit }, localeCode) => {
            console.assert(LANGUAGES.includes(localeCode));
            commit(LOCALE.SET, localeCode);
        },
    },
    getters: {
        [LOCALE.GET]: state => state.language,
    },
};
