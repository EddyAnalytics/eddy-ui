<template>
    <div>
        <div class="col-12">
            <h1>Dashboard</h1>
        </div>
        <div class="col-12">
            <div class="row">
                <block v-for="project in projects" :key="project.id">
                    {{ project.name }}
                </block>
            </div>
        </div>

        <apollo-example />
    </div>
</template>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import Block from '@/components/general/Block';
import ApolloExample from '@/components/ApolloExample';

@Component({
    components: {
        Block,
        ApolloExample,
    },
})
export default class Dashboard extends Vue {
    projects = [
        {
            id: 0,
            name: 'dsa',
        },
        { id: 1, name: 'dsaeweq' },
    ];
}
</script>
