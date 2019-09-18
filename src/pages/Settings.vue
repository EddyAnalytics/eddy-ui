<template>
    <main class="container">
        <section class="section">
            <h1 class="title">Settings</h1>
            <br />
            <h2 class="subtitle">System Status</h2>
            <h2 class="subtitle">System Settings</h2>
            <h2 class="subtitle">Kafka</h2>
            <h2 class="subtitle">Flink</h2>
            <h2 class="subtitle">Spark</h2>
        </section>
    </main>
</template>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component
export default class Settings extends Vue {}
</script>
