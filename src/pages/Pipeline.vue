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
                    <b-button
                        outlined
                        v-if="model.status === 'active'"
                        type="is-danger"
                        icon-left="stop"
                        class="m-r-sm"
                        @click="stopPipeline()"
                    >
                        Stop
                    </b-button>
                    <b-button
                        v-if="model.status === 'inactive'"
                        outlined
                        type="is-info"
                        icon-left="play"
                        class="m-r-sm"
                        @click="executePipeline()"
                    >
                        Execute
                    </b-button>
                    <b-button
                        v-if="model.status === 'pending'"
                        type="is-warning"
                        icon-left="dots-horizontal"
                        class="m-r-sm"
                    >
                        Pending
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
                    <vue-dag v-model="model" @edit="editNode" @delete="deleteNode" />
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

<style lang="scss">
.snackbar {
    max-width: none !important;
}
</style>
<script>
import { Component, Vue } from 'vue-property-decorator';
import GoBackButton from '@/components/general/GoBackButton.vue';
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

import { generateCeleryTasks } from '@/services/task/tasksService';
import SEND_CELERY_TASK from '@/graphql/mutations/sendCeleryTask.gql';

import KAFKA_TOPICS_ACTIVITY from '@/graphql/subscriptions/kafkaTopicsActivity.gql';

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

    model = {
        status: 'inactive',
        config: {
            scale: 1,
            height: '80vh',
        },
        nodes: [],
        edges: [],
    };

    created() {
        this.projectId = +this.$route.params.projectId;
        this.pipelineId = +this.$route.params.pipelineId;

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
                console.log('Pipeline config', { config: pipelineConfigJSON });
                console.log('Deserialized pipeline config', pipelineConfig);

                if (pipelineConfig.status) {
                    this.model.status = pipelineConfig.status;
                }

                if (pipelineConfig.config) {
                    this.model.config = pipelineConfig.config;
                }
                if (pipelineConfig.nodes) {
                    this.model.nodes = pipelineConfig.nodes;
                }
                if (pipelineConfig.edges) {
                    this.model.edges = pipelineConfig.edges;
                }
            },
        });

        this.$apollo.addSmartSubscription('topicsActivity', {
            query: KAFKA_TOPICS_ACTIVITY,
            variables() {
                return {
                    topics: [`${this.projectId}.${this.pipelineId}.feedback`],
                };
            },
            result({ data: { topicsActivity } }) {
                this.model.status = topicsActivity.success ? 'active' : 'inactive';
                this.savePipeline();
                this.$buefy.snackbar.open({
                    message: topicsActivity.success
                        ? 'Succesfully started execution'
                        : topicsActivity.error.slice(620, 1000),
                    type: topicsActivity.success ? 'is-info' : 'is-danger',
                    queue: true,
                    indefinite: !topicsActivity.success,
                });
            },
        });
    }

    loadMockPipeline(type) {
        this.model = type === 'beam' ? pipelineBeamMock : pipelineFlinkMock;
    }

    editNode(nodeId) {
        const node = this.model.nodes.find(node => node.id === nodeId);
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
        const index = this.model.nodes.findIndex(node => node.id === nodeId);
        if (index > -1) this.model.nodes.splice(index, 1);
    }

    addBlock(block) {
        const lastNode = this.model.nodes[this.model.nodes.length - 1];
        this.model.nodes.push({
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
        const nodeIndex = this.model.nodes.findIndex(node => node.id === block.id);
        if (nodeIndex > -1) {
            this.model.nodes.splice(nodeIndex, 1, block);
        }
    }

    showErrorSnackbar(...messages) {
        this.$buefy.snackbar.open({
            message: messages.join(' '),
            type: 'is-danger',
            queue: false,
        });
    }

    async stopPipeline() {
        this.model.status = 'inactive';
        await this.updatePipeline();
        this.$buefy.toast.open('Pipeline stopped');
    }

    async executePipeline() {
        let celeryTasks = generateCeleryTasks(this.model.nodes, this.model.edges);

        if (!celeryTasks) return;
        if (!celeryTasks.length) {
            this.showErrorSnackbar('Nothing to run. Define nodes and link them toghether.');
            return;
        }

        console.log('Tasks to submit', celeryTasks);

        // Add ids to celery tasks
        celeryTasks = celeryTasks.map(task => {
            return {
                ...task,
                config: {
                    ...task.config,
                    projectId: this.projectId,
                    pipelineId: this.pipelineId,
                    id: Math.random()
                        .toString(36)
                        .substr(2, 9),
                },
            };
        });

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

        this.model.status = 'pending';
        this.savePipeline();
        this.$buefy.toast.open('Pipeline executed');
    }

    async savePipeline() {
        await this.updatePipeline();
        this.$buefy.toast.open('Pipeline saved');
    }

    updatePipeline() {
        return this.$apollo.mutate({
            mutation: UPDATE_PIPELINE,
            variables: {
                id: this.pipelineId,
                label: this.pipeline.label,
                config: JSON.stringify(this.model),
            },
        });
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
