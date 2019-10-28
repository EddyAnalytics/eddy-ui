<template>
    <main>
        <section class="section">
            <div class="columns">
                <div class="column">
                    <h1 class="title">
                        <go-back-button :projectId="projectId" />
                        <span v-if="editMode">Dashboard Builder -&nbsp;</span>
                        <span v-if="dashboard && dashboard.label">{{ dashboard.label }}</span>
                    </h1>
                </div>
                <div v-if="editMode" class="column has-text-right">
                    <b-button outlined class="m-r-sm" icon-left="share-variant" @click="share()">
                        Share
                    </b-button>
                    <b-button
                        outlined
                        type="is-danger"
                        class="m-r-sm"
                        icon-left="delete"
                        @click="openDeleteDashboardModal()"
                    >
                        Delete
                    </b-button>
                    <!-- <b-button type="is-primary" icon-left="content-save" @click="saveDashboard()">
                        Save
                    </b-button> -->
                </div>
            </div>
        </section>

        <section class="p-md">
            <div class="columns">
                <div class="column is-3">
                    <div
                        class="box has-background-primary"
                        style="cursor: pointer;"
                        @click="showTopicsActivity = !showTopicsActivity"
                    >
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

        <section class="section" v-show="showTopicsActivity">
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

        <section class="section">
            <div class="columns">
                <div class="column">
                    <h1 class="title">
                        Widgets
                    </h1>
                    <b-button
                        v-if="editMode"
                        outlined
                        class="m-r-sm"
                        icon-left="plus"
                        @click="openAddWidgetModal()"
                    >
                        Add widget
                    </b-button>
                </div>
                <div class="column"></div>
                <div class="column has-text-right">
                    <!-- <strong>Start date:</strong> -->
                </div>
                <div class="column">
                    <b-datepicker v-model="startDate" />
                </div>
            </div>
        </section>

        <div class="grid p-sm">
            <grid-layout
                v-if="widgets && widgets.length"
                class="grid__layout"
                :layout.sync="widgets"
                :row-height="350"
                :is-draggable="true"
                :is-resizable="true"
                :responsive="true"
                :margin="[10, 10]"
                :cols="{ lg: 3, md: 3, sm: 2, xs: 1, xxs: 1 }"
            >
                <grid-item
                    class="grid__layout__item box"
                    v-for="widget in widgets"
                    :x="widget.x"
                    :y="widget.y"
                    :w="widget.w"
                    :h="widget.h"
                    :i="widget.i"
                    :key="widget.i"
                    @resized="updateWidget(widget)"
                    @moved="updateWidget(widget)"
                >
                    <widget-wrapper
                        :showControls="editMode"
                        @edit="editWidget(widget)"
                        @delete="deleteWidget(widget)"
                    >
                        <component
                            :is="widget.type"
                            :topics="topics"
                            :widget="widget"
                            :start="startDate / 1000"
                        />
                    </widget-wrapper>
                </grid-item>
            </grid-layout>
            <div v-else class="has-text-centered">
                No widgets available. Start by adding a widget.
            </div>
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
        .grid__layout__item {
            overflow: auto;
        }
        .vue-grid-placeholder {
            background: $primary;
        }
    }
}
</style>

<script>
import { Component, Vue } from 'vue-property-decorator';
import GoBackButton from '@/components/general/GoBackButton.vue';

import VueGridLayout from 'vue-grid-layout';

import KAFKA_TOPICS from '@/graphql/subscriptions/kafkaTopics.gql';
import KAFKA_TOPICS_ACTIVITY from '@/graphql/subscriptions/kafkaTopicsActivity.gql';

import DASHBOARD_QUERY from '@/graphql/queries/dashboard.gql';
import DELETE_DASHBOARD from '@/graphql/mutations/deleteDashboard.gql';
import CREATE_WIDGET from '@/graphql/mutations/createWidget.gql';
import UPDATE_WIDGET from '@/graphql/mutations/updateWidget.gql';
import DELETE_WIDGET from '@/graphql/mutations/deleteWidget.gql';

import WidgetWrapper from '@/components/dashboard/WidgetWrapper';
import AddWidgetForm from '@/components/dashboard/AddWidgetForm';
import BarChartWidget from '@/components/dashboard/BarChartWidget';
import LineChartWidget from '@/components/dashboard/LineChartWidget';
import PieChartWidget from '@/components/dashboard/PieChartWidget';
import AreaChartWidget from '@/components/dashboard/AreaChartWidget';

@Component({
    components: {
        GoBackButton,
        GridLayout: VueGridLayout.GridLayout,
        GridItem: VueGridLayout.GridItem,
        WidgetWrapper,
        AddWidgetForm,
        BarChartWidget,
        LineChartWidget,
        PieChartWidget,
        AreaChartWidget,
    },
})
export default class Dashboard extends Vue {
    topics = [];
    selectedTopics = ['sql_results'];
    showTopicsActivity = false;
    topicsActivity = {};
    topicsActivityCount = 1;
    minutes = 1;

    widgets = [];
    startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    dashboard = {};

    editMode = true;

    created() {
        this.projectId = this.$route.params.projectId;
        this.dashboardId = this.$route.params.dashboardId;
        this.editMode = this.$route.params.mode !== 'view';

        setInterval(() => {
            this.minutes++;
        }, 1000);

        this.$apollo.addSmartQuery('dashboard', {
            query: DASHBOARD_QUERY,
            variables() {
                return {
                    id: this.dashboardId,
                };
            },
            result({ data }) {
                if (!data || !data.dashboard) return;
                this.widgets = data.dashboard.widgets.map(widget => {
                    return {
                        ...widget,
                        ...JSON.parse(widget.config),
                    };
                });
            },
            fetchPolicy: 'cache-and-network',
        });

        this.$apollo.addSmartSubscription('topics', {
            query: KAFKA_TOPICS,
            result({ data: { topics } }) {
                this.topics = topics.sort();
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

    openAddWidgetModal() {
        this.$buefy.modal.open({
            parent: this,
            component: AddWidgetForm,
            hasModalCard: true,
            props: {
                topics: this.topics,
            },
            events: { addWidget: this.addWidget },
        });
    }

    async addWidget(widget) {
        const lastWidgetIndex = this.widgets.length
            ? Math.max(...this.widgets.map(widget => widget.i))
            : 0;

        const newWidget = {
            x: 0,
            y: 0,
            w: 1,
            h: 1,
            i: lastWidgetIndex + 1,
            ...widget,
        };

        await this.$apollo.mutate({
            mutation: CREATE_WIDGET,
            variables: {
                dashboardId: this.dashboardId,
                widgetTypeId: newWidget.typeId,
                label: newWidget.label,
                config: JSON.stringify(newWidget),
            },
        });
        this.$apollo.queries.dashboard.refetch();
        this.$buefy.toast.open('Widget added');
    }

    editWidget() {
        this.$buefy.snackbar.open('Editing widgets is not implemented yet');
    }

    updateWidget(widget) {
        this.$apollo.mutate({
            mutation: UPDATE_WIDGET,
            variables: {
                id: widget.id,
                label: widget.label,
                config: JSON.stringify(widget),
            },
        });
    }

    async deleteWidget(widget) {
        await this.$apollo.mutate({
            mutation: DELETE_WIDGET,
            variables: {
                id: widget.id,
            },
        });
        this.$apollo.queries.dashboard.refetch();
        this.$buefy.toast.open('Widget removed');
    }

    async saveDashboard() {
        this.$buefy.toast.open('Dashboard saved');
    }

    share() {
        const routeData = this.$router.resolve({
            name: 'DashboardView',
            params: { projectId: this.projectId, dashboardId: this.dashboardId, mode: 'view' },
        });
        window.open(routeData.href, '_blank');
    }

    openDeleteDashboardModal() {
        this.$buefy.dialog.confirm({
            title: 'Deleting dashboard',
            message: 'Are you sure you want to <b>delete</b> this dashboard?',
            confirmText: 'Delete dashboard',
            type: 'is-danger',
            hasIcon: true,
            onConfirm: () => this.deleteDashboard(),
        });
    }

    async deleteDashboard() {
        await this.$apollo.mutate({
            mutation: DELETE_DASHBOARD,
            variables: {
                id: this.dashboardId,
            },
        });

        this.$buefy.toast.open('Dashboard deleted');
        this.$router.replace({ name: 'Project', params: { projectId: this.projectId } });
    }
}
</script>
