<template>
    <div v-if="dataSource">
        <div class="data-source-block">
            <img :src="dataSource.logo" class="data-source-block__logo" />
            <div class="data-source-block__title">{{ dataSource.name }}</div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.data-source-block {
    cursor: pointer;
    text-align: center;

    .data-source-block__logo {
        height: 10rem;
        width: 10rem;
    }

    .data-source-block__title,
    .data-source-block__description {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>
<script>
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class DataSourceBlock extends Vue {
    @Prop() dataSource;
}
</script>
