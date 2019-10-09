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
                    ></b-tab-item>
                </b-tabs>
            </b-step-item>
            <b-step-item label="Data" :clickable="true">
                <b-field label="Topic">
                    <b-select v-model="topic" :expanded="true">
                        <option v-for="topic in topics" :value="topic" :key="topic">
                            {{ topic }}
                        </option>
                    </b-select>
                </b-field>

                <b-checkbox v-model="useReceiveTimeScale">Use receive time scale</b-checkbox>

                <b-field v-if="!useReceiveTimeScale" label="X-Axis Key">
                    <b-input v-model="xAxisKey" />
                </b-field>

                <b-field label="Y-Axis Key">
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

@Component
export default class AddWidget extends Vue {
    @Prop() topics;

    step = 0;
    chartTypes = [
        { id: 0, type: 'BarChartWidget', label: 'Bar', icon: 'chart-bar' },
        { id: 1, type: 'PieChartWidget', label: 'Pie', icon: 'chart-donut' },
        { id: 2, type: 'LineChartWidget', label: 'Line', icon: 'chart-line' },
        { id: 3, type: 'AreaChartWidget', label: 'Area', icon: 'chart-areaspline' },
    ];
    chartTypeIndex = 0;

    topic = null;
    useReceiveTimeScale = true;
    xAxisKey = null;
    yAxisKey = null;

    showLegend = false;

    addWidget() {
        this.$emit('addWidget', {
            type: this.chartTypes[this.chartTypeIndex].type,
            config: {
                topics: [this.topic],
                useReceiveTimeScale: this.useReceiveTimeScale,
                xAxisKey: this.xAxisKey,
                yAxisKey: this.yAxisKey,
                showLegend: this.showLegend,
            },
        });
    }
}
</script>
