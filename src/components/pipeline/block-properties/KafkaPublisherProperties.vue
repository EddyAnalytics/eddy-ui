<template>
    <div>
        <h2 class="subtitle">Kafka Publisher</h2>

        <b-field label="Topic">
            <b-select v-model="properties.topic" :expanded="true">
                <option v-for="topic in topics" :key="topic">
                    {{ topic }}
                </option>
            </b-select>
        </b-field>

        <b-field label="Schema">
            <schema-tree :schema="properties.schema" />
        </b-field>
    </div>
</template>

<script>
import { Component, Prop, Vue } from 'vue-property-decorator';
import SchemaTree from '@/components/pipeline/block-properties/schema-tree/SchemaTree';

import KAFKA_TOPICS from '@/graphql/subscriptions/kafkaTopics.gql';

@Component({
    components: {
        SchemaTree,
    },
})
export default class KafkaPublisherProperties extends Vue {
    @Prop() properties;

    topics = [];
    created() {
        this.$apollo.addSmartSubscription('topics', {
            query: KAFKA_TOPICS,
            result({ data: { topics } }) {
                this.topics = topics;
            },
        });

        if (!this.properties.schema) {
            this.prefillSchema();
        }
    }

    prefillSchema() {
        this.$set(this.properties, 'schema', {
            value: 'ROOT',
            children: [{}],
        });
    }
}
</script>
