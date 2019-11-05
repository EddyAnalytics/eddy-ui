<style lang="scss">
.widget__chart {
    max-height: 280px;
}
</style>
<script>
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import KAFKA_TOPICS_ACTIVITY from '@/graphql/subscriptions/kafkaTopicsActivity.gql';

@Component
export default class BaseWidget extends Vue {
    @Prop() widget;
    @Prop({ type: Number, default: 0 }) start;

    DEFAULT_COLORS = ['#11c2e9', '#00ccc3', '#48cd7d', '#a9c32d', '#ffa600'];

    dataPoints = {};
    labels = [];
    data = [];

    get chartData() {
        return {
            labels: this.labels,
            datasets: [
                {
                    label: this.widget.config.yAxisKey,
                    backgroundColor: this.backgroundColors,
                    data: this.data,
                },
            ],
        };
    }

    get options() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: this.widget.config.showLegend,
                position: 'bottom',
            },
            animation: {
                animateScale: true,
                animateRotate: true,
            },
            title: {
                display: this.widget.config.showTitle,
                text: this.widget.label,
            },
            scales: this.getScalesOptions(),
        };
    }

    get backgroundColors() {
        if (this.widget.type === 'PieChartWidget') {
            return new Array(this.data.length + 1).fill(this.DEFAULT_COLORS).flat();
        } else {
            return this.DEFAULT_COLORS[0];
        }
    }

    getScalesOptions() {
        const xAxes = [];
        if (this.widget.type !== 'PieChartWidget') {
            xAxes.push({ type: 'time' });
        }
        return {
            xAxes,
        };
    }

    created() {
        this.subscribeToData();
    }

    @Watch('start')
    onStartChange() {
        this.dataPoints = {};
        this.data = [];
        this.$apollo.subscriptions.chartData.refresh();
    }

    subscribeToData() {
        this.$apollo.addSmartSubscription('chartData', {
            query: KAFKA_TOPICS_ACTIVITY,
            variables() {
                return {
                    topics: this.widget.config.topics,
                    from: this.start,
                };
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
