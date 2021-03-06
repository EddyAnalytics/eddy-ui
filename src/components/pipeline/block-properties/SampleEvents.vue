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
        const schema = {
            value: 'ROOT',
            children: [],
        };

        const rawSample = this.samples[this.sampleIndex];
        // Try to parse the sample as JSON, if that trows an explicit JSON parsing exception then try CSV
        try {
            const sampleJSON = JSON.parse(rawSample);
            // Map from Debezium schema if available, from JSON otherwise
            if (sampleJSON && sampleJSON.schema) {
                schema.children.push({
                    name: 'payload',
                    value: 'ROW',
                    children: [],
                });
                schema.children[0].children = this.mapSchemaFields(sampleJSON.schema.fields);
            } else {
                schema.children = this.mapJSONFields(sampleJSON);
            }
        } catch (e) {
            if (e instanceof SyntaxError) {
                schema.children = this.mapCSVFields(rawSample);
            } else {
                throw e;
            }
        }

        this.$emit('fillSchema', schema);
    }

    mapCSVFields(sample) {
        return sample.split(',').map((value, index) => {
            return {
                name: 'field_' + index,
                value: 'VARCHAR',
            };
        });
    }

    mapJSONFields(sample) {
        return Object.entries(sample).map(this.mapJSONField);
    }

    mapJSONField([key, value]) {
        if (!value) return;
        if (typeof value === 'object') {
            return {
                name: key,
                value: 'ROW',
                children: this.mapJSONFields(value),
            };
        } else {
            return {
                name: key,
                value: this.mapJSONFieldType(value),
            };
        }
    }

    mapJSONFieldType(value) {
        switch (typeof value) {
            case 'number':
                return 'LONG';
            case 'bigint':
                return 'LONG';
            case 'string':
                return 'VARCHAR';
            case 'boolean':
                return 'VARCHAR';
            default:
                return 'VARCHAR';
        }
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
