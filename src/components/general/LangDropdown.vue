<template>
    <vue-multiselect
        v-model="lang"
        class="uppercase"
        :options="localeOptions"
        :allow-empty="false"
        :searchable="false"
        :select-label="''"
        :selected-label="''"
        :deselect-label="''"
        :placeholder="''"
    >
        <template slot="option" slot-scope="{ option }">
            <span class="uppercase">{{ option }}</span>
        </template>
        <template slot="singleLabel" slot-scope="{ option }">
            <span class="uppercase">{{ option }}</span>
        </template>
    </vue-multiselect>
</template>
<script>
import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { LOCALE } from '@/store/locale';
import { LANGUAGES } from '@/languages';
import VueMultiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';

@Component({
    components: {
        VueMultiselect,
    },
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
