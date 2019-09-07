/* eslint-disable no-undef */
import '@/router/class-component-hooks';
import '@/api/interceptors';
import Vue from 'vue';
import App from '@/App';
import router from '@/router';
import i18n from '@/languages';
import store from '@/store';
import vmodal from 'vue-js-modal';
import VTooltip from 'v-tooltip';
import VueAxios from 'vue-axios';
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';
import '@/components/general/VueSelect';
import '@/filters';
import { api } from '@/api';

Vue.config.productionTip = false;

// Register the config independent modules.
Vue.use(vmodal);
Vue.use(VTooltip);

// Override the config with the one from /static/config
const configFileName =
    process.env.NODE_ENV === 'production' ? 'config.json' : process.env.NODE_ENV + '.json';

api.get('/config/' + configFileName).then(
    config => {
        Vue.prototype.$config = config;
        Vue.prototype.$config.debug = process.env.NODE_ENV === 'development';

        // Set the baseURL according to the latest config and register the instance.
        api.defaults.baseURL = Vue.prototype.$config.api.url;

        Vue.use(VueAxios, api);

        connectRaven();
        connectAnalytics();

        new Vue({
            el: '#app',
            router,
            i18n,
            store,
            render: h => h(App),
        });
    },
    () => console.log('No configuration file provided.'),
);

// Error reporting configuration: Sentry + Raven
function connectRaven() {
    let config = Vue.prototype.$config;
    if (!config.debug && config.errorTracking && config.errorTracking.enabled) {
        Raven.config(config.errorTracking.url)
            .addPlugin(RavenVue, Vue)
            .install();
    }
}

function connectAnalytics() {
    // Connect analytics if enabled.
    let config = Vue.prototype.$config;
    if (!config.debug && config.analytics && config.analytics.enabled) {
        const VueAnalytics = require('vue-analytics');
        Vue.use(VueAnalytics, {
            id: config.analytics.id,
            router,
            autoTracking: {
                screenview: true,
                pageviewTemplate(route) {
                    return {
                        page: route.path,
                        title: route.name,
                        location: window.location.href,
                    };
                },
            },
        });
    }
}
