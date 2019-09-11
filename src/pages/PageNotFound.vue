<template>
    <div class="block--small">
        <h2>Sorry, deze pagina bestaat niet...</h2>
        <p>
            <router-link :to="{ name: 'Dashboard' }" class="button--cta">Ga terug</router-link>
        </p>
    </div>
</template>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component
export default class PageNotFound extends Vue {
    name = 'page-not-found';
}
</script>
