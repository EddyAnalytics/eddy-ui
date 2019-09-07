import { api } from '@/api';

const namespace = 'auth/';

export const AUTH = Object.freeze({
    SET_USER: namespace + 'set_user',
    LOGIN: namespace + 'login',
    LOGOUT: namespace + 'logout',
    IS_AUTHENTICATED: namespace + 'is_authenticated',
    GET_USERNAME: namespace + 'username',
});

export default {
    state: () => {
        return {
            token: window.localStorage.getItem('token'),
            username: window.localStorage.getItem('username'),
        };
    },
    mutations: {
        [AUTH.SET_USER]: (state, details) => {
            if (details) {
                state.token = details.token;
                state.username = details.name;
                window.localStorage.setItem('token', details.token);
                window.localStorage.setItem('username', details.name);
            } else {
                state.token = false;
                state.username = null;
                window.localStorage.removeItem('token');
                window.localStorage.removeItem('username');
            }
        },
    },
    actions: {
        [AUTH.LOGIN]: ({ commit }, { email, password }) => {
            return api.post('login', { email, password }).then(
                data => {
                    commit(AUTH.SET_USER, {
                        token: data.token,
                        name: email,
                    });
                },
                error => {
                    commit(AUTH.SET_USER, null);
                    throw error;
                },
            );
        },
        [AUTH.LOGOUT]: ({ commit }) => {
            commit(AUTH.SET_USER, null);
        },
    },
    getters: {
        [AUTH.IS_AUTHENTICATED]: state => !!state.token,
        [AUTH.GET_USERNAME]: state => state.username,
    },
};
