<template>
    <section v-if="integration">
        <b-field label="Label">
            <b-input v-model="integration.label"></b-input>
        </b-field>

        <template v-if="integration.config">
            <b-field
                v-for="key in Object.keys(this.integration.config)"
                :key="key"
                :label="$options.filters.capitalize(key)"
            >
                <b-input
                    :type="isHiddenField(key) ? 'password' : 'input'"
                    v-model="integration.config[key]"
                    :password-reveal="isHiddenField(key)"
                ></b-input>
            </b-field>
        </template>
    </section>
</template>

<script>
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class DataConnectorForm extends Vue {
    @Prop() integration;

    isHiddenField(key) {
        return ['password'].includes(key);
    }
}
</script>
