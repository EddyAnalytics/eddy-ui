<template>
    <div>
        <h2 class="subtitle">Kafka Subscriber</h2>
        {{ topics }}
        <b-field label="Topic">
            <b-autocomplete
                v-model="topic"
                :data="filteredTopics"
                @select="option => (properties.topic = option)"
            ></b-autocomplete>
        </b-field>
    </div>
</template>

<script>
import { Component, Prop, Vue } from 'vue-property-decorator';

import KAFKA_TOPICS from '@/graphql/subscriptions/kafkaTopics.gql';

@Component
export default class KafkaSubscriberProperties extends Vue {
    @Prop() properties;

    topic = '';
    topics = [];

    created() {
        this.$apollo.addSmartSubscription('topics', {
            query: KAFKA_TOPICS,
        });

        if (this.properties.topic) {
            this.topic = this.properties.topic;
        }

        if (!this.properties.schema) {
            this.prefillSchema();
        }
    }

    get filteredTopics() {
        return this.topics.filter(topic => {
            return (
                topic
                    .toString()
                    .toLowerCase()
                    .indexOf(this.topic.toLowerCase()) >= 0
            );
        });
    }
}
</script>
