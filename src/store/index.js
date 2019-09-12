import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import auth from './auth';
import locale from './locale';
import projects from './projects';

const store = new Vuex.Store({
    modules: {
        auth,
        locale,
        projects,
    },
});

export default store;
