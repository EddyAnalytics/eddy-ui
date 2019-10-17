<template>
    <main>
        <section class="section">
            <div class="columns">
                <div class="column">
                    <h1 class="title">
                        <go-back-button :projectId="projectId" />
                        Pipeline Builder
                        <span v-if="pipeline && pipeline.label">- {{ pipeline.label }}</span>
                    </h1>
                </div>

                <div class="column has-text-right">
                    <div class="pipeline-active-switch m-r-md">
                        <b-switch :value="true" type="is-success" v-model="isActive">
                            {{ isActive ? 'Activated' : 'Inactive' }}
                        </b-switch>
                    </div>
                    <b-button
                        outlined
                        type="is-info"
                        icon-left="play"
                        class="m-r-sm"
                        @click="executePipeline()"
                    >
                        Execute
                    </b-button>
                    <b-button type="is-primary" icon-left="content-save" @click="savePipeline()">
                        Save
                    </b-button>
                </div>
            </div>
            <div class="columns">
                <div class="column is-3">
                    <pipeline-blocks-panel :blocks="blockTypes" @addBlock="addBlock" />
                    <div class="buttons">
                        <b-button outlined type="is-danger" @click="openDeletePipelineModal()">
                            Delete pipeline
                        </b-button>
                        <b-button outlined type="is-info" @click="loadMockPipeline('flink')">
                            Load Flink demo
                        </b-button>
                        <b-button outlined type="is-info" @click="loadMockPipeline('beam')">
                            Load Beam demo
                        </b-button>
                    </div>
                </div>
                <div class="column">
                    <vue-dag v-model="graphData" @edit="editNode" @delete="deleteNode" />
                </div>
            </div>
        </section>
    </main>
</template>

<style lang="scss">
@import 'vue-dag/src/scss/vue-dag.scss';
</style>

<style lang="scss" scoped>
.pipeline-active-switch {
    display: inline-block;
    line-height: 2.2rem;
}
</style>

<script>
import { Component, Vue } from 'vue-property-decorator';
import GoBackButton from '@/components/general/GoBackButton.vue';
import { TaskGenerationException } from '@/helpers/exceptions';

import { blockTypesMocks } from '@/mocks/pipelineBlockTypes';
import PipelineBlocksPanel from '@/components/pipeline/PipelineBlocksPanel.vue';

import VueDag from 'vue-dag';
import PipelineBuilderBlock from '@/components/pipeline/PipelineBuilderBlock.vue';
import PipelineBlockForm from '@/components/pipeline/PipelineBlockForm.vue';
Vue.component('PipelineBuilderBlock', PipelineBuilderBlock);

import BLOCK_TYPES_QUERY from '@/graphql/queries/blockTypes.gql';

import { pipelineFlinkMock, pipelineBeamMock } from '@/mocks/pipeline';

import PIPELINE_QUERY from '@/graphql/queries/pipeline.gql';
import UPDATE_PIPELINE from '@/graphql/mutations/updatePipeline.gql';
import DELETE_PIPELINE from '@/graphql/mutations/deletePipeline.gql';

import { generateFlinkTask } from '@/helpers/flinkTaskGenerators';
import { generateBeamTask } from '@/helpers/beamTaskGenerators';
import SEND_CELERY_TASK from '@/graphql/mutations/sendCeleryTask.gql';

@Component({
    components: {
        GoBackButton,
        VueDag,
        PipelineBlocksPanel,
    },
})
export default class Pipeline extends Vue {
    blockTypes = [];
    pipeline = {};
    isActive = false;

    graphData = {
        config: {
            scale: 1,
            height: '80vh',
        },
        nodes: [],
        edges: [],
    };

    created() {
        this.projectId = this.$route.params.projectId;
        this.pipelineId = this.$route.params.pipelineId;

        this.$apollo.addSmartQuery('blockTypes', {
            query: BLOCK_TYPES_QUERY,
            result(res) {
                console.log('Block types', res);
                // TODO: Replace with DB data after finishing the endopoint
                this.blockTypes = blockTypesMocks;
            },
        });

        this.$apollo.addSmartQuery('pipeline', {
            query: PIPELINE_QUERY,
            variables: {
                id: this.pipelineId,
            },
            result(res) {
                const pipelineConfigJSON = res.data.pipeline.config;
                const pipelineConfig = JSON.parse(pipelineConfigJSON);
                console.log('Deserialized pipeline config', pipelineConfig);

                if (pipelineConfig.config) {
                    this.graphData.config = pipelineConfig.config;
                }
                if (pipelineConfig.nodes) {
                    this.graphData.nodes = pipelineConfig.nodes;
                }
                if (pipelineConfig.edges) {
                    this.graphData.edges = pipelineConfig.edges;
                }
            },
        });
    }

    loadMockPipeline(type) {
        this.graphData = type === 'beam' ? pipelineBeamMock : pipelineFlinkMock;
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

    addBlock(block) {
        const lastNode = this.graphData.nodes[this.graphData.nodes.length - 1];
        this.graphData.nodes.push({
            id: lastNode ? lastNode.id + 1 : 0,
            x: lastNode ? lastNode.x + 300 : 100,
            y: 300,
            type: block.type,
            component: 'PipelineBuilderBlock',
            properties: {
                component: block.propertiesComponent,
            },
            props: {
                title: block.label,
                type: block.type,
            },
        });
    }

    saveBlock(block) {
        const nodeIndex = this.graphData.nodes.findIndex(node => node.id === block.id);
        if (nodeIndex > -1) {
            this.graphData.nodes.splice(nodeIndex, 1, block);
        }
    }

    showErrorSnackbar(...messages) {
        this.$buefy.snackbar.open({
            message: messages.join(' '),
            type: 'is-danger',
            queue: false,
        });
    }

    async executePipeline() {
        const celeryTasks = this.getCeleryTasks(this.graphData.nodes, this.graphData.edges);

        if (!celeryTasks) return;
        if (!celeryTasks.length) {
            this.showErrorSnackbar('Nothing to run. Define nodes and link them toghether.');
            return;
        }

        console.log('Tasks to submit', celeryTasks);

        celeryTasks.forEach(async task => {
            const res = await this.$apollo.mutate({
                mutation: SEND_CELERY_TASK,
                variables: {
                    taskType: task.taskType,
                    config: JSON.stringify(task.config),
                },
            });

            console.log('Celery Task Sent', task, 'Response: ', res);
        });

        this.$buefy.toast.open('Pipeline executed');
    }

    getCeleryTasks(nodes, edges) {
        let tasks = [];
        for (let node of nodes) {
            if (node.type === 'flink-transform' || node.type === 'beam-transform') {
                try {
                    const inEdges = edges.filter(edge => edge.to === node.id);
                    if (!inEdges.length)
                        throw new TaskGenerationException('Missing incoming edge for node');

                    const outEdges = edges.filter(edge => edge.from === node.id);
                    if (!outEdges.length)
                        throw new TaskGenerationException('Missing outgoing edge for node');

                    const inNodeIds = inEdges.map(edge => edge.from);
                    const inNodes = inNodeIds.map(id => nodes.find(node => node.id === id));

                    const outNodeIds = outEdges.map(edge => edge.to);
                    const outNodes = outNodeIds.map(id => nodes.find(node => node.id === id));

                    const sourceNodes = inNodes.filter(node => node.type === 'source');
                    if (!sourceNodes.length)
                        throw new TaskGenerationException('Missing source node(s) for');

                    const sinkNodes = outNodes.filter(node => node.type === 'sink');
                    if (!sinkNodes.length)
                        throw new TaskGenerationException('Missing sink node(s) for');

                    let task;
                    if (node.type === 'beam-transform') {
                        task = generateBeamTask(sourceNodes, sinkNodes, node);
                    }
                    if (node.type === 'flink-transform') {
                        task = generateFlinkTask(sourceNodes, sinkNodes, node);
                    }
                    if (task) tasks.push(task);
                } catch (e) {
                    if (!(e instanceof TaskGenerationException)) throw e;
                    this.showErrorSnackbar(e.message, node.props.title);
                    return;
                }
            }
        }
        return tasks;
    }

    async savePipeline() {
        await this.$apollo.mutate({
            mutation: UPDATE_PIPELINE,
            variables: {
                id: this.pipelineId,
                label: this.pipeline.label,
                config: JSON.stringify(this.graphData),
            },
        });

        this.$buefy.toast.open('Pipeline saved');
    }

    openDeletePipelineModal() {
        this.$buefy.dialog.confirm({
            title: 'Deleting pipeline',
            message: 'Are you sure you want to <b>delete</b> this pipeline?',
            confirmText: 'Delete pipeline',
            type: 'is-danger',
            hasIcon: true,
            onConfirm: () => this.deletePipeline(),
        });
    }

    async deletePipeline() {
        await this.$apollo.mutate({
            mutation: DELETE_PIPELINE,
            variables: {
                id: this.pipelineId,
            },
        });

        this.$buefy.toast.open('Pipeline deleted');
        this.$router.replace({ name: 'Project', params: { projectId: this.projectId } });
    }
}
</script>
