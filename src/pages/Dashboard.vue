<template>
    <main>
        <section class="section">
            <h1 class="title">Dashboard</h1>
            Project ID: {{ projectId }} Dashboard ID: {{ dashboardId }}
        </section>

        <section class="section">
            <h1 class="subtitle">Activity</h1>
            <div class="columns">
                <div class="column is-2">
                    <b-field label="Topics">
                        <b-select
                            multiple
                            native-size="7"
                            placeholder="Select a Kafka Topic"
                            v-model="selectedTopics"
                        >
                            <option v-for="option in topics" :value="option" :key="option">
                                {{ option }}
                            </option>
                        </b-select>
                    </b-field>
                </div>

                <div class="column">
                    <div class="m-b-sm"><strong>Selected topics activity</strong></div>
                    <pre>{{ topicsActivity }}</pre>
                </div>
            </div>
        </section>
    </main>
</template>

<style lang="scss" scoped>
pre {
    height: 20rem;
    overflow: auto;
}
</style>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import KAFKA_TOPICS from '@/graphql/subscriptions/kafkaTopics.gql';
import KAFKA_TOPICS_ACTIVITY from '@/graphql/subscriptions/kafkaTopicsActivity.gql';

@Component({
    components: {},
})
export default class Dashboard extends Vue {
    topics = [];
    selectedTopics = [];
    topicsActivity = {};

    created() {
        this.projectId = this.$route.params.projectId;
        this.dashboardId = this.$route.params.dashboardId;

        this.$apollo.addSmartSubscription('topics', {
            query: KAFKA_TOPICS,
            result({ data: { topics } }) {
                this.topics = topics;
            },
        });

        this.$apollo.addSmartSubscription('topicsActivity', {
            query: KAFKA_TOPICS_ACTIVITY,
            variables() {
                return {
                    topics: this.selectedTopics,
                };
            },
            result({ data: { topicsActivity } }) {
                this.topicsActivity = topicsActivity;
            },
        });
    }
}
</script>
