<template>
    <section v-if="dataConnectorModel">
        <div class="columns">
            <div class="column">
                <b-field label="Type">
                    <b-select v-model="dataConnectorModel.type">
                        <option
                            v-for="option in connectorTypes"
                            :value="option"
                            :key="option"
                            :disabled="option !== 'Debezium'"
                        >
                            {{ option }}
                        </option>
                    </b-select>
                </b-field>

                <b-field label="Name">
                    <b-input v-model="dataConnectorModel.name"></b-input>
                </b-field>

                <template v-if="dataConnectorModel.config">
                    <b-field
                        v-for="key in halfFields"
                        :key="key"
                        :label="$options.filters.capitalize(key)"
                    >
                        <b-input v-model="dataConnectorModel.config[key]"></b-input>
                    </b-field>
                    <b-button type="is-primary" class="m-r-sm" outlined @click="save()">
                        Save
                    </b-button>
                </template>
                <b-button outlined @click="cancel()">Cancel</b-button>
                <b-button
                    v-if="dataConnectorModel.id"
                    type="is-danger"
                    class="is-pulled-right"
                    outlined
                    @click="remove()"
                >
                    Delete
                </b-button>
            </div>

            <div class="column">
                <template v-if="dataConnectorModel.config">
                    <b-field
                        v-for="key in otherHalfFields"
                        :key="key"
                        :label="$options.filters.capitalize(key)"
                    >
                        <b-input v-model="dataConnectorModel.config[key]"></b-input>
                    </b-field>
                </template>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.dashboard-card {
    min-width: 10rem;
    cursor: pointer;

    .card-image {
        height: 4rem;
        overflow: hidden;
        padding-top: 1rem;
    }
}
</style>

<script>
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class DataConnectorForm extends Vue {
    @Prop() dataConnector;
    dataConnectorModel = {};

    connectorTypes = [
        'Debezium',
        'Twitter (Comming soon)',
        'Kafka Server (Comming soon)',
        'MQTT (Comming soon)',
    ];

    mounted() {
        this.dataConnectorModel = JSON.parse(JSON.stringify(this.dataConnector));
    }

    get halfFields() {
        const keysLength = Object.keys(this.dataConnectorModel.config).length;
        return Object.keys(this.dataConnectorModel.config).slice(0, keysLength / 2);
    }

    get otherHalfFields() {
        const keysLength = Object.keys(this.dataConnectorModel.config).length;
        return Object.keys(this.dataConnectorModel.config).slice(keysLength / 2);
    }

    save() {
        this.$emit('save', this.dataConnectorModel);
    }

    cancel() {
        this.$emit('cancel');
    }

    remove() {
        this.$emit('remove', this.dataConnectorModel);
    }
}
</script>
