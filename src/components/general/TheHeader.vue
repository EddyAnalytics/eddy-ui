<template>
    <header class="header">
        <router-link :to="{ name: 'Home' }" class="logo" title="El Niño">
            <span class="logo__shape">
                <span class="logo__block block-1"></span>
                <span class="logo__block block-2"></span>
                <span class="logo__block block-3"></span>
                <span class="logo__block block-4"></span>
                <span class="logo__block block-5"></span>
                <span class="logo__block block-6"></span>
                <span class="logo__block block-7"></span>
                <span class="logo__block block-8"></span>
                <span class="logo__block block-9"></span>
            </span>
            <span class="logo__text">
                <img src="../../assets/images/logo/logo-elnino.svg" alt="El Niño" title="El Niño" />
                <span class="logo__subtitle">Eddy</span>
            </span>
        </router-link>
        <template>
            <a href="#" class="nav__toggle_mobile" @click="toggleMobileMenu">
                <span class="nav__toggle_mobile__icon">
                    <transition name="fade">
                        <i class="mdi mdi-menu" v-show="!showMobileMenu"></i>
                    </transition>
                    <transition name="fade">
                        <i v-show="showMobileMenu" class="mdi mdi-close"></i>
                    </transition>
                </span>
            </a>
            <nav class="nav" :class="{ 'is-active': showMobileMenu }">
                <ul>
                    <li class="nav__item nav__item--dropdown nav__item--vertical">
                        <LangDropdown />
                    </li>
                    <template v-if="isLoggedIn">
                        <li class="nav__item header__username auth__nav--hide">
                            <router-link
                                tag="button"
                                :to="{ name: 'Profile' }"
                                class="header__link header__profile"
                            >
                                {{ username }}
                            </router-link>
                        </li>
                        <li class="nav__item header__username--mobile auth__nav--hide">
                            <router-link
                                tag="button"
                                :to="{ name: 'Profile' }"
                                class="header__link header__profile"
                            >
                                {{ $t('menu.profile') }}
                            </router-link>
                        </li>
                        <li class="nav__item auth__nav--hide">
                            <button
                                @click="signOut"
                                @click.native="toggleMobileMenu"
                                class="header__link header__logout"
                            >
                                {{ $t('menu.signout') }}
                            </button>
                        </li>
                    </template>
                </ul>
            </nav>
        </template>
    </header>
</template>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import vMediaQuery from 'v-media-query';
import { AUTH } from '@/store/auth';
import LangDropdown from '@/components/general/LangDropdown';

Vue.use(vMediaQuery);

@Component({
    components: {
        LangDropdown,
    },
    watch: {
        '$mq.resize': 'hideMobileMenu',

        showMobileMenu: function(newVal) {
            const className = 'nav__mobile_open';
            if (newVal) {
                document.body.classList.add(className);
            } else {
                document.body.classList.remove(className);
            }
        },
    },
})
export default class TheHeader extends Vue {
    showMobileMenu = false;

    get username() {
        return this.$store.getters[AUTH.GET_USERNAME];
    }

    toggleMobileMenu() {
        if (this.$mq.below(768)) {
            this.showMobileMenu = !this.showMobileMenu;
        } else {
            this.showMobileMenu = false;
        }
    }

    hideMobileMenu() {
        if (this.$mq.above(767)) {
            this.showMobileMenu = false;
        }
    }

    created() {
        this.showMobileMenu = false;
    }

    signOut() {
        this.$store.dispatch(AUTH.LOGOUT).then(() => {
            this.$router.replace({
                name: 'sign-in',
            });
        });
    }

    get isLoggedIn() {
        return this.$store.getters[AUTH.IS_AUTHENTICATED];
    }
}
</script>
