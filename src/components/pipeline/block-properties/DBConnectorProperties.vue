<template>
    <div>
        <template v-if="dbDataConnectors.length">
            <h2>Database Connector Stream</h2>
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

            <b-field label="Topic">
                <b-input v-model="properties.topic" />
            </b-field>
        </template>

        <template v-else>
            No database data connectors registered. Start by adding one in the project page.
        </template>
    </div>
</template>

<script>
import { Component, Prop, Vue } from 'vue-property-decorator';
import DATA_CONNECTORS_QUERY from '@/graphql/queries/dataConnectors.gql';

@Component
export default class DBConnectorProperties extends Vue {
    @Prop() properties;

    dataConnectors = [];
    dbDataConnectors = [];
    selectedDataConnector = null;

    onDataConnectorSelected(connector) {
        this.properties.topic = connector.config.host;
    }

    created() {
        this.$apollo.addSmartQuery('dataConnectors', {
            query: DATA_CONNECTORS_QUERY,
            result({ data }) {
                let dbDataConnectors = data.dataConnectors.filter(
                    dc => dc.dataConnectorType.label === 'Debezium',
                );

                dbDataConnectors = dbDataConnectors.map(dc => {
                    return {
                        ...dc,
                        config: JSON.parse(dc.config),
                    };
                });

                this.dbDataConnectors = dbDataConnectors;
            },
        });
    }
}
</script>
