<template>
    <form @submit.prevent="save()">
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Add a new widget</p>
            </header>
            <section class="modal-card-body" v-if="chartTypes.length">
                <b-steps type="is-small" :animated="false" v-model="step">
                    <b-step-item label="Type" :clickable="true">
                        <br />
                        <b-tabs type="is-toggle" v-model="chartTypeIndex" expanded>
                            <b-tab-item
                                v-for="chartType in chartTypes"
                                :key="chartType.id"
                                :label="chartType.label"
                                :icon="chartType.icon"
                                :disabled="chartType.disabled"
                            ></b-tab-item>
                        </b-tabs>
                    </b-step-item>
                    <b-step-item label="Data" :clickable="true">
                        <b-field v-if="project.pipelines" label="Pipeline">
                            <b-select v-model="pipelineId" placeholder="Select a pipeline" expanded>
                                <option
                                    v-for="option in project.pipelines"
                                    :value="option.id"
                                    :key="option.id"
                                >
                                    {{ option.label }}
                                </option>
                            </b-select>
                        </b-field>
                        <b-field v-if="pipelineId" label="Topic">
                            <b-autocomplete
                                v-model="topicAutocompleteModel"
                                open-on-focus
                                :data="filteredTopics"
                                @select="selectTopic"
                            ></b-autocomplete>
                        </b-field>

                        <b-field :label="labelsKeyLabel">
                            <b-input v-model="xAxisKey" />
                        </b-field>

                        <b-field :label="valuesKeyLabel">
                            <b-input v-model="yAxisKey" />
                        </b-field>
                    </b-step-item>
                    <b-step-item label="Options" :clickable="true">
                        <b-checkbox v-model="showTitle">Title</b-checkbox>
                        <br />
                        <b-field v-if="showTitle">
                            <b-input v-model="label" />
                        </b-field>
                        <b-checkbox v-model="showLegend">Legend</b-checkbox>
                        <br />
                        <b-checkbox disabled>Use logaritmic scale</b-checkbox>
                    </b-step-item>
                </b-steps>
            </section>
            <footer class="modal-card-foot">
                <b-button
                    type="is-primary"
                    class="step__save-btn"
                    @click="addWidget"
                    :disabled="!topic || !this.yAxisKey"
                >
                    Add
                </b-button>
                <button class="button" type="button" @click="$parent.close()">Close</button>
            </footer>
        </div>
    </form>
</template>

<script>
import { Component, Prop, Vue } from 'vue-property-decorator';
import PROJECT_QUERY from '@/graphql/queries/project.gql';
import WIDGET_TYPES_QUERY from '@/graphql/queries/widgetTypes.gql';

@Component
export default class AddWidgetForm extends Vue {
    @Prop() topics;

    step = 0;
    chartTypes = [];
    chartTypeIndex = 0;

    topic = '';
    topicAutocompleteModel = '';
    xAxisKey = null;
    yAxisKey = null;
    showTitle = false;
    label = '';
    showLegend = false;
    project = {};
    pipelineId = null;

    created() {
        this.projectId = this.$route.params.projectId;
        this.$apollo.addSmartQuery('project', {
            query: PROJECT_QUERY,
            variables() {
                return {
                    id: this.projectId,
                };
            },
            fetchPolicy: 'cache-and-network',
        });

        this.$apollo.addSmartQuery('widgetTypes', {
            query: WIDGET_TYPES_QUERY,
            result({ data: { widgetTypes } }) {
                this.chartTypes = widgetTypes.map(widgetType => {
                    return {
                        ...widgetType,
                        ...JSON.parse(widgetType.config),
                    };
                });
            },
        });
    }

    addWidget() {
        this.$emit('addWidget', {
            type: this.widgetType,
            typeId: this.widgetTypeId,
            label: this.label,
            config: {
                topics: [this.topic],
                xAxisKey: this.xAxisKey,
                yAxisKey: this.yAxisKey,
                showLegend: this.showLegend,
            },
        });
        this.$parent.close();
    }

    get widgetType() {
        return this.chartTypes[this.chartTypeIndex].type;
    }

    get widgetTypeId() {
        return this.chartTypes[this.chartTypeIndex].id;
    }

    get labelsKeyLabel() {
        switch (this.widgetType) {
            case 'PieChartWidget':
                return 'Labels key';
            default:
                return 'X-Axis Values Key';
        }
    }

    get valuesKeyLabel() {
        switch (this.widgetType) {
            case 'PieChartWidget':
                return 'Values key';
            default:
                return 'Y-Axis values key';
        }
    }

    selectTopic(option) {
        if (!option) return;
        this.topic = this.projectId + '.' + this.pipelineId + '.' + option;
    }

    get filteredTopics() {
        if (!this.topics) return [];
        const filteredTopics = this.topics.filter(topic => {
            const parts = topic.split('.');
            const isInProject = parts[0] && parts[0] == this.projectId;
            const isInPipeline = parts[1] && parts[1] == this.pipelineId;
            const matchesSearch =
                parts[2] &&
                parts[2]
                    .toString()
                    .toLowerCase()
                    .indexOf(this.topicAutocompleteModel.toLowerCase()) >= 0;
            return isInProject && isInPipeline && matchesSearch;
        });
        return filteredTopics.map(topic => topic.split('.')[2]);
    }
}
</script>
