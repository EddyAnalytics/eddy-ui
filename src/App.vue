<template>
    <div class="wrapper" id="app" :class="{ 'wrapper--auth': isAuth() }">
        <the-header :class="{ auth: isAuth() }"></the-header>
        <main class="main">
            <div class="container-fluid">
                <transition>
                    <router-view></router-view>
                </transition>
            </div>
        </main>
        <the-footer></the-footer>
    </div>
</template>

<script>
import '@mdi/font/css/materialdesignicons.css';
import { Vue, Component } from 'vue-property-decorator';
import TheFooter from '@/components/general/TheFooter';
import TheHeader from '@/components/general/TheHeader';

@Component({
    components: {
        TheFooter,
        TheHeader,
    },
})
export default class App extends Vue {
    isAuth() {
        const currentPage = window.location.href;
        return currentPage.indexOf('auth') > -1;
    }
}
</script>

<!-- Import SCSS boilerplate -->
<style src="./assets/css/styles.scss" lang="scss"></style>
