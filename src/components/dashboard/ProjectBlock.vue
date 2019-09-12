<template>
    <block v-if="project">
        <div class="project-block">
            <img :src="project.logo" class="project-block__logo" />
            <div class="project-block__title">{{ project.name }}</div>
            <div class="project-block__description">{{ project.description }}</div>
        </div>
    </block>
</template>
<style lang="scss" scoped>
.project-block {
    width: 20rem;
    cursor: pointer;

    .project-block__logo {
        min-height: 10rem;
    }

    .project-block__title,
    .project-block__description {
        text-align: center;
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
export default class ProjectBlock extends Vue {
    @Prop() project;
}
</script>
