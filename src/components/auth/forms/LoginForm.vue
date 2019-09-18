<template>
    <section>
        <h2 class="is-size-2 has-text-weight-semibold has-text-centered">
            {{ $t('auth.log_in_with') }}
            <strong>{{ $t('auth.email').toLowerCase() }}</strong>
            {{ $t('auth.and') }}
            <strong>{{ $t('auth.password').toLowerCase() }}</strong>
        </h2>
        <hr />

        <b-field :label="$t('auth.email')">
            <b-input type="email" maxlength="30" v-model="email"></b-input>
        </b-field>

        <b-field :label="$t('auth.password')">
            <b-input type="password" v-model="password" password-reveal></b-input>
        </b-field>

        <div class="is-pulled-right">
            <router-link :to="{ name: 'reset' }">
                {{ $t('auth.link_forgot_password') }}
            </router-link>
        </div>

        <b-button type="is-primary" class="m-t-md" @click="login">
            {{ $t('auth.button_signin') }}
        </b-button>
    </section>
</template>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { AUTH } from '@/store/auth';
import { ERROR_CODE, localizeErrorCode } from '@/api/errors';

@Component()
export default class LoginForm extends Vue {
    email = 'eve.holt@reqres.in';
    password = 'cityslicka';
    errorCode = ERROR_CODE.NONE;

    get passwordType() {
        return this.passwordVisible ? 'text' : 'password';
    }

    get toggleIcon() {
        return this.passwordVisible ? 'mdi-eye-off' : 'mdi-eye';
    }

    async login() {
        this.errorCode = ERROR_CODE.NONE;

        const credentials = {
            email: this.email,
            password: this.password,
        };
        this.$store
            .dispatch(AUTH.LOGIN, credentials)
            .then(() => {
                const redirect = this.$route.query.redirect;
                if (redirect) {
                    this.$router.replace(redirect);
                } else {
                    this.$router.replace({
                        name: 'Dashboard',
                    });
                }
            })
            .catch(error => {
                this.errorCode = error.errorCode;
                throw error;
            });
    }

    get localizedErrorMessage() {
        if (this.errorCode === ERROR_CODE.CREDENTIALS) {
            return this.$t('auth.wrong_credentials');
        } else {
            return localizeErrorCode(this.errorCode);
        }
    }
}
</script>
