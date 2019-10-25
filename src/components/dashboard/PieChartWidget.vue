<template>
    <article>
        <doughnut-chart class="widget__chart" :chart-data="chartData" :options="options" />
    </article>
</template>

<style lang="scss" scoped>
.widget__chart {
    max-height: 300px;
}
</style>

<script>
import { Component, Prop, Vue } from 'vue-property-decorator';
import KAFKA_TOPICS_ACTIVITY from '@/graphql/subscriptions/kafkaTopicsActivity.gql';
import DoughnutChart from '@/components/charts/DoughnutChart.js';

@Component({
    components: {
        DoughnutChart,
    },
})
export default class PieChartWidget extends Vue {
    @Prop() widget;
    @Prop({ type: Number, default: 0 }) start;

    dataPoints = {};
    labels = [];
    data = [];

    get chartData() {
        return {
            labels: this.labels,
            datasets: [
                {
                    backgroundColor: '#12c2e9',
                    data: this.data,
                },
            ],
        };
    }

    get options() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                animateScale: true,
                animateRotate: true,
            },
        };
    }

    created() {
        this.$apollo.addSmartSubscription('pieChartWidgetSubscription', {
            query: KAFKA_TOPICS_ACTIVITY,
            variables: {
                topics: this.widget.config.topics,
                from: this.start,
            },
            result({ data: { topicsActivity } }) {
                const label = this.getVal(topicsActivity, this.widget.config.xAxisKey);
                const point = this.getVal(topicsActivity, this.widget.config.yAxisKey);

                this.dataPoints[label] = point;

                this.labels = [];
                this.data = [];
                for (let [key, value] of Object.entries(this.dataPoints)) {
                    if (key) {
                        this.labels.push(key);
                        this.data.push(value);
                    }
                }
            },
        });
    }

    getVal(object, path) {
        return path.split('.').reduce((res, prop) => res[prop], object);
    }
}
</script>
