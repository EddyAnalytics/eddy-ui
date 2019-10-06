<template>
    <article class="p-t-md">
        <b-steps type="is-small" :animated="false" v-model="step">
            <b-step-item label="Type" :clickable="true">
                <br />
                <b-tabs type="is-toggle" v-model="chartType" expanded>
                    <b-tab-item
                        v-for="chartType in chartTypes"
                        :key="chartType.id"
                        :label="chartType.label"
                        :icon="chartType.icon"
                    ></b-tab-item>
                </b-tabs>
            </b-step-item>
            <b-step-item label="Data" :clickable="true">
                <strong>X-axis</strong>
                <br />
                <strong>Y-axis</strong>
            </b-step-item>
            <b-step-item label="Options" :clickable="true">
                <b-checkbox>Title</b-checkbox>
                <br />
                <b-checkbox>Legend</b-checkbox>
                <br />
                <b-checkbox>Use logaritmic scale</b-checkbox>
            </b-step-item>
        </b-steps>
    </article>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class AddWidget extends Vue {
    step = 0;
    chartTypes = [
        { id: 0, type: 'BarChartWidget', label: 'Bar', icon: 'chart-bar' },
        { id: 1, type: 'PieChartWidget', label: 'Pie', icon: 'chart-donut' },
        { id: 2, type: 'LineChartWidget', label: 'Line', icon: 'chart-line' },
        { id: 3, type: 'AreaChartWidget', label: 'Area', icon: 'chart-areaspline' },
    ];
    chartType = 0;
}
</script>
