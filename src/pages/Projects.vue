<template>
    <main>
        <section class="section">
            <h1 class="title">Projects</h1>
            <div class="columns is-multiline">
                <project-block
                    v-for="project in projects"
                    :key="project.id"
                    :project="project"
                    @click.native="goToProject(project)"
                ></project-block>
                <project-block @click.native="openProjectModal()" />
            </div>
        </section>
    </main>
</template>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import ProjectBlock from '@/components/projects/ProjectBlock';
import { WORKSPACES } from '@/store/workspaces';
import { PROJECTS } from '@/store/projects';
import ProjectForm from '@/components/projects/ProjectForm.vue';

@Component({
    components: {
        ProjectBlock,
        ProjectForm,
    },
})
export default class Projects extends Vue {
    created() {
        this.getProjects();
    }

    async getProjects() {
        await this.$store.dispatch(WORKSPACES.GET);
        await this.$store.dispatch(PROJECTS.GET);
    }

    get workspaces() {
        return this.$store.state.workspaces.workspaces;
    }

    get workspace() {
        return this.$store.state.workspaces.workspace;
    }

    get projects() {
        return this.$store.state.projects.projects;
    }

    openProjectModal(project) {
        this.$buefy.modal.open({
            parent: this,
            component: ProjectForm,
            hasModalCard: true,
            props: project,
            events: { save: this.saveProject },
        });
    }

    saveProject(project) {
        this.$store.dispatch(PROJECTS.ADD, project);
    }

    goToProject(project) {
        this.$router.push({ name: 'Project', params: { projectId: project.id } });
    }
}
</script>
