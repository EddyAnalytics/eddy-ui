<template>
    <main>
        <section class="section">
            <h1 class="title">Pipeline Builder</h1>
            Project ID: {{ projectId }} Pipeline ID: {{ pipelineId }}

            <div class="columns">
                <div class="column is-3"></div>
                <div class="column">
                    <vue-dag v-model="graphData"></vue-dag>
                </div>
            </div>
        </section>
    </main>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import VueDag from 'vue-dag';

import PipelineBlockDB from '@/components/pipeline/PipelineBlockDB.vue';

Vue.component('PipelineBlockDB', PipelineBlockDB);

@Component({
    components: {
        VueDag,
    },
})
export default class Pipeline extends Vue {
    graphData = {
        config: {
            scale: 1,
            height: '85vh',
        },
        nodes: [
            {
                id: 0,
                x: 200,
                y: 400,
                component: 'PipelineBlockDB',
            },
            {
                id: 1,
                x: 500,
                y: 400,
            },
            {
                id: 2,
                x: 800,
                y: 400,
            },
        ],
        edges: [{ from: 0, to: 1 }],
    };

    created() {
        this.projectId = this.$route.params.projectId;
        this.pipelineId = this.$route.params.pipelineId;
    }
}
</script>

<style lang="scss">
@import 'vue-dag/src/scss/vue-dag.scss';
</style>
