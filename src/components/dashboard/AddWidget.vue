<template>
    <article class="p-t-md">
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

                <b-checkbox v-if="widgetType !== 'PieChartWidget'" v-model="useReceiveTimeScale">
                    Use receive time scale
                </b-checkbox>

                <b-field
                    v-if="!useReceiveTimeScale || widgetType === 'PieChartWidget'"
                    :label="labelsKeyLabel"
                >
                    <b-input v-model="xAxisKey" />
                </b-field>

                <b-field :label="valuesKeyLabel">
                    <b-input v-model="yAxisKey" />
                </b-field>
            </b-step-item>
            <b-step-item label="Options" :clickable="true">
                <b-checkbox>Title</b-checkbox>
                <br />
                <b-checkbox>Legend</b-checkbox>
                <br />
                <b-checkbox>Use logaritmic scale</b-checkbox>

                <b-button
                    type="is-primary"
                    class="step__save-btn"
                    @click="addWidget"
                    :disabled="!topic || !this.yAxisKey"
                >
                    Add
                </b-button>
            </b-step-item>
        </b-steps>
    </article>
</template>

<style lang="scss" scoped>
.step__save-btn {
    float: right;
    top: 3.33rem;
}
</style>

<script>
import { Component, Prop, Vue } from 'vue-property-decorator';
import PROJECT_QUERY from '@/graphql/queries/project.gql';

@Component
export default class AddWidget extends Vue {
    @Prop() topics;

    step = 0;
    chartTypes = [
        { id: 0, type: 'BarChartWidget', label: 'Bar', icon: 'chart-bar' },
        { id: 1, type: 'LineChartWidget', label: 'Line', icon: 'chart-line' },
        { id: 2, type: 'PieChartWidget', label: 'Pie', icon: 'chart-donut' },
        { id: 3, type: 'AreaChartWidget', label: 'Area', icon: 'chart-areaspline', disabled: true },
    ];
    chartTypeIndex = 0;

    topic = '';
    topicAutocompleteModel = '';
    useReceiveTimeScale = true;
    xAxisKey = null;
    yAxisKey = null;
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
    }

    addWidget() {
        this.$emit('addWidget', {
            type: this.widgetType,
            config: {
                topics: [this.topic],
                useReceiveTimeScale: this.useReceiveTimeScale,
                xAxisKey: this.xAxisKey,
                yAxisKey: this.yAxisKey,
                showLegend: this.showLegend,
            },
        });
    }

    get widgetType() {
        return this.chartTypes[this.chartTypeIndex].type;
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
