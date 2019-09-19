<template>
    <article class="column is-narrow">
        <div v-if="dataConnector" class="card dashboard-card">
            <div class="card-image has-text-centered">
                <figure class="image is-48x48 is-inline-block">
                    <img :src="dataConnector.logo" alt="Data connector logo" />
                </figure>
            </div>
            <div class="card-content">
                <div class="content has-text-centered">
                    <div>{{ dataConnector.name }}</div>
                </div>
            </div>
        </div>

        <div v-else class="card dashboard-card">
            <div class="card-image has-text-centered">
                <b-icon icon="plus" size="is-large" type="is-primary"></b-icon>
            </div>
            <div class="card-content">
                <div class="content has-text-centered">
                    <div>Add new</div>
                </div>
            </div>
        </div>
    </article>
</template>

<style lang="scss" scoped>
.dashboard-card {
    min-width: 10rem;
    cursor: pointer;

    .card-image {
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
export default class DataConnectorBlock extends Vue {
    @Prop() dataConnector;
}
</script>
