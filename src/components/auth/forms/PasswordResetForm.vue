<template>
    <div>
        <transition name="fade" mode="out-in">
            <div v-if="newPasswordSent" class="block--small">
                <h2>{{ $t('auth.header_password_changed') }}</h2>
                <p>{{ $t('auth.message_password_changed') }}</p>
                <router-link :to="{ name: 'sign-in' }" tag="button" class="button--cta">
                    {{ $t('auth.button_complete_reset') }}
                </router-link>
            </div>
            <form v-else @submit.prevent="submit" class="form--login">
                <div class="block--small">
                    <h3>{{ $t('auth.header_reset_password') }}</h3>
                    <div class="alert--auth" v-if="errorCode">
                        <p>{{ localizedErrorMessage }}</p>
                    </div>
                    <div class="form__field">
                        <input
                            type="email"
                            autocomplete="email"
                            name="email"
                            required
                            v-model="email"
                            class="form__input--text"
                            :class="{ 'has-value': email }"
                        />
                        <label class="form__label">
                            {{ $t('auth.email') }}
                        </label>
                    </div>
                    <password-field
                        v-model="password"
                        :label="$t('auth.new_password')"
                        @input="verifyPassword"
                        @invalid="enableMismatchWarning"
                        ref="password"
                    />
                    <password-field
                        v-model="passwordRepeat"
                        :label="$t('auth.new_password_repeat')"
                        @input="verifyPassword"
                        @invalid="enableMismatchWarning"
                        ref="passwordRepeat"
                    />
                    <div class="alert--auth" v-if="showMismatchWarning">
                        <p>{{ mismatchWarning }}</p>
                    </div>
                    <div class="form__buttons">
                        <router-link
                            :to="{ name: 'sign-in' }"
                            tag="button"
                            type="button"
                            class="button--alt"
                        >
                            {{ $t('auth.button_cancel') }}
                        </router-link>
                        <button type="submit" class="button--cta">
                            {{ $t('auth.button_reset') }}
                        </button>
                    </div>
                </div>
            </form>
        </transition>
    </div>
</template>

<script>
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { ERROR_CODE, localizeErrorCode } from '@/api/errors';
import PasswordField from '@/components/general/PasswordField';

@Component({
    components: { PasswordField },
})
export default class PasswordResetForm extends Vue {
    newPasswordSent = false;
    token = '';
    email = '';
    password = '';
    passwordRepeat = '';
    showMismatchWarning = false;
    busy = false;
    errorCode = ERROR_CODE.NONE;

    created() {
        this.token = this.$route.params.token;
        if (!this.token) {
            this.$router.replace({ name: 'reset' });
        }
    }

    submit() {
        this.showMismatchWarning = false;
        this.busy = true;
        this.errorCode = ERROR_CODE.NONE;

        const data = {
            email: this.email,
            token: this.token,
            password: this.password,
            repeat: this.passwordRepeat,
        };

        this.axios
            .post('passowrd-reset', data)
            .then(() => {
                this.newPasswordSent = true;
            })
            .catch(error => {
                this.errorCode = error.errorCode;
                throw error;
            })
            .finally(() => {
                this.busy = false;
            });
    }

    get localizedErrorMessage() {
        if (this.errorCode === ERROR_CODE.BAD_REQUEST) {
            return this.$t('auth.message_invalid_hash');
        } else {
            return localizeErrorCode(this.errorCode);
        }
    }

    get passwordsMismatch() {
        const a = this.password;
        const b = this.passwordRepeat;
        return a.length && b.length && a !== b;
    }

    get mismatchWarning() {
        return this.$t('auth.password_mismatch');
    }

    @Watch('mismatchWarning')
    @Watch('passwordsMismatch')
    verifyPassword() {
        this.$refs.password.setCustomValidity(this.passwordsMismatch ? this.mismatchWarning : '');
        if (!this.passwordsMismatch) {
            this.showMismatchWarning = false;
        }
    }

    enableMismatchWarning() {
        this.showMismatchWarning = this.passwordsMismatch;
    }
}
</script>
