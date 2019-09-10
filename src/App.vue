<template>
    <div class="wrapper" id="app">
        <the-header></the-header>
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
export default class App extends Vue {}
</script>

<!-- Import SCSS boilerplate -->
<style src="./assets/css/styles.scss" lang="scss"></style>
