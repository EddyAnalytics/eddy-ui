<template>
    <div>
        <div class="col-12">
            <h1>Project {{ project.name }}</h1>
        </div>

        <div class="col-12">
            <h2>Data sources</h2>
            <div class="row">
                <div
                    class="col-xs-12 col-md-2"
                    v-for="dataSource in dataSources"
                    :key="dataSource.id"
                >
                    <data-source-block :dataSource="dataSource"></data-source-block>
                </div>
            </div>
        </div>

        <br />

        <div class="col-12">
            <h2>Pipelines</h2>
            <router-link
                :to="{ name: 'Pipeline', params: { pipelineId: 0 } }"
                tag="button"
                class="button--cta"
            >
                Add new
            </router-link>
        </div>

        <br />

        <div class="col-12">
            <h2>Activity</h2>

            <select
                :options="[
                    'mysql1.inventory.customers',
                    'mysql1.inventory.products',
                    'mysql1.inventory.orders',
                ]"
                v-model="topic"
            ></select>

            {{ topic }}
            <pre>{{ activity }}</pre>
        </div>

        <br />

        <div class="col-12">
            <h2>Dashboards</h2>
        </div>
    </div>
</template>
<style lang="scss" scoped>
pre {
    max-height: 20rem;
    overflow: auto;
}
</style>
<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import DataSourceBlock from '@/components/project/DataSourceBlock';
import gql from 'graphql-tag';

@Component({
    components: {
        DataSourceBlock,
    },
    apollo: {
        $subscribe: {
            kafkaTopic: {
                query: gql`
                    subscription kafkaTopic($topic: String!) {
                        kafka(topic: $topic)
                    }
                `,
                variables() {
                    return {
                        topic: this.topic,
                    };
                },
                result({ data }) {
                    this.activity = data;
                },
            },
        },
    },
})
export default class Project extends Vue {
    activity = {};
    topic = 'mysql1.inventory.customers';
    get projects() {
        return this.$store.state.projects.projects;
    }

    get project() {
        return this.$store.state.projects.projects[this.projectId];
    }

    created() {
        this.projectId = this.$route.params.projectId;
    }

    activityEntries = [
        {
            type: 'debezium-kafka',
            content: 'DB Change',
        },
    ];

    dataSources = [
        {
            id: 0,
            logo: '/img/data-sources/data-source-db.svg',
            name: 'SQL Database ',
        },
    ];
}
</script>
