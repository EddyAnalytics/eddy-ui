<script>
import { Component, Prop, Vue } from 'vue-property-decorator';
import KAFKA_TOPICS_ACTIVITY from '@/graphql/subscriptions/kafkaTopicsActivity.gql';

@Component
export default class BaseWidget extends Vue {
    @Prop() widget;
    @Prop({ type: Number, default: 0 }) start;

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
            variables: {
                topics: this.widget.config.topics,
                from: this.start,
            },
            result({ data: { topicsActivity } }) {
                const label = this.widget.config.useReceiveTimeScale
                    ? new Date()
                    : this.getVal(topicsActivity, this.widget.config.xAxisKey);
                const point = this.getVal(topicsActivity, this.widget.config.yAxisKey);

                if (!this.widget.config.useReceiveTimeScale) {
                    this.labels.push(label);
                }
                this.data.push(point);
            },
        });
    }

    getVal(object, path) {
        return path.split('.').reduce((res, prop) => res[prop], object);
    }
}
</script>
