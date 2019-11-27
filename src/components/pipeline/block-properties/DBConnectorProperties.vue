<template>
    <div>
        <template v-if="connectors.length">
            <h2 class="subtitle">Database Connector Stream</h2>
            <b-field grouped>
                <b-field label="Topic" expanded>
                    <b-field>
                        <b-input :value="properties.topic" expanded disabled />
                        <p class="control">
                            <button class="button is-info" outlined @click.prevent="changeTopic()">
                                Change
                            </button>
                        </p>
                    </b-field>
                </b-field>
            </b-field>

            <template v-if="editMode">
                <b-field label="Data connector">
                    <b-select v-model="connector" @input="onDataConnectorSelected" :expanded="true">
                        <option
                            v-for="connector in connectors"
                            :value="connector"
                            :key="connector.id"
                        >
                            {{ connector.label }}
                        </option>
                    </b-select>
                </b-field>
                <b-field label="Database">
                    <b-select v-model="database" @input="onDatabaseSelected" :expanded="true">
                        <option v-for="database in databases" :value="database" :key="database">
                            {{ database }}
                        </option>
                    </b-select>
                </b-field>
                <b-field label="Table">
                    <b-select v-model="table" @input="onTableSelected" :expanded="true">
                        <option v-for="table in tables" :value="table" :key="table">
                            {{ table }}
                        </option>
                    </b-select>
                </b-field>
            </template>

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
        </template>

        <template v-else>
            No database data connectors registered. Start by adding one in the project page.
        </template>
    </div>
</template>

<script>
import { Component, Prop, Vue } from 'vue-property-decorator';
import SchemaTree from '@/components/pipeline/block-properties/schema-tree/SchemaTree';
import SampleEvents from '@/components/pipeline/block-properties/SampleEvents';
import KAFKA_TOPICS from '@/graphql/subscriptions/kafkaTopics.gql';
import PROJECT_QUERY from '@/graphql/queries/project.gql';

@Component({
    components: {
        SchemaTree,
        SampleEvents,
    },
})
export default class DBConnectorProperties extends Vue {
    @Prop() properties;

    editMode = true;
    tab = 0;

    connector = null;
    database = null;
    table = null;

    topics = [];
    connectors = [];

    databases = [];
    filterDatabases(connectorId) {
        const databases = this.topics
            .filter(topic => {
                const parts = topic.split('.');
                return parts[0] == this.projectId && parts[1] == connectorId && parts[2];
            })
            .map(topic => topic.split('.')[2]);
        this.databases = [...new Set(databases)];
    }

    tables = [];
    filterTables(connectorId, database) {
        this.tables = this.topics
            .filter(topic => {
                const parts = topic.split('.');
                return (
                    parts[0] == this.projectId &&
                    parts[1] == connectorId &&
                    parts[2] === database &&
                    parts[3]
                );
            })
            .map(topic => topic.split('.')[3])
            .sort();
    }

    onDataConnectorSelected(connector) {
        this.filterDatabases(connector.id);
    }

    onDatabaseSelected(database) {
        this.filterTables(this.connector.id, database);
    }

    onTableSelected(table) {
        this.properties.table = table;
        this.properties.topic =
            this.projectId +
            '.' +
            this.connector.id +
            '.' +
            this.database +
            '.' +
            this.properties.table;
        this.editMode = false;
    }

    changeTopic() {
        this.editMode = true;
    }

    created() {
        this.projectId = +this.$route.params.projectId;
        this.pipelineId = +this.$route.params.pipelineId;

        if (!this.properties.schema) {
            this.prefillSchema();
        }

        if (this.properties.topic) {
            this.editMode = false;
        }

        // Retrieve the Debezium DBdata connectors
        this.$apollo.addSmartQuery('project', {
            query: PROJECT_QUERY,
            variables: {
                id: this.projectId,
            },
            result({ data }) {
                this.connectors = data.project.dataConnectors.filter(
                    connector => connector.dataConnectorType.label === 'Debezium',
                );
            },
        });

        this.$apollo.addSmartSubscription('topics', {
            query: KAFKA_TOPICS,
            result({ data: { topics } }) {
                this.topics = topics;
            },
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
        children: [
            {
                name: 'payload',
                value: 'ROW',
                children: [
                    { name: 'ts_ms', value: 'LONG' },
                    {
                        name: 'before',
                        value: 'ROW',
                        children: [{}],
                    },
                    {
                        name: 'after',
                        value: 'ROW',
                        children: [{}],
                    },
                ],
            },
        ],
    };
}
</script>
