import { apollo } from '@/services/graphql';
import WORKSPACES_QUERY from '@/graphql/queries/workspaces.gql';
import CREATE_WORKSPACE from '@/graphql/mutations/createWorkspace.gql';

const namespace = 'workspaces/';

export const WORKSPACES = Object.freeze({
    SET: namespace + 'set',
    GET: namespace + 'get',
    ADD: namespace + 'add',
});

export default {
    state: () => {
        return {
            workspaces: [],
            selected: null,
        };
    },
    mutations: {
        [WORKSPACES.SET]: (state, workspaces) => {
            state.workspaces = workspaces;
            // Always select the first workspace for now
            state.selected = workspaces[0] ? workspaces[0] : null;
        },
    },
    actions: {
        [WORKSPACES.GET]: ({ commit }) => {
            return apollo
                .query({
                    query: WORKSPACES_QUERY,
                    fetchPolicy: 'no-cache',
                })
                .then(res => {
                    commit(WORKSPACES.SET, res.data.allWorkspace);
                });
        },
        [WORKSPACES.ADD]: ({ commit, state }) => {
            return apollo
                .mutate({
                    mutation: CREATE_WORKSPACE,
                })
                .then(({ data: { createWorkspace: { workspace } } }) => {
                    commit(WORKSPACES.SET, [...state.workspaces, workspace]);
                });
        },
    },
    getters: {},
};
