<template>
    <main class="container">
        <section class="section content">
            <h2>Sorry, this page does not exist</h2>
            <p>
                <router-link :to="{ name: 'Projects' }" class="button--cta">Go back</router-link>
            </p>
        </section>
    </main>
</template>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component
export default class PageNotFound extends Vue {
    name = 'page-not-found';
}
</script>
