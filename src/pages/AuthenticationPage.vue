<template>
    <authentication></authentication>
</template>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import Authentication from '@/components/auth/Authentication';

@Component({
    components: {
        Authentication,
    },
})
export default class AuthenticationPage extends Vue {
    name = 'authentication-page';
}
</script>
