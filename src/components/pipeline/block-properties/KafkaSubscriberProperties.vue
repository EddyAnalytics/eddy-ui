<template>
    <div>
        <h2 class="subtitle">Kafka Subscriber</h2>
        <b-field label="Topic">
            <b-autocomplete
                v-model="topic"
                open-on-focus
                :data="filteredTopics"
                @select="option => (properties.topic = option)"
            ></b-autocomplete>
        </b-field>

        <b-tabs
            v-model="tab"
            position="is-centered is-boxed"
            :animated="false"
            :destroy-on-hide="true"
        >
            <b-tab-item label="Schema">
                <b-field>
                    <schema-tree :schema="properties.schema" />
                </b-field>
            </b-tab-item>
            <b-tab-item label="Sample events">
                <sample-events :topic="properties.topic" @fillSchema="fillSchema" />
            </b-tab-item>
        </b-tabs>
    </div>
</template>

<script>
import { Component, Prop, Vue } from 'vue-property-decorator';
import SchemaTree from '@/components/pipeline/block-properties/schema-tree/SchemaTree';
import SampleEvents from '@/components/pipeline/block-properties/SampleEvents';
import KAFKA_TOPICS from '@/graphql/subscriptions/kafkaTopics.gql';

@Component({
    components: {
        SchemaTree,
        SampleEvents,
    },
})
export default class KafkaSubscriberProperties extends Vue {
    @Prop() properties;

    topic = '';
    topics = [];
    tab = 0;

    created() {
        this.projectId = +this.$route.params.projectId;
        this.$apollo.addSmartSubscription('topics', {
            query: KAFKA_TOPICS,
            result({ data: { topics } }) {
                // Filter out the topics for this
                this.topics = topics.filter(topic => {
                    const parts = topic.split('.');
                    return parts[0] && parts[0] == this.projectId;
                });
            },
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

    fillSchema(schema) {
        this.prefillSchema(schema);
        this.tab = 0;
    }

    prefillSchema(schema = this.DEFAULT_SCHEMA) {
        this.$set(this.properties, 'schema', schema);
    }

    DEFAULT_SCHEMA = {
        value: 'ROOT',
        children: [{}],
    };
}
</script>
