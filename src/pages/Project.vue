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
            <div class="scrum_card" v-for="entry in activityEntries" :key="entry.content">
                {{ entry.type }}
                {{ entry.content }}
            </div>
        </div>

        <br />

        <div class="col-12">
            <h2>Dashboards</h2>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import DataSourceBlock from '@/components/project/DataSourceBlock';

@Component({
    components: {
        DataSourceBlock,
    },
})
export default class Project extends Vue {
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
