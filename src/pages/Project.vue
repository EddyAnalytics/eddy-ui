<template>
    <div>
        <div class="col-12">
            <h1>Project</h1>
        </div>
        <div class="col-12">
            <div class="row">
                {{ project }}
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component({
    components: {},
})
export default class Project extends Vue {
    get projects() {
        return this.$store.state.projects.projects;
    }

    get project() {
        return this.$store.state.projects.projects[this.projectId];
    }

    created() {
        this.projectId = this.$route.params.projectId;
    }
}
</script>
