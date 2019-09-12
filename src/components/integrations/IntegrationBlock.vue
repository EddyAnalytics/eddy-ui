<template>
    <block v-if="integration">
        <div class="integration-block">
            <div class="row">
                <div class="col-xs-12 col-md-2">
                    <img :src="integration.logo" class="integration-block__logo" />
                </div>
                <div class="col-xs-12 col-md-8">
                    <div class="integration-block__title">{{ integration.name }}</div>
                    <div class="integration-block__description">{{ integration.description }}</div>
                </div>
                <div class="col-xs-12 col-md-2">
                    <i class="mdi mdi-pencil"></i>
                    <span>Edit</span>
                </div>
            </div>
        </div>
    </block>
</template>
<style lang="scss" scoped>
.integration-block {
    .integration-block__logo {
        max-width: 10rem;
    }

    .integration-block__title,
    .integration-block__description {
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
export default class IntegrationBlock extends Vue {
    @Prop() integration;
}
</script>
