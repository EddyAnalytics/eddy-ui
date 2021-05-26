<template>
    <form @submit.prevent="save()">
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Block properties</p>
            </header>
            <section class="modal-card-body">
                <component
                    v-if="properties.component"
                    :is="properties.component"
                    :properties="properties"
                />
                <div v-else>No configurable properties</div>
            </section>
            <footer class="modal-card-foot">
                <button class="button is-primary">
                    Save
                </button>
                <button class="button" type="button" @click="$parent.close()">Close</button>
            </footer>
        </div>
    </form>
</template>

<script>
import { Component, Prop, Vue } from 'vue-property-decorator';
import BeamPythonProperties from './block-properties/BeamPythonProperties';
import BeamSQLProperties from './block-properties/BeamSQLProperties';
import DBConnectorProperties from './block-properties/DBConnectorProperties';
import FlinkSQLProperties from './block-properties/FlinkSQLProperties';
import KafkaPublisherProperties from './block-properties/KafkaPublisherProperties';
import KafkaSubscriberProperties from './block-properties/KafkaSubscriberProperties';

@Component({
    components: {
        BeamPythonProperties,
        BeamSQLProperties,
        DBConnectorProperties,
        FlinkSQLProperties,
        KafkaPublisherProperties,
        KafkaSubscriberProperties,
    },
})
export default class PipelineBlockForm extends Vue {
    @Prop() block;

    properties = {};

    created() {
        this.properties = JSON.parse(JSON.stringify(this.block.properties));
    }

    save() {
        this.$emit('save', { ...this.block, properties: this.properties });
        this.$parent.close();
    }
}
</script>
