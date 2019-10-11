<template>
    <article>
        <bar-chart class="widget__chart" :chart-data="chartData" :options="options" />
    </article>
</template>

<script>
import { Component } from 'vue-property-decorator';
import BaseWidget from '@/components/dashboard/BaseWidget';
import BarChart from '@/components/charts/BarChart.js';

@Component({
    components: {
        BarChart,
    },
})
export default class BarChartWidget extends BaseWidget {}
</script>
