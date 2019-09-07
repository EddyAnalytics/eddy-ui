<template>
    <div>
        <transition name="fade" mode="out-in">
            <div class="form--login">
                <div class="block--small">
                    <div v-if="newPasswordSent">
                        <h2>{{ $t('auth.header_reset_completed') }}</h2>
                        <p>{{ $t('auth.message_reset_completed') }}</p>
                        <router-link :to="{ name: 'sign-in' }" type="button" class="button--cta">
                            {{ $t('auth.button_complete_reset') }}
                        </router-link>
                    </div>
                    <form v-else @submit.prevent="submit">
                        <div class="alert--error" v-if="errorCode">
                            {{ localizedErrorMessage }}
                        </div>
                        <h2>{{ $t('auth.header_forgotten_password') }}</h2>
                        <p>{{ $t('auth.message_forgotten_password') }}</p>
                        <div class="form__field">
                            <input
                                type="email"
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
                        <div class="form__buttons">
                            <button type="submit" class="button--cta pull-right">
                                {{ $t('auth.button_reset_password') }}
                            </button>
                            <router-link
                                :to="{ name: 'sign-in' }"
                                type="button"
                                class="button--alt pull-left"
                            >
                                {{ $t('auth.button_cancel') }}
                            </router-link>
                        </div>
                    </form>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { api } from '@/api';
import { ERROR_CODE, localizeErrorCode } from '@/api/errors';

@Component
export default class PasswordForgottenForm extends Vue {
    name = 'password-forgotten-form';
    newPasswordSent = false;
    email = '';
    errorCode = ERROR_CODE.NONE;

    get localizedErrorMessage() {
        return localizeErrorCode(this.errorCode);
    }

    submit() {
        api.post('password-forgot', { email: this.email })
            .then(() => {
                this.newPasswordSent = true;
            })
            .catch(e => {
                this.errorCode = e.errorCode;
                throw e;
            });
    }
}
</script>
