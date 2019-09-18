<template>
    <b-collapse v-if="integration" class="card" :open="false">
        <div slot="trigger" slot-scope="props" class="card-header" role="button">
            <article class="media">
                <figure class="media-left">
                    <p class="image is-64x64 m-md">
                        <img :src="integration.logo" />
                    </p>
                </figure>

                <div class="media-content">
                    <div class="content p-md">
                        <p>
                            <strong>{{ integration.name }}</strong>
                            <br />
                            {{ integration.description }}
                        </p>
                    </div>
                </div>
            </article>

            <a class="card-header-icon">
                <b-icon :icon="props.open ? 'menu-up' : 'menu-down'"></b-icon>
            </a>
        </div>

        <div class="card-content">
            <div class="content">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis
                mauris.
            </div>
        </div>

        <footer class="card-footer">
            <a class="card-footer-item">Edit</a>
            <a class="card-footer-item">Cancel</a>
            <a class="card-footer-item has-text-danger">Delete</a>
        </footer>
    </b-collapse>
</template>

<script>
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class IntegrationBlock extends Vue {
    @Prop() integration;
}
</script>
