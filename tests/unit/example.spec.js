import { shallowMount } from '@vue/test-utils';
import App from '@/App.vue';

describe('App.vue', () => {
    it('renders props.msg when passed', () => {
        const wrapper = shallowMount(App, {});
        console.log(wrapper.props);
    });
});
