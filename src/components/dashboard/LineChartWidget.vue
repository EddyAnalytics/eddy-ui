<template>
    <article>
        <line-chart class="widget__chart" :chart-data="chartData" :options="options" />
    </article>
</template>

<script>
import { Component } from 'vue-property-decorator';
import BaseWidget from '@/components/dashboard/BaseWidget';
import LineChart from '@/components/charts/LineChart.js';

@Component({
    components: {
        LineChart,
    },
})
export default class LineChartWidget extends BaseWidget {}
</script>
