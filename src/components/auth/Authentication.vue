<template>
    <transition name="fade" mode="out-in">
        <router-view></router-view>
    </transition>
</template>
<script>
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Authentication extends Vue {}
</script>
