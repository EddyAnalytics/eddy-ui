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
                    <data-connector-form
                        :dataConnector="selectedDataConnector"
                        @save="saveConnector"
                        @cancel="closeConnectorPanel"
                        @remove="deleteConnector"
                    ></data-connector-form>
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
            <h1 class="subtitle">Project management</h1>
            <b-button type="is-danger" @click="openDeleteProjectModal()">Delete project</b-button>
        </section>
    </main>
</template>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import DataConnectorBlock from '@/components/project/DataConnectorBlock';
import DataConnectorForm from '@/components/project/DataConnectorForm';
import DashboardBlock from '@/components/project/DashboardBlock';
import PipelineBlock from '@/components/project/PipelineBlock';

import PROJECT_QUERY from '@/graphql/queries/project.gql';
import PROJECT_DELETE from '@/graphql/mutations/deleteProject.gql';

import DATA_CONNECTORS_QUERY from '@/graphql/queries/dataConnectors.gql';
import CREATE_DATA_CONNECTOR from '@/graphql/mutations/createDataConnector.gql';
import DELETE_DATA_CONNECTOR from '@/graphql/mutations/deleteDataConnector.gql';
import CREATE_DATA_CONNECTOR_CONFIG from '@/graphql/mutations/createDataConnectorConfig.gql';

@Component({
    components: {
        DataConnectorBlock,
        DataConnectorForm,
        DashboardBlock,
        PipelineBlock,
    },
})
export default class Project extends Vue {
    project = null;

    dataConnectors = [];

    isConnectorPanelOpen = false;
    selectedDataConnector = {};

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

        this.$apollo.addSmartQuery('dataConnectors', {
            query: DATA_CONNECTORS_QUERY,
        });
    }

    addNewDataConnector() {
        this.isConnectorPanelOpen = true;
        this.selectedDataConnector = {
            name: 'Unnamed connector',
            type: 'Debezium',
            config: {
                connectorClass: 'io.debezium.connector.mysql.MySqlConnector',
                tasksMax: '1',
                databaseHostname: 'mysql',
                databasePort: '3306',
                databaseUser: 'root',
                databasePassword: 'debezium',
                databaseServerId: '184054',
                databaseServerName: 'mysql1',
                databaseWhitelist: 'inventory',
                databaseHistoryKafkaBootstrapServers: 'kafka:9092',
                databaseHistoryKafkaTopic: 'schema-changes.inventory',
            },
        };
    }

    showConnectorDetails(dataConnector) {
        this.isConnectorPanelOpen = true;
        this.selectedDataConnector = dataConnector;
    }

    async saveConnector(dataConnector) {
        const configRes = await this.$apollo.mutate({
            mutation: CREATE_DATA_CONNECTOR_CONFIG,
            variables: {
                ...dataConnector.config,
            },
        });

        await this.$apollo.mutate({
            mutation: CREATE_DATA_CONNECTOR,
            variables: {
                name: dataConnector.name,
                configId: configRes.data.createDebeziumConnectorConfig.debeziumConnectorConfig.id,
            },
        });

        this.closeConnectorPanel();
        this.$apollo.queries.dataConnectors.refetch();
        this.$buefy.toast.open({
            message: 'Connector saved',
            type: 'is-success',
        });
    }

    async deleteConnector(dataConnector) {
        await this.$apollo.mutate({
            mutation: DELETE_DATA_CONNECTOR,
            variables: {
                id: dataConnector.id,
            },
        });
        this.closeConnectorPanel();
        this.$apollo.queries.dataConnectors.refetch();
        this.$buefy.toast.open('Data connector deleted');
    }

    closeConnectorPanel() {
        this.isConnectorPanelOpen = false;
        this.selectedDataConnector = {};
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
            params: { projectId: this.projectId, dashboardId: dashboard.id },
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
