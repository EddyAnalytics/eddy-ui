<template>
    <main>
        <section class="section">
            <div class="columns">
                <div class="column">
                    <h1 v-if="pipelineId === 'new'" class="title">New pipeline</h1>
                    <h1 v-else class="title">Edit pipeline</h1>
                    <!-- Project ID: {{ projectId }} Pipeline ID: {{ pipelineId }} -->
                </div>
                <div class="column has-text-right">
                    <b-button type="is-primary" icon-left="content-save" @click="goToProject()">
                        Save
                    </b-button>
                </div>
            </div>
            <div class="columns">
                <div class="column is-3">
                    <pipeline-blocks-panel :blocks="pipelineBlockTemplates" @addBlock="addBlock" />
                </div>
                <div class="column">
                    <vue-dag v-model="graphData" @edit="editNode" @delete="deleteNode" />
                </div>
            </div>
        </section>
    </main>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import PipelineBlocksPanel from '@/components/pipeline/PipelineBlocksPanel.vue';

import VueDag from 'vue-dag';
import PipelineBuilderBlock from '@/components/pipeline/PipelineBuilderBlock.vue';
import PipelineBlockForm from '@/components/pipeline/PipelineBlockForm.vue';
Vue.component('PipelineBuilderBlock', PipelineBuilderBlock);

@Component({
    components: {
        VueDag,
        PipelineBlocksPanel,
    },
})
export default class Pipeline extends Vue {
    graphData = {
        config: {
            scale: 1,
            height: '80vh',
        },
        nodes: [
            {
                id: 0,
                x: 100,
                y: 300,
                component: 'PipelineBuilderBlock',
                props: {
                    title: 'MySQL Database',
                    iconSrc: 'https://bulma.io/images/placeholders/128x128.png',
                },
            },
            {
                id: 1,
                x: 400,
                y: 300,
                component: 'PipelineBuilderBlock',
                props: {
                    title: 'Flink SQL Snippet',
                    iconSrc: 'https://bulma.io/images/placeholders/128x128.png',
                },
            },
            {
                id: 2,
                x: 700,
                y: 300,
                component: 'PipelineBuilderBlock',
                props: {
                    title: 'Kafka Publisher',
                    iconSrc: 'https://bulma.io/images/placeholders/128x128.png',
                },
            },
        ],
        edges: [{ id: 0, from: 0, to: 1 }, { id: 1, from: 1, to: 2 }],
    };

    created() {
        this.projectId = this.$route.params.projectId;
        this.pipelineId = this.$route.params.pipelineId;

        if (this.pipelineId === 'new') {
            this.graphData.nodes = [];
            this.graphData.edges = [];
        }
    }

    editNode(nodeId) {
        const node = this.graphData.nodes.find(node => node.id === nodeId);
        if (node) {
            this.$buefy.modal.open({
                parent: this,
                component: PipelineBlockForm,
                hasModalCard: true,
                props: { block: node },
            });
        }
    }

    deleteNode(nodeId) {
        const index = this.graphData.nodes.findIndex(node => node.id === nodeId);
        if (index > -1) this.graphData.nodes.splice(index, 1);
    }

    pipelineBlockTemplates = [
        {
            disabled: false,
            type: 'source',
            name: 'MySQL Database',
        },
        {
            disabled: true,
            type: 'source',
            name: 'PostgreSQL Database',
        },
        {
            disabled: true,
            type: 'source',
            name: 'MQTT Subscriber',
        },
        {
            disabled: false,
            type: 'source',
            name: 'Kafka Subscriber',
        },
        {
            disabled: false,
            type: 'sink',
            name: 'Kafka Publisher',
        },
        {
            disabled: true,
            type: 'sink',
            name: 'Amazon Redshift',
        },
        {
            disabled: true,
            type: 'sink',
            name: 'MQTT Publisher',
        },
        {
            disabled: false,
            type: 'transformation',
            name: 'Flink SQL Snippet',
        },
        {
            disabled: true,
            type: 'transformation',
            name: 'Join Data Sources',
        },
        {
            disabled: true,
            type: 'transformation',
            name: 'Agregate',
        },
        {
            disabled: true,
            type: 'transformation',
            name: 'Filter',
        },
        { disabled: true, type: 'transformation', name: 'Map', component: 'PipelineBuilderBlock' },
    ];

    addBlock(block) {
        const lastNode = this.graphData.nodes[this.graphData.nodes.length - 1];
        this.graphData.nodes.push({
            id: lastNode ? lastNode.id + 1 : 0,
            x: lastNode ? lastNode.x + 300 : 100,
            y: 300,
            component: 'PipelineBuilderBlock',
            props: {
                title: block.name,
                iconSrc: 'https://bulma.io/images/placeholders/128x128.png',
            },
        });
    }

    saveBlock(block) {
        console.log('Save block', block);
    }

    goToProject() {
        this.$router.push({ name: 'Project', params: { projectId: this.projectId } });
    }
}
</script>

<style lang="scss">
@import 'vue-dag/src/scss/vue-dag.scss';
</style>
