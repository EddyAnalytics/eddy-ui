<template>
    <article class="column is-narrow">
        <div v-if="project" class="card project-card">
            <div class="card-image">
                <figure class="image is-128x128 is-inline-block">
                    <img :src="project.logo" alt="Project logo" />
                </figure>
            </div>
            <div class="card-content">
                <div class="content">
                    <h5>{{ project.name }}</h5>
                    {{ project.description }}
                </div>
            </div>
        </div>
    </article>
</template>

<style lang="scss" scoped>
.project-card {
    min-width: 20rem;
    cursor: pointer;

    .card-image {
        text-align: center;
        .image {
            padding-top: 15%;
        }
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
