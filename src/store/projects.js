import { apollo } from '@/services/graphql';
import PROJECTS_QUERY from '@/graphql/queries/projects.gql';
import CREATE_PROJECT from '@/graphql/mutations/createProject.gql';
import DELETE_PROJECT from '@/graphql/mutations/deleteProject.gql';

const namespace = 'projects/';

export const PROJECTS = Object.freeze({
    SET: namespace + 'set',
    GET: namespace + 'get',
    ADD: namespace + 'add',
});

export default {
    state: () => {
        return {
            projects: [],
            selected: null,
        };
    },
    mutations: {
        [PROJECTS.SET]: (state, projects) => {
            state.projects = projects;
        },
    },
    actions: {
        [PROJECTS.GET]: ({ commit }) => {
            return apollo
                .query({
                    query: PROJECTS_QUERY,
                    fetchPolicy: 'no-cache',
                })
                .then(res => {
                    commit(PROJECTS.SET, res.data.allProjects);
                });
        },
        [PROJECTS.ADD]: (
            { commit, state, rootState },
            { workspaceId = rootState.workspaces.selected.id } = {},
        ) => {
            return apollo
                .mutate({
                    mutation: CREATE_PROJECT,
                    variables: {
                        workspaceId: workspaceId,
                    },
                })
                .then(({ data: { createProject: { project } } }) => {
                    commit(PROJECTS.SET, [...state.projects, project]);
                });
        },
        [PROJECTS.DELETE]: ({ commit, state }) => {
            return apollo
                .mutate({
                    mutation: DELETE_PROJECT,
                })
                .then(({ data: { deleteProject: { project } } }) => {
                    commit(PROJECTS.SET, state.projects.filter(p => p.id === project.id));
                });
        },
    },
    getters: {},
};
