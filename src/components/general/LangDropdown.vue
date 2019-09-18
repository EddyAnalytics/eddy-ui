<template>
    <b-navbar-dropdown :label="lang.toUpperCase()">
        <b-navbar-item
            v-for="option in localeOptions"
            :key="option"
            href="#"
            @click.stop="lang(option)"
        >
            <span class="is-uppercase">{{ option }}</span>
        </b-navbar-item>
    </b-navbar-dropdown>
</template>

<script>
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { LOCALE } from '@/store/locale';
import { LANGUAGES } from '@/languages';

@Component({
    components: {},
})
export default class LangDropdown extends Vue {
    localeOptions = this.$store.getters[LOCALE.GET] === 'nl' ? LANGUAGES : LANGUAGES.reverse();

    get lang() {
        return this.$store.getters[LOCALE.GET];
    }

    set lang(value) {
        this.$store.dispatch(LOCALE.SET, value);
    }

    @Watch('lang')
    reverseLocaleOptions() {
        this.localeOptions = LANGUAGES.reverse();
    }
}
</script>
