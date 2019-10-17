<template>
    <main class="container">
        <section class="section">
            <h1 class="title">Integrations</h1>
            <integration-block
                v-for="integration in integrations"
                :key="integration.id"
                :integration="integration"
            />
        </section>
    </main>
</template>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import IntegrationBlock from '@/components/integrations/IntegrationBlock';

import INTEGRATIONS_QUERY from '@/graphql/queries/integrations.gql';

@Component({
    components: {
        IntegrationBlock,
    },
})
export default class Integrations extends Vue {
    created() {
        this.$apollo.addSmartQuery('allIntegrations', {
            query: INTEGRATIONS_QUERY,
            result({ data }) {
                if (data.allIntegrations.length) {
                    console.log(data.allIntegrations[0]);
                    this.integrations[0] = {
                        id: 0,
                        logo: '/img/integrations/debezium.svg',
                        name: 'Debezium ',
                        description: `Database Connector for Kafka allowing streaming and observing a SQL/NoSQL database`,
                        label: data.allIntegrations[0].label,
                        config: JSON.parse(data.allIntegrations[0].config),
                    };
                }
            },
        });
    }

    integrations = [
        {
            id: 1,
            logo: '/img/integrations/spark.svg',
            name: 'External Spark Cluster',
            description: `
                    User an external Spark Cluster for running the pipeline jobs
            `,
        },
        {
            id: 2,
            logo: '/img/integrations/flink.png',
            name: 'External Flink Cluster',
            description: `
                    User an external Flink for running the pipeline jobs
            `,
        },
        {
            id: 3,
            logo: '/img/integrations/hadoop.svg',
            name: 'External Hadoop Cluster',
            description: `
                    User an external Hadoop Cluster for running the pipeline jobs
            `,
        },
        {
            id: 4,
            logo: '/img/integrations/twitter.svg',
            name: 'Twitter API',
            description: `
                    Use the Twitter API to query data or observe streams
            `,
        },
    ];
}
</script>
