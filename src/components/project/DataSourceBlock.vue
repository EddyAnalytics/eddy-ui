<template>
    <block v-if="dataSource">
        <div class="data-source-block">
            <img :src="dataSource.logo" class="data-source-block__logo" />
            <div class="data-source-block__title">{{ dataSource.name }}</div>
        </div>
    </block>
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
import Block from '@/components/general/Block';

@Component({
    components: {
        Block,
    },
})
export default class DataSourceBlock extends Vue {
    @Prop() dataSource;
}
</script>
