<template>
    <div>
        <!-- <div>{{ info }}</div> -->
        <div>
            <strong>Flink version:</strong>
            {{ info[0]['flink-version'] }}
        </div>
        <div>
            <strong>Jobs:</strong>
            <div v-for="job in info[1]['jobs']" :key="job.id">{{ job }}</div>
        </div>
    </div>
</template>

<script>
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class FlinkClusterInfoBlock extends Vue {
    @Prop() info;
}
</script>
