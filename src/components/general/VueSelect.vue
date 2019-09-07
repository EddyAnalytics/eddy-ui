<script>
import Vue from 'vue';
import vSelect from 'vue-select';

Vue.component('v-select', vSelect);

Vue.component('vue-select', {
    extends: vSelect,
    methods: {
        maybeAdjustScroll: () => false,
    },
});
export default {};
</script>
