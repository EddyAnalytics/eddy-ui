<template>
    <div>
        <!-- <div class="horizontal-bg"></div> -->
        <authentication></authentication>
    </div>
</template>

<style lang="scss" scoped>
.horizontal-bg {
    position: absolute;
    left: -$indent-base/2;
    right: -$indent-base/2;
    top: 30rem;
    height: 50%;
    background: $color-theme-light;
    transform-origin: left top;
    transform: skewY(3deg);
}
</style>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import Authentication from '@/components/auth/Authentication';

@Component({
    components: {
        Authentication,
    },
})
export default class AuthenticationPage extends Vue {}
</script>
