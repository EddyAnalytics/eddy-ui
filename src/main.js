/* eslint-disable no-undef */
import '@/router/class-component-hooks';
import '@/api/interceptors';
import Vue from 'vue';
import App from '@/App';
import Buefy from 'buefy';
import router from '@/router';
import i18n from '@/languages';
import store from '@/store';
import vmodal from 'vue-js-modal';
import VTooltip from 'v-tooltip';
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';
import '@/components/general/VueSelect';
import '@/filters';

Vue.use(Buefy);

import VueAxios from 'vue-axios';
import { api } from '@/api';

import VueApollo from 'vue-apollo';
import { createProvider } from '@/services/vue-apollo';

Vue.config.productionTip = false;

// Register the config independent modules.
Vue.use(vmodal);
Vue.use(VTooltip);

// Override the config with the one from /static/config
const nodeEnvName = process.env.NODE_ENV;
const configFileName = nodeEnvName === 'production' ? 'config.json' : nodeEnvName + '.json';

api.get('/config/' + configFileName).then(
    config => {
        Vue.prototype.$config = {
            ...config,
            debug: config.debug || nodeEnvName === 'development',
        };

        // Set the API default URL
        api.defaults.baseURL = config.api.url;

        // Register Axios HTTP client
        Vue.use(VueAxios, api);

        // Register the Apollo GraphQL client
        Vue.use(VueApollo);

        const apolloOptions = {
            httpEndpoint: config.graphql.httpEndpoint,
            wsEndpoint: config.graphql.wsEndpoint,
        };

        connectRaven();
        connectAnalytics();

        new Vue({
            el: '#app',
            router,
            i18n,
            store,
            apolloProvider: createProvider(apolloOptions),
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
