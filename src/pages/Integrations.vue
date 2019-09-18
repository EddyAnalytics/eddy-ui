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

@Component({
    components: {
        IntegrationBlock,
    },
})
export default class Integrations extends Vue {
    integrations = [
        {
            id: 0,
            logo: '/img/integrations/debezium.svg',
            name: 'Debezium ',
            description: `
                        SQL DB Connector for Kafka allowing streaming a SQL
                        database from the begining or observing it in real time
            `,
        },
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
