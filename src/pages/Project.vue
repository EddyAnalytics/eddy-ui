<template>
    <main v-if="project">
        <div class="section">
            <h1 class="title is-spaced">Project {{ project.name || `Project ${project.id}` }}</h1>
            <h2 class="subtitle is-3">Data Connectors</h2>
            <div class="columns is-multiline">
                <data-connector-block
                    v-for="dataConnector in dataConnectors"
                    :key="dataConnector.id"
                    :dataConnector="dataConnector"
                    @click.native="showConnectorDetails(dataConnector)"
                ></data-connector-block>
                <data-connector-block @click.native="addNewDataConnector()" />
            </div>

            <transition name="fade">
                <div v-if="isConnectorPanelOpen" class="box">
                    {{ dataConnectorDetails }}
                    <div class="buttons">
                        <b-button type="is-primary" outlined @click="saveConnectorSettings()">
                            Save
                        </b-button>
                        <b-button outlined @click="closeConnectorPanel()">Cancel</b-button>
                    </div>
                </div>
            </transition>
        </div>

        <div class="section">
            <h2 class="subtitle is-2">Data Pipelines</h2>
            <div class="columns is-multiline">
                <pipeline-block
                    v-for="pipeline in pipelines"
                    :key="pipeline.id"
                    :pipeline="pipeline"
                    @click.native="goToPipeline(pipeline)"
                ></pipeline-block>
                <pipeline-block @click.native="addNewPipeline()" />
            </div>
        </div>

        <div class="section">
            <h2 class="subtitle is-2">Dashboards</h2>
            <div class="columns is-multiline">
                <dashboard-block
                    v-for="dashboard in dashboards"
                    :key="dashboard.id"
                    :dashboard="dashboard"
                    @click.native="goToDashboard(dashboard)"
                ></dashboard-block>
                <dashboard-block @click.native="addNewDashboard()" />
            </div>
        </div>

        <section class="section">
            <h1 class="subtitle">Activity</h1>

            <b-field>
                <b-select placeholder="Select a Kafka Topic" v-model="topic">
                    <option v-for="option in options" :value="option" :key="option">
                        {{ option }}
                    </option>
                </b-select>
            </b-field>

            <div>Topic: {{ topic }}</div>
            <br />
            <div>Last event</div>
            <pre>{{ activity }}</pre>
        </section>

        <section class="section">
            <h1 class="subtitle">Project management</h1>
            <b-button type="is-danger" @click="openDeleteProjectModal()">Delete project</b-button>
        </section>
    </main>
</template>

<style lang="scss" scoped>
pre {
    min-height: 10rem;
    max-height: 20rem;
    overflow: auto;
}
</style>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import DataConnectorBlock from '@/components/project/DataConnectorBlock';
import DashboardBlock from '@/components/project/DashboardBlock';
import PipelineBlock from '@/components/project/PipelineBlock';
import gql from 'graphql-tag';

import PROJECT_QUERY from '@/graphql/queries/project.gql';
import PROJECT_DELETE from '@/graphql/mutations/deleteProject.gql';

@Component({
    components: {
        DataConnectorBlock,
        DashboardBlock,
        PipelineBlock,
    },
    apollo: {
        $subscribe: {
            kafkaTopic: {
                query: gql`
                    subscription kafkaTopic($topics: [String!]!) {
                        kafka(topics: $topics)
                    }
                `,
                variables() {
                    return {
                        topics: this.topic ? [this.topic] : [],
                    };
                },
                result({ data }) {
                    this.activity = data;
                },
            },
            topics: {
                query: gql`
                    subscription topics {
                        topics
                    }
                `,
                result({ data }) {
                    this.options = data.topics;
                },
            },
        },
    },
})
export default class Project extends Vue {
    project = null;

    activity = {};
    topic = null;
    options = [];

    isConnectorPanelOpen = false;
    dataConnectorDetails = {};

    created() {
        this.projectId = this.$route.params.projectId;
        this.$apollo.addSmartQuery('project', {
            query: PROJECT_QUERY,
            variables() {
                return {
                    id: this.projectId,
                };
            },
        });
    }

    dataConnectors = [
        {
            id: 0,
            logo: '/img/data-sources/data-source-db.svg',
            name: 'MySQL Database ',
        },
        {
            id: 1,
            logo: '/img/data-sources/data-source-db.svg',
            name: 'MariaDB Database ',
        },
    ];

    addNewDataConnector() {
        this.isConnectorPanelOpen = true;
        this.dataConnectorDetails = {};
    }

    showConnectorDetails(connector) {
        this.isConnectorPanelOpen = true;
        this.dataConnectorDetails = connector;
    }

    saveConnectorSettings(connector) {
        console.log('Save conenctor', connector);
        this.$buefy.toast.open({
            message: 'Connector saved',
            type: 'is-success',
        });
        this.isConnectorPanelOpen = false;
    }

    closeConnectorPanel() {
        this.isConnectorPanelOpen = false;
        this.dataConnectorDetails = {};
    }

    pipelines = [
        {
            id: 0,
            name: 'Simple Pipeline',
        },
        {
            id: 1,
            name: 'Advanced Pipeline',
        },
    ];

    goToPipeline(pipeline) {
        this.$router.push({
            name: 'Pipeline',
            params: { projectId: this.projectId, pipelineId: pipeline.id },
        });
    }

    addNewPipeline() {
        this.goToPipeline({ id: 'new' });
    }

    dashboards = [
        {
            id: 0,
            name: 'KPI Dashboard',
        },
        {
            id: 1,
            name: 'Customer Profiles',
        },
        {
            id: 2,
            name: 'Test Dashboard',
        },
    ];

    goToDashboard(dashboard) {
        this.$router.push({
            name: 'Dashboard',
            params: { projectId: this.projectId, pipelineId: dashboard.id },
        });
    }

    addNewDashboard() {
        this.goToDashboard({ id: 'new' });
    }

    openDeleteProjectModal() {
        this.$buefy.dialog.confirm({
            title: 'Deleting project',
            message: 'Are you sure you want to <b>delete</b> this project?',
            confirmText: 'Delete Project',
            type: 'is-danger',
            hasIcon: true,
            onConfirm: () => this.deleteProject(),
        });
    }

    async deleteProject() {
        await this.$apollo.mutate({
            mutation: PROJECT_DELETE,
            variables: {
                id: this.projectId,
            },
        });

        this.$buefy.toast.open('Project deleted');
        this.$router.replace({ name: 'Projects' });
    }
}
</script>
