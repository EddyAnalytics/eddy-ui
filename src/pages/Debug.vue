<template>
    <main>
        <section class="section">
            <h1 class="title">Debug - Kitchen Sink</h1>
            <h1 class="subtitle">Workspaces</h1>
            All: {{ workspaces }}
            <br />
            Current:{{ workspace }}
            <br />
            <b-button @click="addWorkspace">Add a default workspace for this user</b-button>
        </section>
        <section class="section">
            <h1 class="subtitle">Projects</h1>
            All: {{ projects }}
            <br />
            Current:{{ project }}
            <br />
            <b-button @click="addProject">Add a project</b-button>
        </section>
    </main>
</template>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import { WORKSPACES } from '@/store/workspaces';
import { PROJECTS } from '@/store/projects';

@Component()
export default class Debug extends Vue {
    created() {
        this.getWorkspaces();
        this.getProjects();
    }

    getWorkspaces() {
        this.$store.dispatch(WORKSPACES.GET);
    }

    getProjects() {
        this.$store.dispatch(PROJECTS.GET);
    }

    get workspaces() {
        return this.$store.state.workspaces.workspaces;
    }

    get workspace() {
        return this.$store.state.workspaces.selected;
    }

    addWorkspace() {
        this.$store.dispatch(WORKSPACES.ADD);
    }

    get projects() {
        return this.$store.state.projects.projects;
    }

    get project() {
        return this.$store.state.projects.selected;
    }

    addProject() {
        this.$store.dispatch(PROJECTS.ADD);
    }
}
</script>
