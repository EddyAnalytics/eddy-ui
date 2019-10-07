<template>
    <main>
        <section class="section">
            <div class="columns">
                <div class="column">
                    <h1 v-if="dashboardId === 'new'" class="title">New Dashboard</h1>
                    <h1 v-else class="title">Dashboard</h1>
                </div>
                <div class="column has-text-right">
                    <b-button class="m-r-sm" icon-left="share-variant">
                        Share
                    </b-button>
                    <b-button type="is-primary" icon-left="content-save" @click="saveDashboard()">
                        Save
                    </b-button>
                </div>
            </div>
        </section>

        <section class="p-md">
            <div class="columns">
                <div class="column is-3">
                    <div class="box has-background-primary">
                        <div class="content">
                            <h1 class="has-text-white">{{ topics.length }}</h1>
                            <h4 class="has-text-white">Topics available</h4>
                        </div>
                    </div>
                </div>
                <div class="column is-3">
                    <div class="box has-background-primary">
                        <div class="content">
                            <h1 class="has-text-white">{{ selectedTopics.length }}</h1>
                            <h4 class="has-text-white">Subscriptions</h4>
                        </div>
                    </div>
                </div>
                <div class="column is-3">
                    <div class="box has-background-primary">
                        <div class="content">
                            <h1 class="has-text-white">{{ topicsActivityCount }}</h1>
                            <h4 class="has-text-white">Received events</h4>
                        </div>
                    </div>
                </div>
                <div class="column is-3">
                    <div class="box has-background-primary">
                        <div class="content">
                            <h1 class="has-text-white">
                                {{ Math.floor(topicsActivityCount / minutes) }}
                            </h1>
                            <h4 class="has-text-white">Events per minute</h4>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="section">
            <h1 class="subtitle">Live topics activity</h1>
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
                    <pre class="last-event-pre">{{ topicsActivity }}</pre>
                </div>
            </div>
        </section>

        <div class="grid p-sm">
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
                    class="grid__layout__item box"
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

<style lang="scss">
.last-event-pre {
    height: 20rem;
    overflow: auto;
}

.grid {
    .grid__layout {
        .vue-grid-placeholder {
            background: $primary;
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
    selectedTopics = ['sql_results'];
    topicsActivity = {};

    topicsActivityCount = 1;
    minutes = 1;

    layout = [
        { x: 1, y: 0, w: 1, h: 1, i: '1', topic: '', type: 'BarChartWidget' },
        { x: 2, y: 0, w: 1, h: 1, i: '2', topic: '', type: 'BarChartWidget' },
        { x: 0, y: 1, w: 1, h: 1, i: '3', topic: '', type: 'BarChartWidget' },
        { x: 1, y: 1, w: 1, h: 1, i: '4', topic: '', type: 'BarChartWidget' },
        { x: 0, y: 0, w: 1, h: 1, i: '0', topic: '', type: 'AddWidget' },
    ];

    created() {
        this.projectId = this.$route.params.projectId;
        this.dashboardId = this.$route.params.dashboardId;

        setInterval(() => {
            this.minutes++;
        }, 1000);

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
                this.topicsActivityCount++;
            },
        });
    }

    saveDashboard() {
        this.$buefy.toast.open('Dashoard saved');
    }
}
</script>
