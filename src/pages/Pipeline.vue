<template>
    <main>
        <section class="section">
            <h1 class="title">Pipeline Builder</h1>
            Project ID: {{ projectId }} Pipeline ID: {{ pipelineId }}
        </section>
    </main>
</template>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component({
    components: {},
})
export default class Pipeline extends Vue {
    created() {
        this.projectId = this.$route.params.projectId;
        this.pipelineId = this.$route.params.pipelineId;
    }
}
</script>
