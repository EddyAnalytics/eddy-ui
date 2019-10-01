<template>
    <article class="column is-narrow">
        <div v-if="project" class="card project-card">
            <div v-if="project.logo" class="card-image">
                <figure class="image is-128x128 is-inline-block">
                    <img :src="project.logo" alt="Project logo" />
                </figure>
            </div>
            <div v-else class="card-image">
                <b-icon icon="folder-outline" size="is-large" type="is-grey"></b-icon>
            </div>
            <div class="card-content">
                <div class="content">
                    <div>{{ project.name || `Project ${project.id}` }}</div>
                </div>
            </div>
        </div>

        <div v-else class="card project-card">
            <div class="card-image has-text-centered">
                <b-icon icon="plus" size="is-large" type="is-primary"></b-icon>
            </div>
            <div class="card-content">
                <div class="content has-text-centered">
                    <div>Add new project</div>
                </div>
            </div>
        </div>
    </article>
</template>

<style lang="scss" scoped>
.project-card {
    min-width: 13rem;
    cursor: pointer;

    .card-image {
        text-align: center;
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
export default class ProjectBlock extends Vue {
    @Prop() project;
}
</script>
