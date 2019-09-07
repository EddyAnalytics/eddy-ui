import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import auth from './auth';
import locale from './locale';

const store = new Vuex.Store({
    modules: {
        auth,
        locale,
    },
});

export default store;
