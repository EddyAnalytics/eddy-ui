<template>
    <div class="row flex-row">
        <div class="col-12 col-lg-6 flex">
            <div class="block flex__item flex--column">
                <h1>{{ $t('profile.header_info') }}</h1>
                <div class="block__content">
                    <div class="row">
                        <div class="col-12 col-sm-6 col-md-4 col-lg-6">
                            <b>{{ $t('profile.label_username') }}</b>
                        </div>
                        <div class="col-12 col-sm-6 col-md-8 col-lg-6">
                            {{ username }}
                        </div>
                    </div>
                </div>

                <router-link
                    class="button--theme align-self-start"
                    :to="{ name: 'change-password' }"
                >
                    {{ $t('profile.link_change_password') }}
                </router-link>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { AUTH } from '@/store/auth';
import { localizeErrorCode } from '@/api/errors';

@Component
export default class Profile extends Vue {
    loading = true;
    errorCode = null;

    get username() {
        return this.$store.getters[AUTH.GET_USERNAME];
    }

    get localizedProjectsError() {
        return localizeErrorCode(this.errorCode);
    }
}
</script>
