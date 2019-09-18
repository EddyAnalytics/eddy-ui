<template>
    <main>
        <section class="section">
            <h1 class="title">Project {{ project.name }}</h1>
            <br />
            <h2 class="subtitle">Data pipeline</h2>
        </section>

        <section class="section">
            <h1 class="title">Activity</h1>

            <b-field>
                <b-select placeholder="Select a Kafka Topic" v-model="topic">
                    <option v-for="option in options" :value="option" :key="option">
                        {{ option }}
                    </option>
                </b-select>
            </b-field>

            <h2 class="subtitle">Topic: {{ topic }}</h2>

            <h2 class="subtitle">Last event</h2>
            <pre>{{ activity }}</pre>
        </section>
    </main>
</template>

<style lang="scss" scoped>
pre {
    min-height: 10rem;
    max-height: 30rem;
    overflow: auto;
}
</style>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import gql from 'graphql-tag';

@Component({
    components: {},
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

    get options() {
        return [
            'mysql1.inventory.customers',
            'mysql1.inventory.inventory',
            'mysql1.inventory.products',
        ];
    }

    dataSources = [
        {
            id: 0,
            logo: '/img/data-sources/data-source-db.svg',
            name: 'SQL Database ',
        },
    ];
}
</script>
