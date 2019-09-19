<template>
    <main class="container">
        <section class="section">
            <h1 class="title is-1 is-spaced">Settings</h1>
            <h2 class="subtitle is-3">System Status</h2>
            <h2 class="subtitle is-3">System Settings</h2>
            <h2 class="subtitle is-3">Kafka</h2>
            <h2 class="subtitle is-3">Flink</h2>
            <h2 class="subtitle is-3">Spark</h2>
        </section>
    </main>
</template>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component
export default class Settings extends Vue {}
</script>
