<template>
    <p class="alert--error" v-if="code">{{ message }}</p>
</template>
<script>
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { localizeErrorCode } from '@/api/errors';

@Component
export default class ErrorAlert extends Vue {
    @Prop()
    code;

    get message() {
        return localizeErrorCode(this.code);
    }
}
</script>
