<template>
    <div v-if="loading">
        Loading sample events...
    </div>
    <div v-else>
        <template v-if="samples.length">
            <div class="buttons m-t-md">
                <b-button
                    outlined
                    icon-left="chevron-left"
                    @click="sampleIndex--"
                    :disabled="sampleIndex <= 0"
                >
                    Previous
                </b-button>
                <b-button
                    outlined
                    icon-right="chevron-right"
                    @click="sampleIndex++"
                    :disabled="sampleIndex >= samples.length - 1"
                >
                    Next
                </b-button>
                <b-button
                    v-if="samples[sampleIndex]"
                    outlined
                    type="is-info"
                    @click="prefillSchema"
                >
                    Fill schema using event data
                </b-button>
            </div>
            <pre class="sample-event">{{ samples[sampleIndex] }}</pre>
        </template>
        <template v-else>
            There are no samples for the selected topic
        </template>
    </div>
</template>

<style lang="scss" scoped>
.sample-event {
    text-overflow: wrap;
    overflow: auto;
    overflow-y: scroll;
}
</style>

<script>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import SAMPLE_SUBSCRIPTION from '@/graphql/subscriptions/sample.gql';

@Component
export default class SampleEvents extends Vue {
    @Prop() topic;

    samples = [];
    loading = true;
    sampleIndex = 0;
    @Watch('topic', { immediate: true })
    onTopicChange(topic) {
        this.samples = [];
        this.loading = true;
        this.$apollo.addSmartSubscription('sample', {
            query: SAMPLE_SUBSCRIPTION,
            variables: {
                topic,
                rate: 1,
            },
            result({ data: { sample } }) {
                this.loading = false;
                this.samples.push(sample);
            },
        });
    }

    prefillSchema() {
        const rawSchema = this.samples[this.sampleIndex].schema;
        const schema = {
            value: 'ROOT',
            children: [
                {
                    name: 'payload',
                    value: 'ROW',
                    children: [],
                },
            ],
        };

        // Map from Debezium schema if available, from JSON otherwise
        if (this.samples[this.sampleIndex].schema) {
            schema.children[0].children = this.mapSchemaFields(rawSchema.fields);
        } else {
            // TODO: Implement schema inference from JSON
            // schema.children = this.mapJSONFields();
        }
        this.$emit('fillSchema', schema);
    }

    mapJSONFields(fields) {
        return fields.map(this.mapSchemaField);
    }

    mapJSONFied(field) {
        return { field };
    }

    mapSchemaFields(fields) {
        return fields.map(this.mapSchemaField);
    }

    mapSchemaField(field) {
        if (field.type === 'struct') {
            return {
                name: field.field,
                value: 'ROW',
                children: this.mapSchemaFields(field.fields),
            };
        } else {
            return {
                name: field.field,
                value: this.mapSchemaFieldType(field.type),
            };
        }
    }

    mapSchemaFieldType(type) {
        switch (type) {
            case 'int32':
                return 'LONG';
            case 'int64':
                return 'LONG';
            case 'string':
                return 'VARCHAR';
            default:
                return 'VARCHAR';
        }
    }
}
</script>

<style></style>
