<template>
    <main class="container-fluid">
        <section class="section">
            <div class="columns">
                <div class="column">
                    <h1 class="title is-1 is-spaced">Settings</h1>
                </div>
                <div class="column has-text-right">
                    <b-button outlined type="is-info" icon-left="reload" @click="refresh()">
                        Refresh
                    </b-button>
                </div>
            </div>
        </section>
        <section class="section">
            <h2 class="subtitle is-3">System Status</h2>
        </section>
        <section class="section">
            <h2 class="subtitle is-3">Flink Cluster</h2>
            <div v-if="flinkInfo">
                <flink-cluster-info-block :info="flinkInfo" />
            </div>
        </section>
        <section class="section">
            <h2 class="subtitle is-3">Flink Legacy Cluster</h2>
            <div v-if="flinkLegacyInfo">
                <flink-cluster-info-block :info="flinkLegacyInfo" />
            </div>
        </section>
        <section class="section">
            <h2 class="subtitle is-3">Debezium</h2>
            <div>
                {{ debeziumInfo }}
            </div>
        </section>
        <section class="section">
            <h2 class="subtitle is-3">Kafka</h2>
        </section>
        <section class="section">
            <h2 class="subtitle is-3">Spark</h2>
        </section>
    </main>
</template>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import INTEGRATIONS_QUERY from '@/graphql/queries/integrations.gql';
import DATA_CONNECTORS_QUERY from '@/graphql/queries/dataConnectors.gql';

import FlinkClusterInfoBlock from '@/components/settings/FlinkClusterInfoBlock';

@Component({
    components: {
        FlinkClusterInfoBlock,
    },
})
export default class Settings extends Vue {
    debeziumURL = '';
    debeziumInfo = null;
    flinkURL = 'https://flink.k.eddy-analytics.org/v1/';
    flinkInfo = null;
    flinkLegacyURL = 'https://flink18.k.eddy-analytics.org/v1/';
    flinkLegacyInfo = null;

    created() {
        this.$apollo.addSmartQuery('allIntegrations', {
            query: INTEGRATIONS_QUERY,
        });
        this.$apollo.addSmartQuery('dataConnectors', {
            query: DATA_CONNECTORS_QUERY,
        });

        this.refresh();
    }

    refresh() {
        this.fetchFlinkInfo();
    }

    async fetchFlinkInfo() {
        try {
            const urls = ['config', 'jobs'];
            const promises = urls.map(url => this.axios.get(this.flinkURL + url));
            this.flinkInfo = await Promise.all(promises);
            const legacyPromises = urls.map(url => this.axios.get(this.flinkLegacyURL + url));
            this.flinkLegacyInfo = await Promise.all(legacyPromises);
        } catch (e) {
            console.log('Error while fetching Flink info', e);
            throw e;
        }
    }
}
</script>
