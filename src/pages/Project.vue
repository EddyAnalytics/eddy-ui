<template>
    <main v-if="project">
        <div class="section">
            <h1 class="title is-spaced">Project {{ project.label || `Project ${project.id}` }}</h1>
            <h2 class="subtitle is-3">Data Connectors</h2>

            <div class="columns is-multiline">
                <data-connector-block
                    v-for="dataConnector in project.dataConnectors"
                    :key="dataConnector.id"
                    :dataConnector="dataConnector"
                    @click.native="toggleConnectorDetails(dataConnector)"
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
                    v-for="pipeline in project.pipelines"
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
                    v-for="dashboard in project.dashboards"
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

import PipelineBlock from '@/components/project/PipelineBlock';
import PipelineForm from '@/components/projects/PipelineForm.vue';

import DashboardBlock from '@/components/project/DashboardBlock';
import DashboardForm from '@/components/projects/DashboardForm.vue';

import PROJECT_QUERY from '@/graphql/queries/project.gql';
import DELETE_PROJECT from '@/graphql/mutations/deleteProject.gql';

import CREATE_DATA_CONNECTOR from '@/graphql/mutations/createDataConnector.gql';
import UPDATE_DATA_CONNECTOR from '@/graphql/mutations/updateDataConnector.gql';
import DELETE_DATA_CONNECTOR from '@/graphql/mutations/deleteDataConnector.gql';

import CREATE_PIPELINE from '@/graphql/mutations/createPipeline.gql';
import CREATE_DASHBOARD from '@/graphql/mutations/createDashboard.gql';

@Component({
    components: {
        DataConnectorBlock,
        DataConnectorForm,
        DashboardBlock,
        PipelineBlock,
        PipelineForm,
    },
})
export default class Project extends Vue {
    project = null;
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
            fetchPolicy: 'cache-and-network',
        });
    }

    addNewDataConnector() {
        this.isConnectorPanelOpen = true;
        this.selectedDataConnector = {
            label: 'Unnamed connector',
        };
    }

    toggleConnectorDetails(dataConnector) {
        if (this.isConnectorPanelOpen && dataConnector === this.selectedDataConnector) {
            this.closeConnectorPanel();
        } else {
            this.isConnectorPanelOpen = true;
            this.selectedDataConnector = dataConnector;
        }
    }

    async saveConnector(dataConnector) {
        await this.$apollo.mutate({
            mutation: dataConnector.id ? UPDATE_DATA_CONNECTOR : CREATE_DATA_CONNECTOR,
            variables: {
                id: dataConnector.id,
                dataConnectorTypeId: dataConnector.dataConnectorType.id,
                label: dataConnector.label,
                projectId: this.projectId,
                config: JSON.stringify(dataConnector.config),
            },
        });

        this.closeConnectorPanel();
        this.$apollo.queries.project.refetch();
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
        this.$apollo.queries.project.refetch();
        this.$buefy.toast.open('Data connector deleted');
    }

    closeConnectorPanel() {
        this.isConnectorPanelOpen = false;
        this.selectedDataConnector = {};
    }

    goToPipeline(pipeline) {
        this.$router.push({
            name: 'Pipeline',
            params: { projectId: this.projectId, pipelineId: pipeline.id },
        });
    }

    async savePipeline(pipeline) {
        await this.$apollo.mutate({
            mutation: CREATE_PIPELINE,
            variables: {
                ...pipeline,
                projectId: this.projectId,
            },
        });

        this.$apollo.queries.project.refetch();
    }

    openPipelineModal(pipeline) {
        this.$buefy.modal.open({
            parent: this,
            component: PipelineForm,
            hasModalCard: true,
            props: pipeline,
            events: { save: this.savePipeline },
        });
    }

    addNewPipeline() {
        this.openPipelineModal();
    }

    goToDashboard(dashboard) {
        this.$router.push({
            name: 'Dashboard',
            params: { projectId: this.projectId, dashboardId: dashboard.id },
        });
    }

    async saveDashboard(dashboard) {
        await this.$apollo.mutate({
            mutation: CREATE_DASHBOARD,
            variables: {
                ...dashboard,
                projectId: this.projectId,
            },
        });

        this.$apollo.queries.project.refetch();
    }

    openDashboardModal(dashboard) {
        this.$buefy.modal.open({
            parent: this,
            component: DashboardForm,
            hasModalCard: true,
            props: dashboard,
            events: { save: this.saveDashboard },
        });
    }

    addNewDashboard() {
        this.openDashboardModal();
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
            mutation: DELETE_PROJECT,
            variables: {
                id: this.projectId,
            },
        });

        this.$buefy.toast.open('Project deleted');
        this.$router.replace({ name: 'Projects' });
    }
}
</script>
