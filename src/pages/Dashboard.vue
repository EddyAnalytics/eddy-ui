<template>
    <div>
        <div class="col-12">
            <h1>Projects</h1>
        </div>
        <div class="col-12">
            <div class="row">
                <project-block
                    v-for="project in projects"
                    :key="project.id"
                    :project="project"
                    @click.native="redirectToProject(project)"
                ></project-block>
            </div>
        </div>

        <div class="col-12">
            <h1>Activity</h1>
        </div>
        <div class="col-12">
            <div class="row"></div>
        </div>
    </div>
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
