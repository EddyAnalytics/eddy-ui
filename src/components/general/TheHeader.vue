<template>
    <b-navbar fixed-top>
        <template #brand>
            <b-navbar-item tag="router-link" :to="{ name: isLoggedIn ? 'Projects' : 'Landing' }">
                <img
                    src="@/assets/img/logo.svg"
                    width="100"
                    height="32"
                    alt="Eddy Data Analytics logo"
                />
            </b-navbar-item>
        </template>

        <template #start>
            <template v-if="isLoggedIn">
                <b-navbar-item tag="router-link" :to="{ name: 'Projects' }">
                    {{ $t('menu.projects') }}
                </b-navbar-item>
                <b-navbar-item tag="router-link" :to="{ name: 'Integrations' }">
                    {{ $t('menu.integrations') }}
                </b-navbar-item>
                <b-navbar-item tag="router-link" :to="{ name: 'Settings' }">
                    {{ $t('menu.settings') }}
                </b-navbar-item>
            </template>
        </template>

        <template #end>
            <lang-dropdown />

            <b-navbar-item tag="router-link" :to="{ name: 'Profile' }">
                {{ username }}
            </b-navbar-item>

            <b-navbar-item tag="div">
                <div class="buttons">
                    <a v-if="isLoggedIn" class="button is-light" @click="signOut">
                        Log out
                    </a>
                    <template v-else>
                        <a class="button is-primary" @click="goToLogin">
                            <strong>Log in</strong>
                        </a>
                        <!-- <a class="button is-light">
                            Register
                        </a> -->
                    </template>
                </div>
            </b-navbar-item>
        </template>
    </b-navbar>
</template>

<style lang="scss" scoped>
.navbar {
    box-shadow: 0 2px 0 0 whitesmoke;
}
</style>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { AUTH } from '@/store/auth';
import LangDropdown from '@/components/general/LangDropdown';

@Component({
    components: {
        LangDropdown,
    },
})
export default class TheHeader extends Vue {
    goToLogin() {
        this.$router.push({
            name: 'sign-in',
        });
    }

    signOut() {
        this.$store.dispatch(AUTH.LOGOUT).then(() => {
            this.$router.replace({
                name: 'sign-in',
            });
        });
    }

    get username() {
        return this.$store.getters[AUTH.GET_USERNAME];
    }

    get isLoggedIn() {
        return this.$store.getters[AUTH.IS_AUTHENTICATED];
    }
}
</script>
