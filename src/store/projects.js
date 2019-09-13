import { api } from '@/api';

const namespace = 'projects/';

export const PROJECTS = Object.freeze({
    SET: namespace + 'set',
    GET: namespace + 'get',
});

export default {
    state: () => {
        return {
            projects: [
                {
                    id: 0,
                    name: 'El Nino - Test Project',
                    logo: '/img/projects/elnino.svg',
                },
                {
                    id: 1,
                    name: 'El Nino - Sentiment Analysis',
                    logo: '/img/projects/elnino.svg',
                },
                {
                    id: 2,
                    name: 'Takeaway.com - Loyalty',
                    logo: '/img/projects/thuisbezorgd.svg',
                },
                {
                    id: 3,
                    name: 'WGV - ePortfolio',
                    logo: '/img/projects/eportfolio.svg',
                },
            ],
        };
    },
    mutations: {
        [PROJECTS.SET]: (state, projects) => {
            state.projects = projects;
        },
    },
    actions: {
        [PROJECTS.GET]: ({ commit }, { email, password }) => {
            return api.projects('login', { email, password }).then(
                data => {
                    commit(PROJECTS.SET, {
                        projects: data,
                    });
                },
                error => {
                    throw error;
                },
            );
        },
    },
    getters: {},
};
