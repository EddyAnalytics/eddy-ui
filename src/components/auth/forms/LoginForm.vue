<template>
    <div>
        <form class="form--login" @submit.prevent="login">
            <div class="block--small">
                <h2>
                    {{ $t('auth.log_in_with') }}
                    <strong>{{ $t('auth.email').toLowerCase() }}</strong>
                    {{ $t('auth.and') }}
                    <strong>{{ $t('auth.password') }}</strong>
                </h2>

                <div v-if="errorCode" class="alert--auth">
                    <p>{{ localizedErrorMessage }}</p>
                </div>
            </div>
            <div class="block--small--bg">
                <div class="form__field">
                    <input
                        type="email"
                        name="email"
                        required
                        v-model="email"
                        class="form__input--text"
                        :class="{ 'has-value': email }"
                    />
                    <label class="form__label">{{ $t('auth.email') }}</label>
                </div>
                <password-field name="password" v-model="password" :label="$t('auth.password')" />
                <div class="link_block">
                    <router-link :to="{ name: 'reset' }">
                        {{ $t('auth.link_forgot_password') }}
                    </router-link>
                </div>
                <div class="form__buttons">
                    <button type="submit" class="button--cta">
                        {{ $t('auth.button_signin') }}
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { AUTH } from '@/store/auth';
import { ERROR_CODE, localizeErrorCode } from '@/api/errors';
import PasswordField from '@/components/general/PasswordField';

@Component({
    components: { PasswordField },
})
export default class LoginForm extends Vue {
    email = 'eve.holt@reqres.in';
    password = 'cityslicka';
    passwordVisible = false;
    busy = false;
    errorCode = ERROR_CODE.NONE;

    togglePassword() {
        this.passwordVisible = !this.passwordVisible;
    }

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
                        name: 'Home',
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
