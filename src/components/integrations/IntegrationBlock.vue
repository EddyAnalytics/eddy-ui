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
                <integration-form :integration="integration" />
            </div>
        </div>

        <footer class="card-footer">
            <a class="card-footer-item" @click="save()">Save</a>
            <a class="card-footer-item" @click="cancel()">Reset</a>
            <a class="card-footer-item has-text-danger" @click="remove()">Remove</a>
        </footer>
    </b-collapse>
</template>

<style lang="scss" scoped>
.card-header-icon {
    position: absolute;
    right: 0;
}
</style>

<script>
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import IntegrationForm from '@/components/integrations/IntegrationForm';

@Component({
    components: {
        IntegrationForm,
    },
})
export default class IntegrationBlock extends Vue {
    @Prop() integration;

    save() {
        this.$buefy.snackbar.open('Edding integration configuration is disabled');
    }

    cancel() {
        this.$buefy.snackbar.open('Edding integration configuration is disabled');
    }

    remove() {
        this.$buefy.snackbar.open('Deleting integration configuration is disabled');
    }
}
</script>
