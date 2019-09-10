<template>
    <form class="form--login" @submit.prevent="submit">
        <div class="block--small">
            <h2>{{ $t('change_password.header') }}</h2>
        </div>
        <div class="block--small--bg">
            <template v-if="success">
                <p>{{ $t('change_password.message_success') }}</p>
                <router-link :to="{ name: 'sign-in' }" type="button" class="button--cta">
                    {{ $t('change_password.button_to_login') }}
                </router-link>
            </template>
            <template v-else>
                <password-field
                    v-model="oldPassword"
                    :label="$t('change_password.label_old')"
                    @input="verifyPassword"
                    ref="oldPassword"
                />
                <password-field
                    v-model="newPassword"
                    :label="$t('change_password.label_new')"
                    @input="verifyPassword"
                    ref="newPassword"
                />
                <password-field
                    v-model="newPasswordRepeat"
                    :label="$t('change_password.label_repeat')"
                    @input="verifyPassword"
                    @invalid="enableMismatchWarning"
                    ref="newPasswordRepeat"
                />
                <div v-if="showMismatchWarning" class="alert--auth">
                    <p>{{ passwordError.error }}</p>
                </div>
                <div v-if="errorCode" class="alert--auth">
                    <p>{{ localizedErrorMessage }}</p>
                </div>
                <div class="link_block"></div>
                <div class="form__buttons">
                    <button type="submit" class="button--cta pull-right">
                        {{ $t('change_password.button_submit') }}
                    </button>
                    <router-link
                        :to="{ name: 'Profile' }"
                        type="button"
                        class="button--alt pull-left"
                    >
                        {{ $t('common.back') }}
                    </router-link>
                </div>
            </template>
        </div>
    </form>
</template>
<script>
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import PasswordField from '@/components/general/PasswordField';
import { ERROR_CODE, localizeErrorCode } from '@/api/errors';
import { api } from '@/api';
import { AUTH } from '@/store/auth';

@Component({
    components: { PasswordField },
})
export default class ChangePasswordForm extends Vue {
    oldPassword = '';
    newPassword = '';
    newPasswordRepeat = '';
    showMismatchWarning = false;
    busy = false;
    success = false;
    errorCode = ERROR_CODE.NONE;

    submit() {
        this.showMismatchWarning = false;
        this.busy = true;
        this.errorCode = ERROR_CODE.NONE;
        const data = {
            old: this.oldPassword,
            new: this.newPassword,
            repeat: this.newPasswordRepeat,
        };
        api.post('password-change', data)
            .then(() => {
                this.success = true;
                this.$store.commit(AUTH.SET_USER, null);
            })
            .catch(error => {
                if (error.errorCode === ERROR_CODE.FORBIDDEN)
                    this.errorCode = ERROR_CODE.WRONG_CURRENT_PASSWORD;
                else this.errorCode = error.errorCode;
                throw error;
            })
            .finally(() => {
                this.busy = false;
            });
    }

    get localizedErrorMessage() {
        return localizeErrorCode(this.errorCode);
    }

    get passwordError() {
        const old = this.oldPassword;
        const new1 = this.newPassword;
        const new2 = this.newPasswordRepeat;
        if (!new1.length) return false;

        if (old.length && old === new1) {
            return {
                elem: this.$refs.newPassword,
                error: this.$t('auth.password_no_difference'),
            };
        } else if (new2.length && new1 !== new2) {
            return {
                elem: this.$refs.newPasswordRepeat,
                error: this.$t('auth.password_mismatch'),
            };
        }
        return false;
    }

    @Watch('passwordError')
    verifyPassword() {
        this.$refs.oldPassword.setCustomValidity('');
        this.$refs.newPassword.setCustomValidity('');
        this.$refs.newPasswordRepeat.setCustomValidity('');
        const { elem, error } = this.passwordError || {};
        if (error) {
            elem.setCustomValidity(error);
        } else {
            this.showMismatchWarning = false;
        }
    }

    enableMismatchWarning() {
        this.showMismatchWarning = this.passwordError && true;
    }
}
</script>
