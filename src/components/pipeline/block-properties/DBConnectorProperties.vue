<template>
    <div>
        <template v-if="dbDataConnectors.length">
            <h2 class="subtitle">Database Connector Stream</h2>
            <b-field label="Data connector">
                <b-select
                    v-model="selectedDataConnector"
                    @input="onDataConnectorSelected"
                    :expanded="true"
                >
                    <option
                        v-for="connector in dbDataConnectors"
                        :value="connector"
                        :key="connector.id"
                    >
                        {{ connector.label }}
                    </option>
                </b-select>
            </b-field>

            <b-field label="Topic">
                <b-input v-model="properties.topic" />
            </b-field>

            <b-field label="Schema">
                <schema-tree :schema="properties.schema" />
            </b-field>
        </template>

        <template v-else>
            No database data connectors registered. Start by adding one in the project page.
        </template>
    </div>
</template>

<script>
import { Component, Prop, Vue } from 'vue-property-decorator';
import SchemaTree from '@/components/pipeline/block-properties/schema-tree/SchemaTree';

import PROJECT_QUERY from '@/graphql/queries/project.gql';

@Component({
    components: {
        SchemaTree,
    },
})
export default class DBConnectorProperties extends Vue {
    @Prop() properties;

    dataConnectors = [];
    dbDataConnectors = [];
    selectedDataConnector = null;

    onDataConnectorSelected(connector) {
        this.properties.connector = connector;
    }

    created() {
        if (this.properties.connector) {
            this.selectedDataConnector = this.properties.connector;
        }

        if (!this.properties.schema) {
            this.$set(this.properties, 'schema', {});
        }

        this.projectId = +this.$route.params.projectId;
        this.$apollo.addSmartQuery('project', {
            query: PROJECT_QUERY,
            variables: {
                id: this.projectId,
            },
            result({ data }) {
                this.dbDataConnectors = data.project.dataConnectors;
            },
        });
    }
}
</script>
