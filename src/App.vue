<template>
    <div>
        <the-header></the-header>
        <main class="main container-fluid">
            <transition>
                <router-view></router-view>
            </transition>
        </main>
        <the-footer></the-footer>
    </div>
</template>

<style lang="scss">
.main {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
}
</style>

<script>
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

<!-- Import MDI Font -->
<style lang="css" src="@mdi/font/css/materialdesignicons.min.css"></style>

<!-- Import Bulma -->
<style src="./assets/scss/bulma.scss" lang="scss"></style>
