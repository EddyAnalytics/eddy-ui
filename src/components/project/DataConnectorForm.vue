<template>
    <section v-if="dataConnectorModel">
        <div class="columns">
            <div class="column">
                <b-field label="Label">
                    <b-input v-model="dataConnectorModel.label"></b-input>
                </b-field>

                <b-field label="Data Connector Type">
                    <b-select
                        v-model="dataConnectorModel.dataConnectorType"
                        @input="onTypeSelected"
                        :expanded="true"
                    >
                        <option
                            v-for="(option, index) in dataConnectorTypes"
                            :value="option"
                            :key="option.label + '_' + index"
                            :disabled="option.label !== 'Debezium'"
                        >
                            {{ option.label }}
                        </option>
                    </b-select>
                </b-field>

                <template v-if="dataConnectorModel.config">
                    <b-field
                        v-for="key in halfFields"
                        :key="key"
                        :label="$options.filters.capitalize(key)"
                    >
                        <b-input
                            :type="isHiddenField(key) ? 'password' : 'input'"
                            v-model="dataConnectorModel.config[key]"
                            :password-reveal="isHiddenField(key)"
                        ></b-input>
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
                        <b-input
                            :type="isHiddenField(key) ? 'password' : 'input'"
                            v-model="dataConnectorModel.config[key]"
                            :password-reveal="isHiddenField(key)"
                        ></b-input>
                    </b-field>
                </template>
            </div>
        </div>
    </section>
</template>

<script>
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import DATA_CONNECTOR_TYPES_QUERY from '@/graphql/queries/dataConnectorTypes.gql';

@Component
export default class DataConnectorForm extends Vue {
    @Prop() dataConnector;
    dataConnectorModel = {};

    dataConnectorTypes = [];

    created() {
        this.$apollo.addSmartQuery('dataConnectorTypes', {
            query: DATA_CONNECTOR_TYPES_QUERY,
        });
    }

    mounted() {
        this.dataConnectorModel = JSON.parse(JSON.stringify(this.dataConnector));
        this.dataConnectorModel.config = this.dataConnectorModel.config
            ? JSON.parse(this.dataConnectorModel.config)
            : {};
    }

    onTypeSelected(dataConnectorType) {
        console.log('on type selected');
        this.dataConnectorModel.config = JSON.parse(dataConnectorType.config);
    }

    get halfFields() {
        const keysLength = Object.keys(this.dataConnectorModel.config).length;
        return Object.keys(this.dataConnectorModel.config).slice(0, keysLength / 2);
    }

    get otherHalfFields() {
        const keysLength = Object.keys(this.dataConnectorModel.config).length;
        return Object.keys(this.dataConnectorModel.config).slice(keysLength / 2);
    }

    isHiddenField(key) {
        return ['password'].includes(key);
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
