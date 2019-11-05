<template>
    <article>
        <doughnut-chart class="widget__chart" :chart-data="chartData" :options="options" />
    </article>
</template>

<script>
import { Component } from 'vue-property-decorator';
import BaseWidget from '@/components/dashboard/BaseWidget';
import DoughnutChart from '@/components/charts/DoughnutChart.js';

@Component({
    components: {
        DoughnutChart,
    },
})
export default class PieChartWidget extends BaseWidget {}
</script>
