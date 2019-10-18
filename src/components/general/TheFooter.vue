<template>
    <footer class="footer">
        <div class="container">
            <div class="columns is-vcentered">
                <div class="column">
                    <a href="https://www.elnino.tech" target="_blank">
                        <img
                            src="@/assets/img/elnino-logo-white.svg"
                            alt="El Niño"
                            title="El Niño"
                            height="50"
                            width="150"
                        />
                    </a>
                </div>
                <div class="column has-text-right">
                    &copy; {{ new Date().getFullYear() }} Eddy Analytics
                    {{ $t('footer.copyrights') }}
                </div>
            </div>
            <p class="has-text-centered">
                {{ $t('footer.made_with') }} ❤️ {{ $t('footer.made_in') }}
            </p>
        </div>
    </footer>
</template>

<style lang="scss">
.footer {
    flex: 1;
}
</style>

<script>
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class TheFooter extends Vue {}
</script>
