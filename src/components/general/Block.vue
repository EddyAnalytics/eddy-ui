<template>
    <div class="block m-r-md">
        <div class="block__content">
            <slot></slot>
        </div>
    </div>
</template>
<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component
export default class Block extends Vue {}
</script>
