<template>
    <main>
        <section class="section">
            <h1 class="title">Dashboard</h1>
            Project ID: {{ projectId }} Dashboard ID: {{ pipelineId }}
        </section>
    </main>
</template>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component({
    components: {},
})
export default class Dashboard extends Vue {
    created() {
        this.projectId = this.$route.params.projectId;
        this.dashboardId = this.$route.params.dashboardId;
    }
}
</script>
