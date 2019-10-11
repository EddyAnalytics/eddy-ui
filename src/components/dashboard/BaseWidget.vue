<style lang="scss" scoped>
.widget__chart {
    max-height: 300px;
}
</style>

<script>
import { Component, Prop, Vue } from 'vue-property-decorator';
import KAFKA_TOPICS_ACTIVITY from '@/graphql/subscriptions/kafkaTopicsActivity.gql';

@Component
export default class BaseWidget extends Vue {
    @Prop() widget;

    MAX_DP = 4;

    labels = [];
    data = [];

    get chartData() {
        return {
            labels: this.labels,
            datasets: [
                {
                    label: 'Label 1',
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
            legend: this.widget.config.showLegend,
            animation: {
                animateScale: true,
                animateRotate: true,
            },
            scales: {
                xAxes: [
                    this.widget.config.useReceiveTimeScale
                        ? {
                              type: 'time',
                          }
                        : {},
                ],
            },
        };
    }

    created() {
        this.$apollo.addSmartSubscription('barChartWidgetSubscription', {
            query: KAFKA_TOPICS_ACTIVITY,
            variables() {
                return {
                    topics: this.widget.config.topics,
                };
            },
            result({ data: { topicsActivity } }) {
                const label = this.widget.config.useReceiveTimeScale
                    ? new Date()
                    : this.getVal(topicsActivity, this.widget.config.xAxisKey);
                const point = this.getVal(topicsActivity, this.widget.config.yAxisKey);

                if (!this.widget.config.useReceiveTimeScale) {
                    this.labels.push(label);
                }
                console.log('Add data point', topicsActivity, label, point);
                this.data.push({ x: label, y: point });
            },
        });
    }

    getVal(object, path) {
        return path.split('.').reduce((res, prop) => res[prop], object);
    }
}
</script>
