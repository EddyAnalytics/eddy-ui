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
                    <b-button type="is-primary" icon-left="content-save" @click="savePipeline()">
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

import SEND_CELERY_TASK from '@/graphql/mutations/sendCeleryTask.gql';

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
                type: 'source',
                component: 'PipelineBuilderBlock',
                properties: {
                    component: 'KafkaPublisherProperties',
                    topic: 'mysql1.inventory.customers',
                },
                props: {
                    title: 'Kafka Subscriber',
                    type: 'source',
                },
            },
            {
                id: 1,
                x: 400,
                y: 300,
                type: 'transformation',
                component: 'PipelineBuilderBlock',
                properties: {
                    component: 'FlinkSQLProperties',
                    inSchema:
                        '{\n"payload": "ROW<`ts_ms` LONG, after ROW<`id` LONG, first_name VARCHAR, last_name VARCHAR, email VARCHAR>, before ROW<`id` LONG, first_name VARCHAR, last_name VARCHAR, email VARCHAR>>"\n}',
                    outSchema: '{\n"id": "LONG",\n"value": "LONG"\n}',
                    sqlQuery: `INSERT INTO sql_results \nSELECT payload.after.id, payload.before.id \nFROM customers`,
                },
                props: {
                    title: 'Flink SQL Snippet',
                    type: 'transformation',
                },
            },
            {
                id: 2,
                x: 700,
                y: 300,
                type: 'sink',
                component: 'PipelineBuilderBlock',
                properties: {
                    component: 'KafkaPublisherProperties',
                    topic: 'sql_results',
                },
                props: {
                    title: 'Kafka Publisher',
                    type: 'sink',
                    iconSrc: '/img/pipeline/sink.png',
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
                events: { save: this.saveBlock },
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
            label: 'MySQL Database',
        },
        {
            disabled: true,
            type: 'source',
            label: 'PostgreSQL Database',
        },
        {
            disabled: true,
            type: 'source',
            label: 'MQTT Subscriber',
        },
        {
            disabled: false,
            type: 'source',
            label: 'Kafka Subscriber',
        },
        {
            disabled: false,
            type: 'sink',
            label: 'Kafka Publisher',
        },
        {
            disabled: true,
            type: 'sink',
            label: 'Amazon Redshift',
        },
        {
            disabled: true,
            type: 'sink',
            label: 'MQTT Publisher',
        },
        {
            disabled: false,
            type: 'transformation',
            label: 'Flink SQL Snippet',
        },
        {
            disabled: true,
            type: 'transformation',
            label: 'Join Data Sources',
        },
        {
            disabled: true,
            type: 'transformation',
            label: 'Agregate',
        },
        {
            disabled: true,
            type: 'transformation',
            label: 'Filter',
        },
        {
            disabled: true,
            type: 'transformation',
            label: 'Map',
        },
    ];

    addBlock(block) {
        const lastNode = this.graphData.nodes[this.graphData.nodes.length - 1];
        this.graphData.nodes.push({
            id: lastNode ? lastNode.id + 1 : 0,
            x: lastNode ? lastNode.x + 300 : 100,
            y: 300,
            type: block.type,
            component: 'PipelineBuilderBlock',
            props: {
                title: block.label,
                type: block.type,
            },
        });
    }

    saveBlock(block) {
        const nodeIndex = this.graphData.nodes.findIndex(node => node.id === block.id);
        console.log(block, nodeIndex);
        if (nodeIndex > -1) {
            this.graphData.nodes.splice(nodeIndex, 1, block);
        }
    }

    goToProject() {
        this.$router.push({ name: 'Project', params: { projectId: this.projectId } });
    }

    savePipeline() {
        const inputTopic = this.graphData.nodes[0].properties.topic;
        const outputTopic = this.graphData.nodes[2].properties.topic;
        const inSchema = this.graphData.nodes[1].properties.inSchema;
        const outSchema = this.graphData.nodes[1].properties.outSchema;
        const sqlQuery = this.graphData.nodes[1].properties.sqlQuery;

        this.$apollo
            .mutate({
                mutation: SEND_CELERY_TASK,
                variables: {
                    inSchema,
                    inputTopic,
                    outSchema,
                    outputTopic,
                    sqlQuery,
                },
            })
            .then(res => {
                console.log(
                    'Celery Task Sent',
                    { inSchema, inputTopic, outSchema, outputTopic, sqlQuery },
                    'Response: ',
                    res,
                );
                this.$buefy.toast.open('Pipeline saved');
            });
    }
}
</script>

<style lang="scss">
@import 'vue-dag/src/scss/vue-dag.scss';
</style>
