<template>
    <div>
        {{ properties }}
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
