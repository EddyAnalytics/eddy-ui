<template>
    <div class="box has-background-primary">
        <div class="content">
            <h1 class="has-text-white">{{ data.length }}</h1>
            <h4 v-if="widget && widget.label" class="has-text-white">{{ widget.label }}</h4>
        </div>
    </div>
</template>

<script>
import { Component } from 'vue-property-decorator';
import BaseWidget from '@/components/dashboard/BaseWidget';

@Component
export default class CounterWidget extends BaseWidget {}
</script>
