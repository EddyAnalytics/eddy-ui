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
            </div>
        </section>
    </main>
</template>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import ProjectBlock from '@/components/projects/ProjectBlock';

@Component({
    components: {
        ProjectBlock,
    },
})
export default class Projects extends Vue {
    get projects() {
        return this.$store.state.projects.projects;
    }

    goToProject(project) {
        this.$router.push({ name: 'Project', params: { projectId: project.id } });
    }
}
</script>
