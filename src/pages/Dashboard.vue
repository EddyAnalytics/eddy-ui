<template>
    <main>
        <section class="section">
            <h1 class="title">Dashboard</h1>
            Project ID: {{ projectId }} Dashboard ID: {{ dashboardId }}
        </section>

        <section class="section">
            <div class="columns is-mobile">
                <div class="column">
                    <div class="box has-background-primary">
                        <div class="content">
                            <h1>2.4k</h1>
                            <h3>Ingested</h3>
                        </div>
                    </div>
                </div>
                <div class="column">
                    <div class="box has-background-primary">
                        <div class="content">
                            <h1>2.1k</h1>
                            <h3>Transformed</h3>
                        </div>
                    </div>
                </div>
                <div class="column">
                    <div class="box has-background-primary">
                        <div class="content">
                            <h1>1.8k</h1>
                            <h3>Sinked</h3>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="section">
            <h1 class="subtitle">Activity</h1>
            <div class="columns">
                <div class="column is-2">
                    <b-field label="Topics">
                        <b-select
                            multiple
                            native-size="9"
                            placeholder="Select a Kafka Topic"
                            v-model="selectedTopics"
                        >
                            <option v-for="option in topics" :value="option" :key="option">
                                {{ option }}
                            </option>
                        </b-select>
                    </b-field>
                </div>

                <div class="column">
                    <div class="m-b-sm"><strong>Selected topics activity</strong></div>
                    <pre>{{ topicsActivity }}</pre>
                </div>
            </div>
        </section>

        <div class="grid">
            <grid-layout
                class="grid__layout"
                :layout.sync="layout"
                :row-height="300"
                :is-draggable="true"
                :is-resizable="true"
                :responsive="true"
                :margin="[10, 10]"
                :cols="{ lg: 3, md: 3, sm: 2, xs: 1, xxs: 1 }"
            >
                <grid-item
                    class="grid__layout__item"
                    v-for="item in layout"
                    :x="item.x"
                    :y="item.y"
                    :w="item.w"
                    :h="item.h"
                    :i="item.i"
                    :key="item.i"
                    :static="item.type === 'AddWidget'"
                >
                    <component :is="item.type" />
                </grid-item>
            </grid-layout>
        </div>
    </main>
</template>

<style lang="scss" scoped>
pre {
    height: 20rem;
    overflow: auto;
}

.grid {
    width: 100%;
    .grid__layout {
        .grid__layout__item {
            border: 1px solid #ddd;
        }
    }
}
</style>

<script>
import { Component, Vue } from 'vue-property-decorator';
import VueGridLayout from 'vue-grid-layout';

import KAFKA_TOPICS from '@/graphql/subscriptions/kafkaTopics.gql';
import KAFKA_TOPICS_ACTIVITY from '@/graphql/subscriptions/kafkaTopicsActivity.gql';

import AddWidget from '@/components/dashboard/AddWidget';
import BarChartWidget from '@/components/dashboard/BarChartWidget';

@Component({
    components: {
        GridLayout: VueGridLayout.GridLayout,
        GridItem: VueGridLayout.GridItem,
        AddWidget,
        BarChartWidget,
    },
})
export default class Dashboard extends Vue {
    topics = [];
    selectedTopics = [];
    topicsActivity = {};

    layout = [
        { x: 0, y: 0, w: 1, h: 1, i: '1', topic: '', type: 'BarChartWidget' },
        { x: 1, y: 0, w: 1, h: 1, i: '2', topic: '', type: 'BarChartWidget' },
        { x: 2, y: 0, w: 1, h: 1, i: '3', topic: '', type: 'BarChartWidget' },
        { x: 0, y: 0, w: 1, h: 1, i: '0', topic: '', type: 'AddWidget' },
    ];

    created() {
        this.projectId = this.$route.params.projectId;
        this.dashboardId = this.$route.params.dashboardId;

        this.$apollo.addSmartSubscription('topics', {
            query: KAFKA_TOPICS,
            result({ data: { topics } }) {
                this.topics = topics;
            },
        });

        this.$apollo.addSmartSubscription('topicsActivity', {
            query: KAFKA_TOPICS_ACTIVITY,
            variables() {
                return {
                    topics: this.selectedTopics,
                };
            },
            result({ data: { topicsActivity } }) {
                this.topicsActivity = topicsActivity;
            },
        });
    }
}
</script>
