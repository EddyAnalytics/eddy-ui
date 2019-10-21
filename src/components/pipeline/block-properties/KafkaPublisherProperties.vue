<template>
    <div>
        <h2 class="subtitle">Kafka Publisher</h2>
        <b-field label="Topic" expanded>
            <b-field>
                <p class="control">
                    <span class="button is-static">{{ this.projectId }}.</span>
                </p>
                <b-input v-model="properties.topicSlug" expanded></b-input>
            </b-field>
        </b-field>
    </div>
</template>

<script>
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

import KAFKA_TOPICS from '@/graphql/subscriptions/kafkaTopics.gql';

@Component
export default class KafkaPublisherProperties extends Vue {
    @Prop() properties;

    topics = [];
    created() {
        this.projectId = +this.$route.params.projectId;
        this.$apollo.addSmartSubscription('topics', {
            query: KAFKA_TOPICS,
            result({ data: { topics } }) {
                this.topics = topics;
            },
        });
    }

    @Watch('properties.topicSlug')
    onTopicSlugChange() {
        this.properties.topic = this.projectId + '.' + this.properties.topicSlug;
    }
}
</script>
