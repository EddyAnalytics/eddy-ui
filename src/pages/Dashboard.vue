<template>
    <main>
        <section class="section">
            <h1 class="title">Projects</h1>
            <div class="columns is-multiline">
                <project-block
                    v-for="project in projects"
                    :key="project.id"
                    :project="project"
                    @click.native="redirectToProject(project)"
                ></project-block>
            </div>
        </section>
    </main>
</template>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import ProjectBlock from '@/components/dashboard/ProjectBlock';

@Component({
    components: {
        ProjectBlock,
    },
})
export default class Dashboard extends Vue {
    get projects() {
        return this.$store.state.projects.projects;
    }

    redirectToProject(project) {
        this.$router.push({ name: 'Project', params: { projectId: project.id } });
    }
}
</script>
