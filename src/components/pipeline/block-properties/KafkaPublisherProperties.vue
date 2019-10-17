<template>
    <div>
        <h2 class="subtitle">Kafka Publisher</h2>
        <b-field label="Topic">
            <b-input v-model="properties.topic" />
        </b-field>
    </div>
</template>

<script>
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class KafkaPublisherProperties extends Vue {
    @Prop() properties;
}
</script>
